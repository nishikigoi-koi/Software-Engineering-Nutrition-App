import 'package:flutter/material.dart';
import 'package:flutter_app_web/models/nutrition_info.dart';
import 'package:flutter_app_web/services/session_manager.dart';
import 'package:flutter_app_web/services/custom_food_service.dart';
import 'package:flutter_app_web/utils/dialog_utils.dart';

class CustomFoodPage extends StatefulWidget {
  const CustomFoodPage({super.key});

  @override
  _CustomFoodPageState createState() => _CustomFoodPageState();
}

class _CustomFoodPageState extends State<CustomFoodPage> {
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
    'carbohydrate': {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
    'sugars':       {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
    'fiber':        {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
    'sodium':       {'unit': TextEditingController(), 'qty_per_serving': TextEditingController(), 'percent_RDI': TextEditingController(), 'qty_per_100': TextEditingController()},
  };

  bool _isSaving = false;

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
    super.dispose();
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
      _buildNutritionInfo('carbohydrate'),
      _buildNutritionInfo('sugars'),
      _buildNutritionInfo('fiber'),
      _buildNutritionInfo('sodium'),
    );

    setState(() => _isSaving = false);

    if (response.statusCode == 200 || response.statusCode == 201) {
      Navigator.pop(context);
    } else {
      DialogUtils.showError(context, 'Failed to save custom food. (${response.statusCode})');
    }
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ── Left: basic info ───────────────────────────────────
                Container(
                  width: 300,
                  decoration: BoxDecoration(
                    border: Border(right: BorderSide(color: Color(0xFFE0E0E0))),
                  ),
                  padding: EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        'Custom Food',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                          color: Color(0xFF1C1C1C),
                        ),
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
                    ],
                  ),
                ),

                // ── Right: nutrition info ──────────────────────────────
                Expanded(
                  child: SingleChildScrollView(
                    padding: EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          'Nutrition Information',
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: Color(0xFF1C1C1C),
                          ),
                        ),
                        SizedBox(height: 20),
                        _nutritionRow('Energy', 'energy'),
                        _nutritionRow('Protein', 'protein'),
                        _nutritionRow('Total fat', 'totalFat'),
                        _nutritionRow('Saturated fat', 'saturatedFat'),
                        _nutritionRow('Carbohydrate', 'carbohydrate'),
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
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                              ),
                              child: Text(
                                _isSaving ? 'Saving...' : 'Save Food',
                                style: TextStyle(color: Colors.white, fontFamily: 'Poppins'),
                              ),
                            ),
                            SizedBox(width: 12),
                            TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: Text('Cancel', style: TextStyle(fontFamily: 'Poppins', color: Color(0xFF87879D))),
                            ),
                          ],
                        ),
                      ],
                    ),
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