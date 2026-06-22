import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter_app_web/models/patient.dart';
import 'package:flutter_app_web/models/report.dart';
import 'package:flutter_app_web/services/session_manager.dart';
import 'package:flutter_app_web/services/patient_service.dart';
import 'package:flutter_app_web/services/report_service.dart';
import 'package:flutter_app_web/services/meal_log_service.dart';
import 'package:flutter_app_web/services/food_search_service.dart';
import 'package:flutter_app_web/utils/dialog_utils.dart';
import 'package:flutter_app_web/utils/string_utils.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'login_page.dart';
import 'home_page.dart';
import 'patient_page.dart';
import 'meal_log_page.dart';
import 'settings_page.dart';

enum ReportPeriod { day, week, custom }

class ReportPage extends StatefulWidget {
  const ReportPage({super.key});

  @override
  _ReportPageState createState() => _ReportPageState();
}

class _ReportPageState extends State<ReportPage> {
  List<Patient> _patients = [];
  Patient? _selectedPatient;
  bool _isLoadingPatients = true;
  bool _isLoadingReport = false;
  bool _isExporting = false;

  Report? _report;
  List<Map<String, dynamic>> _mealDetails = [];

  ReportPeriod _period = ReportPeriod.day;
  DateTime _dayDate = DateTime.now();
  DateTime _weekStartDate = DateTime.now();
  DateTime _customStartDate = DateTime.now().subtract(Duration(days: 6));
  DateTime _customEndDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (SessionManager().currentUser == null) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => LoginPage()),
          (route) => false,
        );
      } else {
        _loadPatients();
      }
    });
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  // DD-MM-YYYY for display purposes
  String _formatDateDisplay(String isoDate) {
    final parts = isoDate.split('-');
    if (parts.length < 3) return isoDate;
    return '${parts[2]}-${parts[1]}-${parts[0]}';
  }

  // DD-MM-YYYY HH:MM from an ISO datetime string
  String _formatDateTimeDisplay(String? isoDateTime) {
    if (isoDateTime == null) return '';
    final dt = DateTime.tryParse(isoDateTime);
    if (dt == null) return isoDateTime;
    return '${dt.day.toString().padLeft(2, '0')}-${dt.month.toString().padLeft(2, '0')}-${dt.year} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }

  // Converts API macro names like "totalFat", "saturatedFat", "protien" to display names
  String _formatMacroName(String name) {
    const Map<String, String> macroNames = {
      'protien': 'Protein', // Fallback for any old spelling mistakes
      'protein': 'Protein',
      'carbohydrates': 'Carbohydrates',
      'totalFat': 'Total Fat',
      'saturatedFat': 'Saturated Fat',
      'sodium': 'Sodium',
      'sugars': 'Sugars',
      'fiber': 'Fiber',
    };
    return macroNames[name] ?? name;
  }

  // Formats numbers to 2dp, fallback to original string
  String _format2DP(String? value) {
    if (value == null) return '';
    final d = double.tryParse(value);
    if (d == null) return value;
    return d.toStringAsFixed(2);
  }

  // ── API calls ─────────────────────────────────────────────────────────────

  Future<void> _loadPatients() async {
    setState(() => _isLoadingPatients = true);
    final userId = SessionManager().currentUser!.id;
    final response = await PatientService.getAllPatients(userId);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _patients = data.map((p) => Patient.fromJson(p)).toList();
        _isLoadingPatients = false;
      });
    } else if (response.statusCode == 404) {
      setState(() {
        _patients = [];
        _isLoadingPatients = false;
      });
    } else {
      setState(() => _isLoadingPatients = false);
      DialogUtils.showError(context, 'Failed to load patients. (${response.statusCode})');
    }
  }

  Future<void> _generateReport() async {
    if (_selectedPatient == null) return;
    setState(() {
      _isLoadingReport = true;
      _report = null;
      _mealDetails = [];
    });

    final response = switch (_period) {
      ReportPeriod.day => await ReportService.dayReport(_formatDate(_dayDate), _selectedPatient!.id),
      ReportPeriod.week => await ReportService.weekReport(_formatDate(_weekStartDate), _selectedPatient!.id),
      ReportPeriod.custom => await ReportService.customReport(
          _formatDate(_customStartDate),
          _formatDate(_customEndDate),
          _selectedPatient!.id,
        ),
    };

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final report = Report.fromJson(data);
      setState(() {
        _report = report;
        _isLoadingReport = false;
      });
      await _loadMealDetails(report);
    } else if (response.statusCode == 404) {
      setState(() => _isLoadingReport = false);
      DialogUtils.showError(context, 'No report data found for this period.');
    } else {
      setState(() => _isLoadingReport = false);
      DialogUtils.showError(context, 'Failed to generate report. (${response.statusCode})');
    }
  }

  // Fetches full meal log details for each foodLogId referenced in the report,
  // then sorts them by the time they were logged.
  Future<void> _loadMealDetails(Report report) async {
    if (_selectedPatient == null) return;

    // Pull the patient's full meal logs over the same period and
    // filter down to just the ones referenced in this report.
    final logIds = report.foodLogs.map((f) => f.foodLogId).toSet();

    final response = await MealLogService.getPatientMeals(_selectedPatient!.id);
    if (response.statusCode != 200) return;

    final List<dynamic> allMeals = jsonDecode(response.body);
    final relevantMeals = allMeals.where((m) => logIds.contains(m['id'])).toList();

    // Look up food names for each meal
    final List<Map<String, dynamic>> detailed = [];
    for (final meal in relevantMeals) {
      String foodName = meal['FCDBFoodId'] ?? meal['CustomFoodId'] ?? 'Unknown food';
      final fcdbId = meal['FCDBFoodId'];
      final customId = meal['CustomFoodId'];

      if (fcdbId != null) {
        final foodResponse = await FoodSearchService.searchFoodFiles(fcdbId);
        if (foodResponse.statusCode == 200) {
          final foodData = jsonDecode(foodResponse.body);
          foodName = foodData['foodName'] ?? fcdbId;
        }
      } else if (customId != null) {
        final foodResponse = await FoodSearchService.searchCustomFood(customId);
        if (foodResponse.statusCode == 200) {
          final foodData = jsonDecode(foodResponse.body);
          foodName = foodData['foodName'] ?? customId;
        }
      }

      detailed.add({
        'foodName': foodName,
        'mealType': meal['mealType'],
        'dateTime': meal['dateTime'],
        'amount': meal['amount'],
        'unit': meal['unit'],
      });
    }

    // Sort by time logged
    detailed.sort((a, b) {
      final aTime = DateTime.tryParse(a['dateTime'] ?? '') ?? DateTime(0);
      final bTime = DateTime.tryParse(b['dateTime'] ?? '') ?? DateTime(0);
      return aTime.compareTo(bTime);
    });

    setState(() => _mealDetails = detailed);
  }

  // ── PDF export ────────────────────────────────────────────────────────────

  Future<void> _exportPdf() async {
    if (_report == null) return;
    setState(() => _isExporting = true);

    final report = _report!;
    final doc = pw.Document();

    doc.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        build: (context) => [
          pw.Header(level: 0, child: pw.Text(report.title.replaceAllMapped(RegExp(r'\d{4}-\d{2}-\d{2}'), (m) => _formatDateDisplay(m.group(0)!)), style: pw.TextStyle(fontSize: 20, fontWeight: pw.FontWeight.bold))),
          pw.Text('Date: ${_formatDateDisplay(report.date)}'),
          pw.Text('Patient: ${report.patientName}'),
          pw.SizedBox(height: 16),

          pw.Text('Energy', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
          pw.Text(
            '${StringUtils.capitalize(report.energy.name)}: intake ${_format2DP(report.energy.intake)} ${report.energy.unit} / RDI ${_format2DP(report.energy.rdi)} ${report.energy.unit} (${report.energy.direction})',
          ),
          pw.SizedBox(height: 12),

          pw.Text('Macronutrients', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
          pw.TableHelper.fromTextArray(
            headers: ['Name', 'Intake', 'Min RDI', 'Max RDI', 'Direction'],
            data: report.macronutrients
                .map((m) => [_formatMacroName(m.name), '${_format2DP(m.intake)} ${m.unit}', '${_format2DP(m.minRDI)} ${m.unit}', '${_format2DP(m.maxRDI)} ${m.unit}', m.direction])
                .toList(),
          ),
          pw.SizedBox(height: 12),

          pw.Text('Micronutrients', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
          pw.TableHelper.fromTextArray(
            headers: ['Name', 'Intake', 'RDI', 'Direction'],
            data: report.micronutrients
                .map((m) => [m.name, '${_format2DP(m.intake)} ${m.unit}', '${_format2DP(m.rdi)} ${m.unit}', m.direction])
                .toList(),
          ),
          pw.SizedBox(height: 12),

          pw.Text('Logged Meals', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
          _mealDetails.isEmpty
              ? pw.Text('No meals logged for this period.')
              : pw.TableHelper.fromTextArray(
                  headers: ['Food', 'Meal Type', 'Date/Time', 'Amount'],
                  data: _mealDetails
                      .map((m) => [
                            StringUtils.pdfSafe(m['foodName'].toString()),
                            m['mealType'].toString(),
                            _formatDateTimeDisplay(m['dateTime']?.toString()),
                            '${m['amount']} ${m['unit']}',
                          ])
                      .toList(),
                ),
        ],
      ),
    );

    final bytes = await doc.save();
    setState(() => _isExporting = false);

    await Printing.sharePdf(bytes: bytes, filename: 'report_${_selectedPatient!.firstName}_${_selectedPatient!.lastName}_${_formatDate(_dayDate)}.pdf');
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  void _selectPatient(Patient patient) {
    setState(() {
      _selectedPatient = patient;
      _report = null;
      _mealDetails = [];
    });
  }

  Future<void> _pickDate(DateTime initial, ValueChanged<DateTime> onPicked) async {
    final date = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
    );
    if (date != null) onPicked(date);
  }

  Widget _dateButton(String label, DateTime date, VoidCallback onTap) {
    return OutlinedButton(
      onPressed: onTap,
      child: Text('$label: ${_formatDate(date)}', style: TextStyle(fontFamily: 'Poppins', fontSize: 13)),
    );
  }

  // ── Build ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: _isLoadingPatients
                ? Center(child: CircularProgressIndicator())
                : Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [

                      // ── Left: Patient list ──────────────────────────────
                      Container(
                        width: 220,
                        decoration: BoxDecoration(
                          border: Border(right: BorderSide(color: Color(0xFFE0E0E0))),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Text('Patients', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1C1C1C))),
                            ),
                            Divider(height: 1),
                            Expanded(
                              child: _patients.isEmpty
                                  ? Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Text('No patients found.', style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF87879D))),
                                    )
                                  : ListView.builder(
                                      itemCount: _patients.length,
                                      itemBuilder: (context, index) {
                                        final patient = _patients[index];
                                        final isSelected = _selectedPatient?.id == patient.id;
                                        return ListTile(
                                          title: Text('${patient.firstName} ${patient.lastName}', style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF1C1C1C))),
                                          selected: isSelected,
                                          selectedTileColor: Color(0xFFEEF1FF),
                                          onTap: () => _selectPatient(patient),
                                        );
                                      },
                                    ),
                            ),
                          ],
                        ),
                      ),

                      // ── Main: report area ────────────────────────────────
                      Expanded(
                        child: _selectedPatient == null
                            ? Center(child: Text('Select a patient to generate a report.', style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF87879D))))
                            : Padding(
                                padding: const EdgeInsets.all(24.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '${_selectedPatient!.firstName} ${_selectedPatient!.lastName}',
                                      style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 22, color: Color(0xFF1C1C1C)),
                                    ),
                                    SizedBox(height: 16),

                                    // Period tabs
                                    Row(
                                      children: [
                                        _periodTab('Day', ReportPeriod.day),
                                        SizedBox(width: 8),
                                        _periodTab('Week', ReportPeriod.week),
                                        SizedBox(width: 8),
                                        _periodTab('Custom', ReportPeriod.custom),
                                      ],
                                    ),
                                    SizedBox(height: 16),

                                    // Date selectors based on period
                                    if (_period == ReportPeriod.day)
                                      _dateButton('Date', _dayDate, () => _pickDate(_dayDate, (d) => setState(() => _dayDate = d)))
                                    else if (_period == ReportPeriod.week)
                                      _dateButton('Week starting', _weekStartDate, () => _pickDate(_weekStartDate, (d) => setState(() => _weekStartDate = d)))
                                    else
                                      Row(
                                        children: [
                                          _dateButton('Start', _customStartDate, () => _pickDate(_customStartDate, (d) => setState(() => _customStartDate = d))),
                                          SizedBox(width: 8),
                                          _dateButton('End', _customEndDate, () => _pickDate(_customEndDate, (d) => setState(() => _customEndDate = d))),
                                        ],
                                      ),
                                    SizedBox(height: 16),

                                    Row(
                                      children: [
                                        ElevatedButton(
                                          onPressed: _isLoadingReport ? null : _generateReport,
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Color(0xFF3B62FF),
                                            disabledBackgroundColor: Color(0xFFCCCCCC),
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                            padding: EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                                          ),
                                          child: Text(
                                            _isLoadingReport ? 'Generating...' : 'Generate Report',
                                            style: TextStyle(color: Colors.white, fontFamily: 'Poppins'),
                                          ),
                                        ),
                                        SizedBox(width: 12),
                                        if (_report != null)
                                          ElevatedButton.icon(
                                            onPressed: _isExporting ? null : _exportPdf,
                                            icon: Icon(Icons.download, color: Colors.white, size: 18),
                                            label: Text(
                                              _isExporting ? 'Exporting...' : 'Export PDF',
                                              style: TextStyle(color: Colors.white, fontFamily: 'Poppins'),
                                            ),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: Color(0xFF1C1C1C),
                                              disabledBackgroundColor: Color(0xFFCCCCCC),
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                                            ),
                                          ),
                                      ],
                                    ),
                                    SizedBox(height: 20),

                                    Expanded(
                                      child: _isLoadingReport
                                          ? Center(child: CircularProgressIndicator())
                                          : _report == null
                                              ? Text('No report generated yet.', style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF87879D)))
                                              : _buildReportView(_report!),
                                    ),
                                  ],
                                ),
                              ),
                      ),
                    ],
                  ),
          ),

          // ── Bottom navbar ───────────────────────────────────────────────
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Color(0xFFE0E0E0))),
            ),
            child: Row(
              children: [
                _navButton('Home', Icons.home, () {
                  Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => HomePage()), (route) => false);
                }),
                _navButton('Patients', Icons.people, () {
                  Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => PatientPage()), (route) => false);
                }),
                _navButton('Meals', Icons.restaurant, () {
                  Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => MealLogPage()), (route) => false);
                }),
                _navButton('Reports', Icons.bar_chart, null),
                _navButton('Settings', Icons.settings, () {
                  Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => SettingsPage()), (route) => false);
                }),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _periodTab(String label, ReportPeriod period) {
    final isSelected = _period == period;
    return OutlinedButton(
      onPressed: () => setState(() => _period = period),
      style: OutlinedButton.styleFrom(
        backgroundColor: isSelected ? Color(0xFF3B62FF) : Colors.transparent,
        side: BorderSide(color: isSelected ? Color(0xFF3B62FF) : Color(0xFFBDBDBD)),
      ),
      child: Text(
        label,
        style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: isSelected ? Colors.white : Color(0xFF1C1C1C)),
      ),
    );
  }

  Widget _buildReportView(Report report) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(report.title.replaceAllMapped(RegExp(r'\d{4}-\d{2}-\d{2}'), (m) => _formatDateDisplay(m.group(0)!)), style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1C1C1C))),
          SizedBox(height: 4),
          Text('Date: ${_formatDateDisplay(report.date)}', style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF87879D))),
          SizedBox(height: 16),

          Text('Energy', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1C1C1C))),
          SizedBox(height: 6),
          Text(
            '${_format2DP(report.energy.intake)} ${report.energy.unit} / ${_format2DP(report.energy.rdi)} ${report.energy.unit} RDI (${report.energy.direction})',
            style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF1C1C1C)),
          ),
          SizedBox(height: 20),

          Text('Macronutrients', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1C1C1C))),
          SizedBox(height: 6),
          ...report.macronutrients.map((m) => Padding(
                padding: EdgeInsets.symmetric(vertical: 2),
                child: Text(
                  '${_formatMacroName(m.name)}: ${_format2DP(m.intake)} ${m.unit} (RDI ${_format2DP(m.minRDI)}–${_format2DP(m.maxRDI)} ${m.unit}) — ${m.direction}',
                  style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF1C1C1C)),
                ),
              )),
          SizedBox(height: 20),

          Text('Micronutrients', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1C1C1C))),
          SizedBox(height: 6),
          ...report.micronutrients.map((m) => Padding(
                padding: EdgeInsets.symmetric(vertical: 2),
                child: Text(
                  '${m.name}: ${_format2DP(m.intake)} ${m.unit} (RDI ${_format2DP(m.rdi)} ${m.unit}) — ${m.direction}',
                  style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF1C1C1C)),
                ),
              )),
          SizedBox(height: 20),

          Text('Logged Meals', style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1C1C1C))),
          SizedBox(height: 6),
          _mealDetails.isEmpty
              ? Text('No meals logged for this period.', style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF87879D)))
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: _mealDetails.map((m) {
                    return Container(
                      margin: EdgeInsets.only(bottom: 8),
                      padding: EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        border: Border.all(color: Color(0xFFE0E0E0)),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(m['foodName'].toString(), style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF1C1C1C))),
                                Text('${m['mealType']} · ${_formatDateTimeDisplay(m['dateTime']?.toString())}', style: TextStyle(fontFamily: 'Poppins', fontSize: 11, color: Color(0xFF87879D))),
                              ],
                            ),
                          ),
                          Text('${m['amount']} ${m['unit']}', style: TextStyle(fontFamily: 'Poppins', fontSize: 12, color: Color(0xFF1C1C1C))),
                        ],
                      ),
                    );
                  }).toList(),
                ),
        ],
      ),
    );
  }

  Widget _navButton(String label, IconData icon, VoidCallback? onPressed) {
    return Expanded(
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          padding: EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.zero),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: Color(0xFF3B62FF), size: 22),
            SizedBox(height: 4),
            Text(label, style: TextStyle(fontFamily: 'Poppins', fontSize: 12, color: Color(0xFF3B62FF))),
          ],
        ),
      ),
    );
  }
}