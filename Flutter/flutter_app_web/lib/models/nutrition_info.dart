class NutritionInfo {
  final String unit;
  final String qtyPerServing;
  final String percentRDI;
  final String qtyPer100;

  NutritionInfo({
    required this.unit,
    required this.qtyPerServing,
    required this.percentRDI,
    required this.qtyPer100,
  });

  Map<String, dynamic> toJson() {
    return {
      "unit": unit,
      "qty_per_serving": qtyPerServing,
      "percent_RDI": percentRDI,
      "qty_per_100": qtyPer100,
    };
  }

  factory NutritionInfo.fromJson(Map<String, dynamic> json) {
    return NutritionInfo(
      unit: json['unit'],
      qtyPerServing: json['qty_per_serving'],
      percentRDI: json['percent_RDI'],
      qtyPer100: json['qty_per_100'],
    );
  }
}
