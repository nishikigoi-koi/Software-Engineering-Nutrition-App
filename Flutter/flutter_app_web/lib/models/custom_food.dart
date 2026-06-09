import 'food_base.dart';
import 'nutrition_info.dart';

class CustomFood extends FoodBase {
  final String userId;
  final NutritionInfo energy;
  final NutritionInfo protein;
  final NutritionInfo totalFat;
  final NutritionInfo saturatedFat;
  final NutritionInfo carbohydrate;
  final NutritionInfo sugars;
  final NutritionInfo fiber;
  final NutritionInfo sodium;

  CustomFood({
    required super.id,
    required super.foodName,
    required super.description,
    required super.servingSize,
    required super.group,
    required super.servingSizeUnit,
    required super.measureDescription,
    required this.userId,
    required this.energy,
    required this.protein,
    required this.totalFat,
    required this.saturatedFat,
    required this.carbohydrate,
    required this.sugars,
    required this.fiber,
    required this.sodium,
  });

  factory CustomFood.fromJson(Map<String, dynamic> json) {
    return CustomFood(
      id: json['id'],
      userId: json['userId'],
      foodName: json['foodName'],
      description: json['description'] ?? '',
      servingSize: (json['serving_size'] as num).toDouble(),
      group: json['group'],
      servingSizeUnit: json['serving_size_unit'],
      measureDescription: json['measure_description'],
      energy: NutritionInfo.fromJson(json['energy']),
      protein: NutritionInfo.fromJson(json['protein']),
      totalFat: NutritionInfo.fromJson(json['totalFat']),
      saturatedFat: NutritionInfo.fromJson(json['saturatedFat']),
      carbohydrate: NutritionInfo.fromJson(json['carbohydrate']),
      sugars: NutritionInfo.fromJson(json['sugars']),
      fiber: NutritionInfo.fromJson(json['fiber']),
      sodium: NutritionInfo.fromJson(json['sodium']),
    );
  }
}
