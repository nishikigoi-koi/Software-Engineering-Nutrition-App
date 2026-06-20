import 'nutrition_info.dart';

class Micronutrient {
  final String name;
  final NutritionInfo info;

  Micronutrient({required this.name, required this.info});

  factory Micronutrient.fromJson(Map<String, dynamic> json) {
    return Micronutrient(
      name: json['name'],
      info: NutritionInfo.fromJson(json),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "name": name,
      "unit": info.unit,
      "qty_per_serving": info.qtyPerServing,
      "percent_RQI": info.percentRQI,
      "qty_per_100": info.qtyPer100,
    };
  }
}