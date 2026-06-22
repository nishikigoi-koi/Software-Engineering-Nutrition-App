import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:flutter_app_web/models/nutrition_info.dart';
import 'package:flutter_app_web/models/micronutrient.dart';
import 'package:flutter_app_web/models/custom_food.dart';
import 'package:flutter_app_web/services/session_manager.dart';
import 'package:flutter_app_web/services/custom_food_service.dart';
import 'package:flutter_app_web/utils/dialog_utils.dart';

class CustomFoodPage extends StatefulWidget {
  const CustomFoodPage({super.key});

  @override
  _CustomFoodPageState createState() => _CustomFoodPageState();
}

class _CustomFoodPageState extends State<CustomFoodPage> {
  // ── State ─────────────────────────────────────────────────────────────────

  List<CustomFood> _foods = [];
  CustomFood? _selectedFood;
  bool _isNewFood = false;
  bool _isLoading = true;
  bool _isSaving = false;

  final _foodNameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _servingSizeController = TextEditingController();
  final _groupController = TextEditingController();
  final _servingUnitController = TextEditingController();
  final _measureDescController = TextEditingController();

  // Nutrition controllers — each nutrient has unit, qty_per_serving, percent_RDI, qty_per_100
  final Map<String, Map<String, TextEditingController>> _nutritionControllers = {
    'energy':       {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
    'protein':      {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
    'totalFat':     {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
    'saturatedFat': {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
    'carbohydrates': {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
    'sugars':       {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
    'fiber':        {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
    'sodium':       {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
  };

  // Micronutrients currently added to this food
  List<Micronutrient> _micronutrients = [];

  // Micronutrient entry form
  String? _selectedNutrientName;
  int? _editingMicronutrientIndex; // null = adding new, otherwise editing in place
  final _microQtyPerServingController = TextEditingController();
  final _microPercentRDIController = TextEditingController();
  final _microQtyPer100Controller = TextEditingController();

  final List<String> _micronutrientOptions = [
    'Folate',
    'Niacin (vitamin B3)',
    'Pantothenic acid (vitamin B5)',
    'Riboflavin (vitamin B2)',
    'Thiamin (vitamin B1)',
    'Vitamin A, FSANZ',
    'Vitamin B6 (pyridoxal phosphate)',
    'Vitamin B12 (cobalamin)',
    'Vitamin C (ascorbic acid)',
    'Vitamin D',
    'Vitamin E (tocopherols)',
    'Vitamin K',
    'Calcium',
    'Copper',
    'Fluoride',
    'Iodide (iodine)',
    'Iron',
    'Magnesium',
    'Manganese',
    'Phosphorus',
    'Potassium',
    'Selenium',
    'Zinc',
  ];

  // Per-nutrient units, sourced from food files data
  final Map<String, String> _micronutrientUnits = {
    'Folate': 'µg',
    'Niacin (vitamin B3)': 'mg',
    'Pantothenic acid (vitamin B5)': 'mg',
    'Riboflavin (vitamin B2)': 'mg',
    'Thiamin (vitamin B1)': 'mg',
    'Vitamin A, FSANZ': 'µg',
    'Vitamin B6 (pyridoxal phosphate)': 'mg',
    'Vitamin B12 (cobalamin)': 'µg',
    'Vitamin C (ascorbic acid)': 'mg',
    'Vitamin D': 'µg',
    'Vitamin E (tocopherols)': 'mg',
    'Vitamin K': 'µg',
    'Calcium': 'mg',
    'Copper': 'mg',
    'Fluoride': 'µg',
    'Iodide (iodine)': 'µg',
    'Iron': 'mg',
    'Magnesium': 'mg',
    'Manganese': 'µg',
    'Phosphorus': 'mg',
    'Potassium': 'mg',
    'Selenium': 'µg',
    'Zinc': 'mg',
  };

  String _unitFor(String? nutrientName) {
    if (nutrientName == null) return '';
    return _micronutrientUnits[nutrientName] ?? 'mg';
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadFoods();
    });
  }

  @override
  void dispose() {
    _foodNameController.dispose();
    _descriptionController.dispose();
    _servingSizeController.dispose();
    _groupController.dispose();
    _servingUnitController.dispose();
    _measureDescController.dispose();
    for (final nutrient in _nutritionControllers.values) {
      for (final controller in nutrient.values) {
        controller.dispose();
      }
    }
    _microQtyPerServingController.dispose();
    _microPercentRDIController.dispose();
    _microQtyPer100Controller.dispose();
    super.dispose();
  }

  // ── API calls ─────────────────────────────────────────────────────────────

  Future<void> _loadFoods() async {
    setState(() => _isLoading = true);
    final userId = SessionManager().currentUser!.id;
    final response = await CustomFoodService.getCustomFoodsByUser(userId);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _foods = data.map((f) => CustomFood.fromJson(f)).toList();
        _isLoading = false;
      });
    } else if (response.statusCode == 404) {
      setState(() {
        _foods = [];
        _isLoading = false;
      });
    } else {
      setState(() => _isLoading = false);
      DialogUtils.showError(context, 'Failed to load custom foods. (${response.statusCode})');
    }
  }

  NutritionInfo _buildNutritionInfo(String key) {
    final c = _nutritionControllers[key]!;
    return NutritionInfo(
      unit: c['unit']!.text,
      qtyPerServing: c['qty_per_serving']!.text,
      percentRDI: c['percent_RDI']!.text,
      qtyPer100: c['qty_per_100']!.text,
    );
  }

  Future<void> _save() async {
    if (_foodNameController.text.trim().isEmpty ||
        _servingSizeController.text.trim().isEmpty) {
      DialogUtils.showError(context, 'Please fill in at least a food name and serving size.');
      return;
    }

    setState(() => _isSaving = true);

    final userId = SessionManager().currentUser!.id;

    if (_isNewFood) {
      final response = await CustomFoodService.createCustomFood(
        userId,
        _foodNameController.text,
        _descriptionController.text,
        double.tryParse(_servingSizeController.text) ?? 0,
        _groupController.text,
        _servingUnitController.text,
        _measureDescController.text,
        _buildNutritionInfo('energy'),
        _buildNutritionInfo('protein'),
        _buildNutritionInfo('totalFat'),
        _buildNutritionInfo('saturatedFat'),
        _buildNutritionInfo('carbohydrates'),
        _buildNutritionInfo('sugars'),
        _buildNutritionInfo('fiber'),
        _buildNutritionInfo('sodium'),
        micronutrients: _micronutrients,
      );

      setState(() => _isSaving = false);

      if (response.statusCode == 200 || response.statusCode == 201) {
        await _loadFoods();
        _clearForm();
      } else {
        DialogUtils.showError(context, 'Failed to save custom food. (${response.statusCode})');
      }
    } else {
      final response = await CustomFoodService.updateCustomFood(
        _selectedFood!.id,
        userId,
        _foodNameController.text,
        _descriptionController.text,
        double.tryParse(_servingSizeController.text) ?? 0,
        _groupController.text,
        _servingUnitController.text,
        _measureDescController.text,
        _buildNutritionInfo('energy'),
        _buildNutritionInfo('protein'),
        _buildNutritionInfo('totalFat'),
        _buildNutritionInfo('saturatedFat'),
        _buildNutritionInfo('carbohydrates'),
        _buildNutritionInfo('sugars'),
        _buildNutritionInfo('fiber'),
        _buildNutritionInfo('sodium'),
        micronutrients: _micronutrients,
      );

      setState(() => _isSaving = false);

      if (response.statusCode == 200) {
        await _loadFoods();
      } else {
        DialogUtils.showError(context, 'Failed to update custom food. (${response.statusCode})');
      }
    }
  }

  Future<void> _delete() async {
    if (_selectedFood == null) return;

    final response = await CustomFoodService.deleteCustomFood(_selectedFood!.id);

    if (response.statusCode == 200 || response.statusCode == 204) {
      await _loadFoods();
      _clearForm();
    } else {
      DialogUtils.showError(context, 'Failed to delete custom food. (${response.statusCode})');
    }
  }

  void _confirmDelete() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Delete Food'),
        content: Text('Are you sure you want to delete "${_selectedFood!.foodName}"? This cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _delete();
            },
            child: Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  void _populateNutritionControllers(CustomFood food) {
    void fill(String key, NutritionInfo info) {
      final c = _nutritionControllers[key]!;
      c['unit']!.text = info.unit;
      c['qty_per_serving']!.text = info.qtyPerServing;
      c['percent_RDI']!.text = info.percentRDI;
      c['qty_per_100']!.text = info.qtyPer100;
    }

    fill('energy', food.energy);
    fill('protein', food.protein);
    fill('totalFat', food.totalFat);
    fill('saturatedFat', food.saturatedFat);
    fill('carbohydrates', food.carbohydrates);
    fill('sugars', food.sugars);
    fill('fiber', food.fiber);
    fill('sodium', food.sodium);
  }

  void _clearNutritionControllers() {
    for (final nutrient in _nutritionControllers.values) {
      for (final controller in nutrient.values) {
        controller.clear();
      }
    }
  }

  void _selectFood(CustomFood food) {
    setState(() {
      _selectedFood = food;
      _isNewFood = false;
      _foodNameController.text = food.foodName;
      _descriptionController.text = food.description;
      _servingSizeController.text = food.servingSize.toString();
      _groupController.text = food.group;
      _servingUnitController.text = food.servingSizeUnit;
      _measureDescController.text = food.measureDescription;
      _populateNutritionControllers(food);
      _micronutrients = List.from(food.micronutrients);
      _clearMicronutrientForm();
    });
  }

  void _selectNewFood() {
    setState(() {
      _selectedFood = null;
      _isNewFood = true;
      _foodNameController.clear();
      _descriptionController.clear();
      _servingSizeController.clear();
      _groupController.clear();
      _servingUnitController.clear();
      _measureDescController.clear();
      _clearNutritionControllers();
      _micronutrients = [];
      _clearMicronutrientForm();
    });
  }

  void _clearForm() {
    setState(() {
      _selectedFood = null;
      _isNewFood = false;
      _foodNameController.clear();
      _descriptionController.clear();
      _servingSizeController.clear();
      _groupController.clear();
      _servingUnitController.clear();
      _measureDescController.clear();
      _clearNutritionControllers();
      _micronutrients = [];
      _clearMicronutrientForm();
    });
  }

  void _clearMicronutrientForm() {
    _selectedNutrientName = null;
    _editingMicronutrientIndex = null;
    _microQtyPerServingController.clear();
    _microPercentRDIController.clear();
    _microQtyPer100Controller.clear();
  }

  void _startEditingMicronutrient(int index) {
    final m = _micronutrients[index];
    setState(() {
      _editingMicronutrientIndex = index;
      _selectedNutrientName = m.name;
      _microQtyPerServingController.text = m.info.qtyPerServing;
      _microPercentRDIController.text = m.info.percentRDI;
      _microQtyPer100Controller.text = m.info.qtyPer100;
    });
  }

  void _saveMicronutrientEntry() {
    if (_selectedNutrientName == null ||
        _microQtyPerServingController.text.trim().isEmpty ||
        _microPercentRDIController.text.trim().isEmpty ||
        _microQtyPer100Controller.text.trim().isEmpty) {
      DialogUtils.showError(context, 'Please fill in all micronutrient fields.');
      return;
    }

    final entry = Micronutrient(
      name: _selectedNutrientName!,
      info: NutritionInfo(
        unit: _unitFor(_selectedNutrientName),
        qtyPerServing: _microQtyPerServingController.text.trim(),
        percentRDI: _microPercentRDIController.text.trim(),
        qtyPer100: _microQtyPer100Controller.text.trim(),
      ),
    );

    setState(() {
      if (_editingMicronutrientIndex != null) {
        _micronutrients[_editingMicronutrientIndex!] = entry;
      } else {
        _micronutrients.add(entry);
      }
      _clearMicronutrientForm();
    });
  }

  void _removeMicronutrient(int index) {
    setState(() {
      _micronutrients.removeAt(index);
      if (_editingMicronutrientIndex == index) {
        _clearMicronutrientForm();
      }
    });
  }

  Widget _nutritionRow(String label, String key) {
    final c = _nutritionControllers[key]!;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(fontFamily: 'Poppins', fontSize: 13, fontWeight: FontWeight.w500, color: Color(0xFF1C1C1C)),
        ),
        SizedBox(height: 6),
        Row(
          children: [
            Expanded(child: _field(c['unit']!, 'Unit')),
            SizedBox(width: 8),
            Expanded(child: _field(c['qty_per_serving']!, 'Per serving')),
            SizedBox(width: 8),
            Expanded(child: _field(c['percent_RDI']!, '% RDI')),
            SizedBox(width: 8),
            Expanded(child: _field(c['qty_per_100']!, 'Per 100')),
          ],
        ),
        SizedBox(height: 12),
      ],
    );
  }

  Widget _field(TextEditingController controller, String label) {
    return TextField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(),
        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      ),
      style: TextStyle(fontSize: 12),
    );
  }

  // ── Build ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final bool showForm = _isNewFood || _selectedFood != null;

    return Scaffold(
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── Left: food list ─────────────────────────────────────
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
                        child: Text(
                          'Custom Foods',
                          style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1C1C1C)),
                        ),
                      ),
                      Divider(height: 1),
                      ListTile(
                        title: Text(
                          '+ New Food',
                          style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF3B62FF), fontWeight: FontWeight.w500),
                        ),
                        selected: _isNewFood,
                        selectedTileColor: Color(0xFFEEF1FF),
                        onTap: _selectNewFood,
                      ),
                      Divider(height: 1),
                      Expanded(
                        child: _foods.isEmpty
                            ? Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Text(
                                  'No custom foods yet.',
                                  style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF87879D)),
                                ),
                              )
                            : ListView.builder(
                                itemCount: _foods.length,
                                itemBuilder: (context, index) {
                                  final food = _foods[index];
                                  final isSelected = _selectedFood?.id == food.id;
                                  return ListTile(
                                    title: Text(
                                      food.foodName,
                                      style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF1C1C1C)),
                                    ),
                                    selected: isSelected,
                                    selectedTileColor: Color(0xFFEEF1FF),
                                    onTap: () => _selectFood(food),
                                  );
                                },
                              ),
                      ),
                    ],
                  ),
                ),

                // ── Middle: basic info + macro nutrition ────────────────
                Expanded(
                  flex: 3,
                  child: !showForm
                      ? Center(
                          child: Text(
                            'Select a food from the list or create a new one.',
                            style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF87879D)),
                          ),
                        )
                      : SingleChildScrollView(
                          padding: EdgeInsets.all(24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Text(
                                _isNewFood ? 'New Food' : _foodNameController.text,
                                style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 22, color: Color(0xFF1C1C1C)),
                              ),
                              SizedBox(height: 20),
                              _field(_foodNameController, 'Food name'),
                              SizedBox(height: 12),
                              _field(_descriptionController, 'Description'),
                              SizedBox(height: 12),
                              Row(
                                children: [
                                  Expanded(child: _field(_servingSizeController, 'Serving size')),
                                  SizedBox(width: 8),
                                  Expanded(child: _field(_servingUnitController, 'Unit (e.g. g)')),
                                ],
                              ),
                              SizedBox(height: 12),
                              _field(_groupController, 'Food group'),
                              SizedBox(height: 12),
                              _field(_measureDescController, 'Measure description'),
                              SizedBox(height: 24),

                              Text(
                                'Nutrition Information',
                                style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1C1C1C)),
                              ),
                              SizedBox(height: 16),
                              _nutritionRow('Energy', 'energy'),
                              _nutritionRow('Protein', 'protein'),
                              _nutritionRow('Total fat', 'totalFat'),
                              _nutritionRow('Saturated fat', 'saturatedFat'),
                              _nutritionRow('Carbohydrates', 'carbohydrates'),
                              _nutritionRow('Sugars', 'sugars'),
                              _nutritionRow('Fiber', 'fiber'),
                              _nutritionRow('Sodium', 'sodium'),
                              SizedBox(height: 8),

                              Row(
                                children: [
                                  ElevatedButton(
                                    onPressed: _isSaving ? null : _save,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Color(0xFF3B62FF),
                                      disabledBackgroundColor: Color(0xFFCCCCCC),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                      padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                                    ),
                                    child: Text(
                                      _isSaving ? 'Saving...' : (_isNewFood ? 'Save Food' : 'Update Food'),
                                      style: TextStyle(color: Colors.white, fontFamily: 'Poppins'),
                                    ),
                                  ),
                                  SizedBox(width: 12),
                                  if (!_isNewFood)
                                    ElevatedButton(
                                      onPressed: _confirmDelete,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.red,
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                                      ),
                                      child: Text('Delete Food', style: TextStyle(color: Colors.white, fontFamily: 'Poppins')),
                                    ),
                                  SizedBox(width: 12),
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: Text('Back', style: TextStyle(fontFamily: 'Poppins', color: Color(0xFF87879D))),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                ),

                // ── Right: micronutrients ───────────────────────────────
                if (showForm)
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
                            'Micronutrients',
                            style: TextStyle(fontFamily: 'Poppins', fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF1C1C1C)),
                          ),
                        ),
                        Divider(height: 1),

                        // Scrollable list of added micronutrients
                        Expanded(
                          child: _micronutrients.isEmpty
                              ? Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Text(
                                    'No micronutrients added yet.',
                                    style: TextStyle(fontFamily: 'Poppins', fontSize: 13, color: Color(0xFF87879D)),
                                  ),
                                )
                              : ListView.builder(
                                  padding: EdgeInsets.all(16),
                                  itemCount: _micronutrients.length,
                                  itemBuilder: (context, index) {
                                    final m = _micronutrients[index];
                                    final isEditing = _editingMicronutrientIndex == index;
                                    return Container(
                                      margin: EdgeInsets.only(bottom: 8),
                                      padding: EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: isEditing ? Color(0xFFEEF1FF) : Colors.transparent,
                                        border: Border.all(color: isEditing ? Color(0xFF3B62FF) : Color(0xFFE0E0E0)),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        children: [
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(m.name, style: TextStyle(fontFamily: 'Poppins', fontSize: 13, fontWeight: FontWeight.w500, color: Color(0xFF1C1C1C))),
                                                Text(
                                                  '${m.info.qtyPerServing} ${m.info.unit} / serving · ${m.info.percentRDI}% RDI · ${m.info.qtyPer100} ${m.info.unit}/100',
                                                  style: TextStyle(fontFamily: 'Poppins', fontSize: 11, color: Color(0xFF87879D)),
                                                ),
                                              ],
                                            ),
                                          ),
                                          IconButton(
                                            icon: Icon(Icons.edit, size: 16, color: Color(0xFF3B62FF)),
                                            onPressed: () => _startEditingMicronutrient(index),
                                          ),
                                          IconButton(
                                            icon: Icon(Icons.delete, size: 16, color: Colors.red),
                                            onPressed: () => _removeMicronutrient(index),
                                          ),
                                        ],
                                      ),
                                    );
                                  },
                                ),
                        ),

                        // Bottom: add/edit micronutrient form
                        Container(
                          decoration: BoxDecoration(
                            border: Border(top: BorderSide(color: Color(0xFFE0E0E0))),
                          ),
                          padding: EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              Text(
                                _editingMicronutrientIndex != null ? 'Edit Micronutrient' : 'Add Micronutrient',
                                style: TextStyle(fontFamily: 'Poppins', fontSize: 13, fontWeight: FontWeight.w500, color: Color(0xFF1C1C1C)),
                              ),
                              SizedBox(height: 12),
                              DropdownButtonFormField<String>(
                                initialValue: _selectedNutrientName,
                                decoration: InputDecoration(
                                  labelText: 'Nutrient',
                                  border: OutlineInputBorder(),
                                  contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                ),
                                style: TextStyle(fontSize: 13, color: Color(0xFF1C1C1C)),
                                items: _micronutrientOptions.map((n) => DropdownMenuItem(value: n, child: Text(n, overflow: TextOverflow.ellipsis))).toList(),
                                onChanged: (v) => setState(() => _selectedNutrientName = v),
                              ),
                              SizedBox(height: 8),
                              Row(
                                children: [
                                  Expanded(child: _field(_microQtyPerServingController, 'Per serving${_selectedNutrientName != null ? ' (${_unitFor(_selectedNutrientName)})' : ''}')),
                                  SizedBox(width: 8),
                                  Expanded(child: _field(_microPercentRDIController, '% RDI')),
                                ],
                              ),
                              SizedBox(height: 8),
                              _field(_microQtyPer100Controller, 'Per 100${_selectedNutrientName != null ? ' (${_unitFor(_selectedNutrientName)})' : ''}'),
                              SizedBox(height: 12),
                              Row(
                                children: [
                                  Expanded(
                                    child: ElevatedButton(
                                      onPressed: _saveMicronutrientEntry,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Color(0xFF3B62FF),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                        padding: EdgeInsets.symmetric(vertical: 12),
                                      ),
                                      child: Text(
                                        _editingMicronutrientIndex != null ? 'Save Changes' : 'Add',
                                        style: TextStyle(color: Colors.white, fontFamily: 'Poppins', fontSize: 13),
                                      ),
                                    ),
                                  ),
                                  SizedBox(width: 8),
                                  TextButton(
                                    onPressed: () => setState(_clearMicronutrientForm),
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
    );
  }
}