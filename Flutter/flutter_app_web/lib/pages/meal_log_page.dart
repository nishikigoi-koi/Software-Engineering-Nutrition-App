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
import 'report_page.dart';
import 'settings_page.dart';

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
  Map<String, String> _foodNames = {};

  // Search
  final _searchController = TextEditingController();
  List<FoodFileSearchResult> _foodFileResults = [];
  List<CustomFoodSearchResult> _customFoodResults = [];
  bool _isSearching = false;
  bool _hasSearched = false;

  // Selected food for logging
  FoodFileSearchResult? _selectedFoodFile;
  CustomFoodSearchResult? _selectedCustomFood;

  // Selected meal for editing
  Map<String, dynamic>? _selectedMeal;

  // Log form
  final _amountController = TextEditingController();
  String? _selectedUnit;
  String? _selectedMealType;
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;

  // Date filter
  DateTime? _filterDate;
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
    } else if (response.statusCode == 404) {
      setState(() {
        _patients = [];
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

    if (_filterByDate && _filterDate != null) {
      final dateString = '${_filterDate!.year}-${_filterDate!.month.toString().padLeft(2, '0')}-${_filterDate!.day.toString().padLeft(2, '0')}';
      response = await MealLogService.getPatientMealsByDate(dateString, _selectedPatient!.id);
    } else {
      response = await MealLogService.getPatientMeals(_selectedPatient!.id);
    }

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      debugPrint('Meals loaded: ${data.length}');
      setState(() {
        _mealLogs = data;
        _isLoadingMeals = false;
      });
      await _loadFoodNames();
    } else if (response.statusCode == 404) {
      setState(() {
        _mealLogs = [];
        _isLoadingMeals = false;
      });
    } else {
      setState(() => _isLoadingMeals = false);
      DialogUtils.showError(context, 'Failed to load meals. (${response.statusCode})');
    }
  }

  Future<void> _loadFoodNames() async {
    for (final meal in _mealLogs) {
      final fcdbId = meal['FCDBFoodId'];
      final customId = meal['CustomFoodId'];

      if (fcdbId != null && !_foodNames.containsKey(fcdbId)) {
        final response = await FoodSearchService.searchFoodFiles(fcdbId);
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          _foodNames[fcdbId] = data['foodName'] ?? fcdbId;
        }
      }

      if (customId != null && !_foodNames.containsKey(customId)) {
        final response = await FoodSearchService.searchCustomFood(customId);
        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          _foodNames[customId] = data['foodName'] ?? customId;
        }
      }
    }
    setState(() {});
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
    final response = await FoodSearchService.searchByName(_searchController.text.trim(), userId);

    if (response.statusCode == 200) {
      final Map<String, dynamic> data = jsonDecode(response.body);
      setState(() {
        _foodFileResults = (data['foodFile'] as List? ?? [])
            .map((f) => FoodFileSearchResult.fromJson(f))
            .toList();
        _customFoodResults = (data['customFood'] as List? ?? [])
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
    if (_selectedMeal == null && _selectedFoodFile == null && _selectedCustomFood == null) {
      DialogUtils.showError(context, 'Please select a food item.');
      return;
    }
    if (_amountController.text.trim().isEmpty ||
        _selectedUnit == null ||
        _selectedMealType == null ||
        _selectedDate == null ||
        _selectedTime == null) {
      DialogUtils.showError(context, 'Please fill in all meal details.');
      return;
    }

    final dateTime = DateTime(
      _selectedDate!.year,
      _selectedDate!.month,
      _selectedDate!.day,
      _selectedTime!.hour,
      _selectedTime!.minute,
    );

    final food = _selectedMeal != null
    ? (_selectedMeal!['FCDBFoodId'] != null
        ? FCDBFoodReference(_selectedMeal!['FCDBFoodId'])
        : CustomFoodReference(_selectedMeal!['CustomFoodId']))
    : (_selectedFoodFile != null
        ? FCDBFoodReference(_selectedFoodFile!.id)
        : CustomFoodReference(_selectedCustomFood!.id));

    final log = MealLog(
      patientId: _selectedPatient!.id,
      food: food,
      dateTime: dateTime,
      amount: double.tryParse(_amountController.text) ?? 0,
      unit: _selectedUnit!,
      mealType: _selectedMealType!,
    );

    if (_selectedMeal != null) {
      // Editing existing meal
      final response = await MealLogService.updateMealLog(_selectedMeal!['id'], log);
      if (response.statusCode == 200) {
        _clearLogForm();
        await _loadMeals();
      } else {
        DialogUtils.showError(context, 'Failed to update meal. (${response.statusCode})');
      }
    } else {
      // Creating new meal
      final response = await MealLogService.createMealLog(log);
      if (response.statusCode == 200 || response.statusCode == 201) {
        _clearLogForm();
        await _loadMeals();
      } else {
        DialogUtils.showError(context, 'Failed to log meal. (${response.statusCode})');
      }
    }
  }

  Future<void> _deleteMeal(Map<String, dynamic> meal) async {
    debugPrint('_deleteMeal called for ${meal['id']}');
    final response = await MealLogService.deleteMealLog(meal['id']);
    debugPrint('Delete status: ${response.statusCode}');
    debugPrint('Delete body: ${response.body}');
    if (response.statusCode == 200 || response.statusCode == 204) {
      if (_selectedMeal?['id'] == meal['id']) _clearLogForm();
      await _loadMeals();
    } else {
      DialogUtils.showError(context, 'Failed to delete meal. (${response.statusCode})');
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

  void _selectMealForEditing(Map<String, dynamic> meal) {
    final dateTime = DateTime.tryParse(meal['dateTime'] ?? '');
    setState(() {
      _selectedMeal = meal;
      _selectedFoodFile = null;
      _selectedCustomFood = null;
      _amountController.text = meal['amount'].toString();
      _selectedUnit = meal['unit'];
      _selectedMealType = meal['mealType'];
      _selectedDate = dateTime;
      _selectedTime = dateTime != null ? TimeOfDay(hour: dateTime.hour, minute: dateTime.minute) : null;
      _searchController.clear();
      _foodFileResults = [];
      _customFoodResults = [];
      _hasSearched = false;
    });
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
      _selectedMeal = null;
      _selectedFoodFile = null;
      _selectedCustomFood = null;
      _amountController.clear();
      _selectedUnit = null;
      _selectedMealType = null;
      _selectedDate = null;
      _selectedTime = null;
      _searchController.clear();
      _foodFileResults = [];
      _customFoodResults = [];
      _hasSearched = false;
    });
  }

  String _selectedFoodName() {
    if (_selectedFoodFile != null) return _selectedFoodFile!.foodName;
    if (_selectedCustomFood != null) return _selectedCustomFood!.foodName;
    if (_selectedMeal != null) {
      final foodId = _selectedMeal!['FCDBFoodId'] ?? _selectedMeal!['CustomFoodId'] ?? '';
      return _foodNames[foodId] ?? foodId;
    }
    return 'None selected';
  }

  void _confirmDeleteMeal(Map<String, dynamic> meal) {
    final foodId = meal['FCDBFoodId'] ?? meal['CustomFoodId'] ?? '';
    final foodName = _foodNames[foodId] ?? foodId;
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Delete Meal'),
        content: Text('Are you sure you want to delete the log for $foodName? This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              debugPrint('About to call _deleteMeal');
              Navigator.pop(context);
              _deleteMeal(meal);
            },
            child: Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  // ── Build ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final bool isEditing = _selectedMeal != null;

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

                      // ── Middle: Meal log ────────────────────────────────
                      Expanded(
                        child: _selectedPatient == null
                            ? Center(child: Text('Select a patient to view their meal log.', style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF87879D))))
                            : Padding(
                                padding: const EdgeInsets.all(24.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text('${_selectedPatient!.firstName} ${_selectedPatient!.lastName}',
                                              style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 22, color: Color(0xFF1C1C1C))),
                                        ),
                                        OutlinedButton(
                                          onPressed: () async {
                                            final date = await showDatePicker(
                                              context: context,
                                              initialDate: _filterDate ?? DateTime.now(),
                                              firstDate: DateTime(2000),
                                              lastDate: DateTime.now(),
                                            );
                                            if (date != null) setState(() => _filterDate = date);
                                          },
                                          child: Text(
                                            _filterDate != null
                                                ? '${_filterDate!.year}-${_filterDate!.month.toString().padLeft(2, '0')}-${_filterDate!.day.toString().padLeft(2, '0')}'
                                                : 'Filter by date',
                                            style: TextStyle(fontFamily: 'Poppins', fontSize: 13),
                                          ),
                                        ),
                                        SizedBox(width: 8),
                                        ElevatedButton(
                                          onPressed: () {
                                            setState(() => _filterByDate = _filterDate != null);
                                            _loadMeals();
                                          },
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Color(0xFF3B62FF),
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                          ),
                                          child: Text('Filter', style: TextStyle(color: Colors.white, fontFamily: 'Poppins')),
                                        ),
                                        SizedBox(width: 8),
                                        TextButton(
                                          onPressed: () {
                                            setState(() { _filterDate = null; _filterByDate = false; });
                                            _loadMeals();
                                          },
                                          child: Text('Clear', style: TextStyle(fontFamily: 'Poppins', color: Color(0xFF87879D))),
                                        ),
                                      ],
                                    ),
                                    SizedBox(height: 16),
                                    Expanded(
                                      child: _isLoadingMeals
                                          ? Center(child: CircularProgressIndicator())
                                          : _mealLogs.isEmpty
                                              ? Text('No meals logged yet.', style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF87879D)))
                                              : ListView.builder(
                                                  itemCount: _mealLogs.length,
                                                  itemBuilder: (context, index) {
                                                    final meal = _mealLogs[index];
                                                    final foodId = meal['FCDBFoodId'] ?? meal['CustomFoodId'] ?? '';
                                                    final foodName = _foodNames[foodId] ?? foodId;
                                                    final isSelected = _selectedMeal?['id'] == meal['id'];
                                                    return Container(
                                                      margin: EdgeInsets.only(bottom: 8),
                                                      decoration: BoxDecoration(
                                                        border: Border.all(color: isSelected ? Color(0xFF3B62FF) : Color(0xFFE0E0E0)),
                                                        borderRadius: BorderRadius.circular(8),
                                                        color: isSelected ? Color(0xFFEEF1FF) : Colors.transparent,
                                                      ),
                                                      child: ListTile(
                                                        title: Text(foodName, style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF1C1C1C))),
                                                        subtitle: Text(meal['dateTime'] ?? '', style: TextStyle(fontFamily: 'Poppins', fontSize: 12, color: Color(0xFF87879D))),
                                                        trailing: Row(
                                                          mainAxisSize: MainAxisSize.min,
                                                          children: [
                                                            Text('${meal['amount']} ${meal['unit']}', style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF1C1C1C))),
                                                            SizedBox(width: 8),
                                                            IconButton(
                                                              icon: Icon(Icons.edit, size: 18, color: Color(0xFF3B62FF)),
                                                              tooltip: 'Edit',
                                                              onPressed: () => _selectMealForEditing(meal),
                                                            ),
                                                            IconButton(
                                                              icon: Icon(Icons.delete, size: 18, color: Colors.red),
                                                              tooltip: 'Delete',
                                                              onPressed: () => _confirmDeleteMeal(meal),
                                                            ),
                                                          ],
                                                        ),
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
                          border: Border(left: BorderSide(color: Color(0xFFE0E0E0))),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Text(
                                isEditing ? 'Edit Meal' : 'Log Meal',
                                style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1C1C1C)),
                              ),
                            ),
                            Divider(height: 1),

                            // Search — hidden when editing since food can't change
                            if (!isEditing)
                              Expanded(
                                child: SingleChildScrollView(
                                  padding: EdgeInsets.all(16),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.stretch,
                                    children: [
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
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                              padding: EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                                            ),
                                            child: _isSearching
                                                ? SizedBox(width: 16, height: 16, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                                                : Text('Search', style: TextStyle(color: Colors.white, fontFamily: 'Poppins', fontSize: 13)),
                                          ),
                                        ],
                                      ),
                                      SizedBox(height: 8),
                                      TextButton(
                                        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => CustomFoodPage())),
                                        child: Text('Can\'t find it? Add a custom food →', style: TextStyle(fontFamily: 'Poppins', fontSize: 12, color: Color(0xFF3B62FF))),
                                      ),
                                      if (_hasSearched) ...[
                                        SizedBox(height: 8),
                                        if (_foodFileResults.isEmpty && _customFoodResults.isEmpty)
                                          Text('No results found.', style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF87879D)))
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
                                                    border: Border.all(color: isSelected ? Color(0xFF3B62FF) : Color(0xFFE0E0E0)),
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
                                                    border: Border.all(color: isSelected ? Color(0xFF3B62FF) : Color(0xFFE0E0E0)),
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
                                    ],
                                  ),
                                ),
                              )
                            else
                              Expanded(child: SizedBox()),

                            // Log/edit form — fixed at bottom
                            Container(
                              decoration: BoxDecoration(
                                border: Border(top: BorderSide(color: Color(0xFFE0E0E0))),
                              ),
                              padding: EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.stretch,
                                children: [
                                  Text(
                                    isEditing
                                        ? 'Editing: ${_selectedFoodName()}'
                                        : (_selectedFoodFile != null || _selectedCustomFood != null
                                            ? 'Logging: ${_selectedFoodName()}'
                                            : 'Select a food to log'),
                                    style: TextStyle(fontFamily: 'Poppins', fontSize: 13, fontWeight: FontWeight.w500, color: Color(0xFF1C1C1C)),
                                  ),
                                  SizedBox(height: 12),
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
                                  SizedBox(height: 8),
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
                                  SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: OutlinedButton(
                                          onPressed: () async {
                                            final date = await showDatePicker(
                                              context: context,
                                              initialDate: _selectedDate ?? DateTime.now(),
                                              firstDate: DateTime(2000),
                                              lastDate: DateTime.now(),
                                            );
                                            if (date != null) setState(() => _selectedDate = date);
                                          },
                                          child: Text(
                                            _selectedDate != null
                                                ? '${_selectedDate!.year}-${_selectedDate!.month.toString().padLeft(2, '0')}-${_selectedDate!.day.toString().padLeft(2, '0')}'
                                                : 'Pick date',
                                            style: TextStyle(fontFamily: 'Poppins', fontSize: 13),
                                          ),
                                        ),
                                      ),
                                      SizedBox(width: 8),
                                      Expanded(
                                        child: OutlinedButton(
                                          onPressed: () async {
                                            final time = await showTimePicker(
                                              context: context,
                                              initialTime: _selectedTime ?? TimeOfDay.now(),
                                            );
                                            if (time != null) setState(() => _selectedTime = time);
                                          },
                                          child: Text(
                                            _selectedTime != null
                                                ? '${_selectedTime!.hour.toString().padLeft(2, '0')}:${_selectedTime!.minute.toString().padLeft(2, '0')}'
                                                : 'Pick time',
                                            style: TextStyle(fontFamily: 'Poppins', fontSize: 13),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: ElevatedButton(
                                          onPressed: (isEditing || _selectedFoodFile != null || _selectedCustomFood != null) ? _logMeal : null,
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Color(0xFF3B62FF),
                                            disabledBackgroundColor: Color(0xFFCCCCCC),
                                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                            padding: EdgeInsets.symmetric(vertical: 14),
                                          ),
                                          child: Text(
                                            isEditing ? 'Save Changes' : 'Log Meal',
                                            style: TextStyle(color: Colors.white, fontFamily: 'Poppins', fontSize: 14),
                                          ),
                                        ),
                                      ),
                                      SizedBox(width: 8),
                                      TextButton(
                                        onPressed: _clearLogForm,
                                        child: Text('Clear', style: TextStyle(fontFamily: 'Poppins', color: Color(0xFF87879D))),
                                      ),
                                    ],
                                  ),
                                ],
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
                  Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => HomePage()), (route) => false);
                }),
                _navButton('Patients', Icons.people, () {
                  Navigator.pushAndRemoveUntil(context, MaterialPageRoute(builder: (context) => PatientPage()), (route) => false);
                }),
                _navButton('Meals', Icons.restaurant, null),
                _navButton('Reports', Icons.bar_chart, () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => ReportPage()),
                    (route) => false,
                  );
                }),
                _navButton('Settings', Icons.settings, () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => SettingsPage()),
                    (route) => false,
                  );
                }),
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
            Text(label, style: TextStyle(fontFamily: 'Poppins', fontSize: 12, color: Color(0xFF3B62FF))),
          ],
        ),
      ),
    );
  }
}