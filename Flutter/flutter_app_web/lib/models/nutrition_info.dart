class NutritionInfo {
  final String unit;
  final String qtyPerServing;
  final String percentRQI;
  final String qtyPer100;

  NutritionInfo({
    required this.unit,
    required this.qtyPerServing,
    required this.percentRQI,
    required this.qtyPer100,
  });

  Map<String, dynamic> toJson() {
    return {
      "unit": unit,
      "qty_per_serving": qtyPerServing,
      "percent_RQI": percentRQI,
      "qty_per_100": qtyPer100,
    };
  }

  factory NutritionInfo.fromJson(Map<String, dynamic> json) {
    return NutritionInfo(
      unit: json['unit'],
      qtyPerServing: json['qty_per_serving'],
      percentRQI: json['percent_RQI'],
      qtyPer100: json['qty_per_100'],
    );
  }
}
