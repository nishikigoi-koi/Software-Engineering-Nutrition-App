import 'package:flutter/material.dart';
import 'package:flutter_app_web/models/patient.dart';
import 'package:flutter_app_web/models/meal_log.dart';
import 'package:flutter_app_web/models/search_results.dart';
import 'package:flutter_app_web/services/session_manager.dart';
import 'package:flutter_app_web/services/patient_service.dart';
import 'package:flutter_app_web/services/meal_log_service.dart';
import 'package:flutter_app_web/services/food_search_service.dart';
import 'package:flutter_app_web/utils/dialog_utils.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'login_page.dart';
import 'home_page.dart';
import 'patient_page.dart';
import 'custom_food_page.dart';

class MealLogPage extends StatefulWidget {
  const MealLogPage({super.key});

  @override
  _MealLogPageState createState() => _MealLogPageState();
}

class _MealLogPageState extends State<MealLogPage> {
  // ── State ─────────────────────────────────────────────────────────────────

  List<Patient> _patients = [];
  Patient? _selectedPatient;
  List<dynamic> _mealLogs = [];
  bool _isLoading = true;
  bool _isLoadingMeals = false;

  // Search
  final _searchController = TextEditingController();
  List<FoodFileSearchResult> _foodFileResults = [];
  List<CustomFoodSearchResult> _customFoodResults = [];
  bool _isSearching = false;
  bool _hasSearched = false;

  // Selected food for logging
  FoodFileSearchResult? _selectedFoodFile;
  CustomFoodSearchResult? _selectedCustomFood;

  // Log form
  final _amountController = TextEditingController();
  String? _selectedUnit;
  String? _selectedMealType;
  final _dateTimeController = TextEditingController();

  // Date filter
  final _dateFilterController = TextEditingController();
  bool _filterByDate = false;

  final List<String> _unitOptions = ['g', 'ml'];
  final List<String> _mealTypeOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

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

  @override
  void dispose() {
    _searchController.dispose();
    _amountController.dispose();
    _dateTimeController.dispose();
    _dateFilterController.dispose();
    super.dispose();
  }

  // ── API calls ─────────────────────────────────────────────────────────────

  Future<void> _loadPatients() async {
    setState(() => _isLoading = true);
    final userId = SessionManager().currentUser!.id;
    final response = await PatientService.getAllPatients(userId);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _patients = data.map((p) => Patient.fromJson(p)).toList();
        _isLoading = false;
      });
    } else {
      setState(() => _isLoading = false);
      DialogUtils.showError(context, 'Failed to load patients. (${response.statusCode})');
    }
  }

  Future<void> _loadMeals() async {
    if (_selectedPatient == null) return;
    setState(() => _isLoadingMeals = true);

    http.Response response;

    if (_filterByDate && _dateFilterController.text.isNotEmpty) {
      response = await MealLogService.getPatientMealsByDate(
        _dateFilterController.text,
        _selectedPatient!.id,
      );
    } else {
      response = await MealLogService.getPatientMeals(_selectedPatient!.id);
    }

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _mealLogs = data;
        _isLoadingMeals = false;
      });
    } else {
      setState(() => _isLoadingMeals = false);
      DialogUtils.showError(context, 'Failed to load meals. (${response.statusCode})');
    }
  }

  Future<void> _searchFood() async {
    if (_searchController.text.trim().isEmpty) return;
    setState(() {
      _isSearching = true;
      _hasSearched = false;
      _foodFileResults = [];
      _customFoodResults = [];
      _selectedFoodFile = null;
      _selectedCustomFood = null;
    });

    final userId = SessionManager().currentUser!.id;
    final response = await FoodSearchService.searchByName(
      _searchController.text.trim(),
      userId,
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = jsonDecode(response.body);
      setState(() {
        _foodFileResults = (data['foodFiles'] as List? ?? [])
            .map((f) => FoodFileSearchResult.fromJson(f))
            .toList();
        _customFoodResults = (data['customFoods'] as List? ?? [])
            .map((f) => CustomFoodSearchResult.fromJson(f))
            .toList();
        _isSearching = false;
        _hasSearched = true;
      });
    } else {
      setState(() {
        _isSearching = false;
        _hasSearched = true;
      });
      DialogUtils.showError(context, 'Search failed. (${response.statusCode})');
    }
  }

  Future<void> _logMeal() async {
    if (_selectedPatient == null) {
      DialogUtils.showError(context, 'Please select a patient first.');
      return;
    }
    if (_selectedFoodFile == null && _selectedCustomFood == null) {
      DialogUtils.showError(context, 'Please select a food item.');
      return;
    }
    if (_amountController.text.trim().isEmpty ||
        _selectedUnit == null ||
        _selectedMealType == null ||
        _dateTimeController.text.trim().isEmpty) {
      DialogUtils.showError(context, 'Please fill in all meal details.');
      return;
    }

    final food = _selectedFoodFile != null
        ? FCDBFoodReference(_selectedFoodFile!.id)
        : CustomFoodReference(_selectedCustomFood!.id);

    final log = MealLog(
      patientId: _selectedPatient!.id,
      food: food,
      dateTime: DateTime.parse(_dateTimeController.text.trim()),
      amount: double.tryParse(_amountController.text) ?? 0,
      unit: _selectedUnit!,
      mealType: _selectedMealType!,
    );

    final response = await MealLogService.createMealLog(log);

    if (response.statusCode == 200 || response.statusCode == 201) {
      _clearLogForm();
      await _loadMeals();
    } else {
      DialogUtils.showError(context, 'Failed to log meal. (${response.statusCode})');
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  void _selectPatient(Patient patient) {
    setState(() {
      _selectedPatient = patient;
      _mealLogs = [];
      _clearLogForm();
    });
    _loadMeals();
  }

  void _selectFoodFile(FoodFileSearchResult food) {
    setState(() {
      _selectedFoodFile = food;
      _selectedCustomFood = null;
    });
  }

  void _selectCustomFood(CustomFoodSearchResult food) {
    setState(() {
      _selectedCustomFood = food;
      _selectedFoodFile = null;
    });
  }

  void _clearLogForm() {
    setState(() {
      _selectedFoodFile = null;
      _selectedCustomFood = null;
      _amountController.clear();
      _selectedUnit = null;
      _selectedMealType = null;
      _dateTimeController.clear();
      _searchController.clear();
      _foodFileResults = [];
      _customFoodResults = [];
      _hasSearched = false;
    });
  }

  String _selectedFoodName() {
    if (_selectedFoodFile != null) return _selectedFoodFile!.foodName;
    if (_selectedCustomFood != null) return _selectedCustomFood!.foodName;
    return 'None selected';
  }

  // ── Build ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [

                      // ── Left: Patient list ──────────────────────────────
                      Container(
                        width: 220,
                        decoration: BoxDecoration(
                          border: Border(
                            right: BorderSide(color: Color(0xFFE0E0E0)),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Text(
                                'Patients',
                                style: TextStyle(
                                  fontFamily: 'Poppins',
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  color: Color(0xFF1C1C1C),
                                ),
                              ),
                            ),
                            Divider(height: 1),
                            Expanded(
                              child: _patients.isEmpty
                                  ? Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Text(
                                        'No patients found.',
                                        style: TextStyle(
                                          fontFamily: 'Poppins',
                                          fontSize: 13,
                                          color: Color(0xFF87879D),
                                        ),
                                      ),
                                    )
                                  : ListView.builder(
                                      itemCount: _patients.length,
                                      itemBuilder: (context, index) {
                                        final patient = _patients[index];
                                        final isSelected = _selectedPatient?.id == patient.id;
                                        return ListTile(
                                          title: Text(
                                            '${patient.firstName} ${patient.lastName}',
                                            style: TextStyle(
                                              fontFamily: 'Poppins',
                                              fontSize: 14,
                                              color: Color(0xFF1C1C1C),
                                            ),
                                          ),
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

                      // ── Middle: Meal log + search ───────────────────────
                      Expanded(
                        child: _selectedPatient == null
                            ? Center(
                                child: Text(
                                  'Select a patient to view their meal log.',
                                  style: TextStyle(
                                    fontFamily: 'Poppins',
                                    fontSize: 14,
                                    color: Color(0xFF87879D),
                                  ),
                                ),
                              )
                            : Padding(
                                padding: const EdgeInsets.all(24.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    // Patient name + date filter
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            '${_selectedPatient!.firstName} ${_selectedPatient!.lastName}',
                                            style: TextStyle(
                                              fontFamily: 'Poppins',
                                              fontWeight: FontWeight.bold,
                                              fontSize: 22,
                                              color: Color(0xFF1C1C1C),
                                            ),
                                          ),
                                        ),
                                        // Date filter
                                        SizedBox(
                                          width: 180,
                                          child: TextField(
                                            controller: _dateFilterController,
                                            decoration: InputDecoration(
                                              labelText: 'Filter by date (YYYY-MM-DD)',
                                              border: OutlineInputBorder(),
                                              contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                            ),
                                            style: TextStyle(fontSize: 13),
                                          ),
                                        ),
                                        SizedBox(width: 8),
                                        ElevatedButton(
                                          onPressed: () {
                                            setState(() => _filterByDate = _dateFilterController.text.isNotEmpty);
                                            _loadMeals();
                                          },
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Color(0xFF3B62FF),
                                            shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                          ),
                                          child: Text('Filter', style: TextStyle(color: Colors.white, fontFamily: 'Poppins')),
                                        ),
                                        SizedBox(width: 8),
                                        TextButton(
                                          onPressed: () {
                                            _dateFilterController.clear();
                                            setState(() => _filterByDate = false);
                                            _loadMeals();
                                          },
                                          child: Text('Clear', style: TextStyle(fontFamily: 'Poppins', color: Color(0xFF87879D))),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 16),

                                    // Meal log list
                                    Expanded(
                                      child: _isLoadingMeals
                                          ? Center(child: CircularProgressIndicator())
                                          : _mealLogs.isEmpty
                                              ? Text(
                                                  'No meals logged yet.',
                                                  style: TextStyle(
                                                    fontFamily: 'Poppins',
                                                    fontSize: 13,
                                                    color: Color(0xFF87879D),
                                                  ),
                                                )
                                              : ListView.builder(
                                                  itemCount: _mealLogs.length,
                                                  itemBuilder: (context, index) {
                                                    final meal = _mealLogs[index];
                                                    return Container(
                                                      margin: EdgeInsets.only(bottom: 8),
                                                      padding: EdgeInsets.all(12),
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
                                                                Text(
                                                                  meal['mealType'] ?? '',
                                                                  style: TextStyle(
                                                                    fontFamily: 'Poppins',
                                                                    fontWeight: FontWeight.bold,
                                                                    fontSize: 14,
                                                                    color: Color(0xFF1C1C1C),
                                                                  ),
                                                                ),
                                                                Text(
                                                                  meal['dateTime'] ?? '',
                                                                  style: TextStyle(
                                                                    fontFamily: 'Poppins',
                                                                    fontSize: 12,
                                                                    color: Color(0xFF87879D),
                                                                  ),
                                                                ),
                                                              ],
                                                            ),
                                                          ),
                                                          Text(
                                                            '${meal['amount']} ${meal['unit']}',
                                                            style: TextStyle(
                                                              fontFamily: 'Poppins',
                                                              fontSize: 13,
                                                              color: Color(0xFF1C1C1C),
                                                            ),
                                                          ),
                                                        ],
                                                      ),
                                                    );
                                                  },
                                                ),
                                    ),
                                  ],
                                ),
                              ),
                      ),

                      // ── Right: Search + log form ────────────────────────
                      Container(
                        width: 320,
                        decoration: BoxDecoration(
                          border: Border(
                            left: BorderSide(color: Color(0xFFE0E0E0)),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Text(
                                'Log Meal',
                                style: TextStyle(
                                  fontFamily: 'Poppins',
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: Color(0xFF1C1C1C),
                                ),
                              ),
                            ),
                            Divider(height: 1),

                            Expanded(
                              child: SingleChildScrollView(
                                padding: EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.stretch,
                                  children: [

                                    // Search bar
                                    Row(
                                      children: [
                                        Expanded(
                                          child: TextField(
                                            controller: _searchController,
                                            decoration: InputDecoration(
                                              labelText: 'Search food',
                                              border: OutlineInputBorder(),
                                              contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                            ),
                                            style: TextStyle(fontSize: 13),
                                            onSubmitted: (_) => _searchFood(),
                                          ),
                                        ),
                                        SizedBox(width: 8),
                                        ElevatedButton(
                                          onPressed: _isSearching ? null : _searchFood,
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Color(0xFF3B62FF),
                                            disabledBackgroundColor: Color(0xFFCCCCCC),
                                            shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(10),
                                            ),
                                            padding: EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                                          ),
                                          child: _isSearching
                                              ? SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                              : Text('Search', style: TextStyle(color: Colors.white, fontFamily: 'Poppins', fontSize: 13)),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 8),

                                    // Custom food button
                                    TextButton(
                                      onPressed: () {
                                        Navigator.push(
                                          context,
                                          MaterialPageRoute(builder: (_) => CustomFoodPage()),
                                        );
                                      },
                                      child: Text(
                                        'Can\'t find it? Add a custom food →',
                                        style: TextStyle(
                                          fontFamily: 'Poppins',
                                          fontSize: 12,
                                          color: Color(0xFF3B62FF),
                                        ),
                                      ),
                                    ),

                                    // Search results
                                    if (_hasSearched) ...[
                                      SizedBox(height: 8),
                                      if (_foodFileResults.isEmpty && _customFoodResults.isEmpty)
                                        Text(
                                          'No results found.',
                                          style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF87879D)),
                                        )
                                      else ...[
                                        if (_foodFileResults.isNotEmpty) ...[
                                          Text('Database foods', style: TextStyle(fontFamily: 'Poppins', fontSize: 12, color: Color(0xFF87879D))),
                                          SizedBox(height: 4),
                                          ..._foodFileResults.map((f) {
                                            final isSelected = _selectedFoodFile?.id == f.id;
                                            return GestureDetector(
                                              onTap: () => _selectFoodFile(f),
                                              child: Container(
                                                margin: EdgeInsets.only(bottom: 4),
                                                padding: EdgeInsets.all(10),
                                                decoration: BoxDecoration(
                                                  color: isSelected ? Color(0xFFEEF1FF) : Colors.transparent,
                                                  border: Border.all(
                                                    color: isSelected ? Color(0xFF3B62FF) : Color(0xFFE0E0E0),
                                                  ),
                                                  borderRadius: BorderRadius.circular(8),
                                                ),
                                                child: Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    Text(f.foodName, style: TextStyle(fontFamily: 'Poppins', fontSize: 13, fontWeight: FontWeight.w500, color: Color(0xFF1C1C1C))),
                                                    Text('${f.servingSize}${f.servingUnit} · ${f.group}', style: TextStyle(fontFamily: 'Poppins', fontSize: 11, color: Color(0xFF87879D))),
                                                  ],
                                                ),
                                              ),
                                            );
                                          }),
                                          SizedBox(height: 8),
                                        ],
                                        if (_customFoodResults.isNotEmpty) ...[
                                          Text('Custom foods', style: TextStyle(fontFamily: 'Poppins', fontSize: 12, color: Color(0xFF87879D))),
                                          SizedBox(height: 4),
                                          ..._customFoodResults.map((f) {
                                            final isSelected = _selectedCustomFood?.id == f.id;
                                            return GestureDetector(
                                              onTap: () => _selectCustomFood(f),
                                              child: Container(
                                                margin: EdgeInsets.only(bottom: 4),
                                                padding: EdgeInsets.all(10),
                                                decoration: BoxDecoration(
                                                  color: isSelected ? Color(0xFFEEF1FF) : Colors.transparent,
                                                  border: Border.all(
                                                    color: isSelected ? Color(0xFF3B62FF) : Color(0xFFE0E0E0),
                                                  ),
                                                  borderRadius: BorderRadius.circular(8),
                                                ),
                                                child: Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    Text(f.foodName, style: TextStyle(fontFamily: 'Poppins', fontSize: 13, fontWeight: FontWeight.w500, color: Color(0xFF1C1C1C))),
                                                    Text('${f.servingSize}${f.servingUnit} · ${f.group}', style: TextStyle(fontFamily: 'Poppins', fontSize: 11, color: Color(0xFF87879D))),
                                                  ],
                                                ),
                                              ),
                                            );
                                          }),
                                        ],
                                      ],
                                    ],

                                    // Log form — shown when a food is selected
                                    if (_selectedFoodFile != null || _selectedCustomFood != null) ...[
                                      Divider(height: 24),
                                      Text(
                                        'Logging: ${_selectedFoodName()}',
                                        style: TextStyle(fontFamily: 'Poppins', fontSize: 13, fontWeight: FontWeight.w500, color: Color(0xFF1C1C1C)),
                                      ),
                                      SizedBox(height: 12),

                                      // Amount + unit
                                      Row(
                                        children: [
                                          Expanded(
                                            child: TextField(
                                              controller: _amountController,
                                              decoration: InputDecoration(
                                                labelText: 'Amount',
                                                border: OutlineInputBorder(),
                                                contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                              ),
                                              keyboardType: TextInputType.number,
                                              style: TextStyle(fontSize: 13),
                                            ),
                                          ),
                                          SizedBox(width: 8),
                                          Expanded(
                                            child: DropdownButtonFormField<String>(
                                              initialValue: _selectedUnit,
                                              decoration: InputDecoration(
                                                labelText: 'Unit',
                                                border: OutlineInputBorder(),
                                                contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                              ),
                                              style: TextStyle(fontSize: 13, color: Color(0xFF1C1C1C)),
                                              items: _unitOptions.map((u) => DropdownMenuItem(value: u, child: Text(u))).toList(),
                                              onChanged: (v) => setState(() => _selectedUnit = v),
                                            ),
                                          ),
                                        ],
                                      ),
                                      SizedBox(height: 12),

                                      // Meal type
                                      DropdownButtonFormField<String>(
                                        initialValue: _selectedMealType,
                                        decoration: InputDecoration(
                                          labelText: 'Meal type',
                                          border: OutlineInputBorder(),
                                          contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                        ),
                                        style: TextStyle(fontSize: 13, color: Color(0xFF1C1C1C)),
                                        items: _mealTypeOptions.map((m) => DropdownMenuItem(value: m, child: Text(m))).toList(),
                                        onChanged: (v) => setState(() => _selectedMealType = v),
                                      ),
                                      SizedBox(height: 12),

                                      // Date/time
                                      TextField(
                                        controller: _dateTimeController,
                                        decoration: InputDecoration(
                                          labelText: 'Date & time (YYYY-MM-DDTHH:MM:SS)',
                                          border: OutlineInputBorder(),
                                          contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                        ),
                                        style: TextStyle(fontSize: 13),
                                      ),
                                      SizedBox(height: 16),

                                      // Log button
                                      ElevatedButton(
                                        onPressed: _logMeal,
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: Color(0xFF3B62FF),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(10),
                                          ),
                                          padding: EdgeInsets.symmetric(vertical: 14),
                                        ),
                                        child: Text('Log Meal', style: TextStyle(color: Colors.white, fontFamily: 'Poppins', fontSize: 14)),
                                      ),
                                      SizedBox(height: 8),
                                      TextButton(
                                        onPressed: _clearLogForm,
                                        child: Text('Clear', style: TextStyle(fontFamily: 'Poppins', color: Color(0xFF87879D))),
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ),
                          ],
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
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => HomePage()),
                    (route) => false,
                  );
                }),
                _navButton('Patients', Icons.people, () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => PatientPage()),
                    (route) => false,
                  );
                }),
                _navButton('Meals', Icons.restaurant, null),
                _navButton('Reports', Icons.bar_chart, () {}),
                _navButton('Settings', Icons.settings, () {}),
              ],
            ),
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
            Text(
              label,
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                color: Color(0xFF3B62FF),
              ),
            ),
          ],
        ),
      ),
    );
  }
}