class TotalNutrient {
  final String name;
  final String unit;
  final String amount;

  TotalNutrient({
    required this.name,
    required this.unit,
    required this.amount,
  });

  factory TotalNutrient.fromJson(Map<String, dynamic> json) {
    return TotalNutrient(
      name: json['name'],
      unit: json['unit'],
      amount: json['amount'],
    );
  }
}

class TotalNutrients {
  final String energyUnit;
  final String totalEnergy;
  final List<TotalNutrient> macronutrients;
  final List<TotalNutrient> micronutrients;

  TotalNutrients({
    required this.energyUnit,
    required this.totalEnergy,
    required this.macronutrients,
    required this.micronutrients,
  });

  factory TotalNutrients.fromJson(Map<String, dynamic> json) {
    return TotalNutrients(
      energyUnit: json['EnergyUnit'],
      totalEnergy: json['TotalEnergy'],
      macronutrients: (json['macronutrients'] as List)
          .map((m) => TotalNutrient.fromJson(m))
          .toList(),
      micronutrients: (json['micronutrients'] as List)
          .map((m) => TotalNutrient.fromJson(m))
          .toList(),
    );
  }
}