class Macronutrient {
  final String name;
  final String unit;
  final String minAmount;
  final String maxAmount;

  Macronutrient({
    required this.name,
    required this.unit,
    required this.minAmount,
    required this.maxAmount,
  });

  factory Macronutrient.fromJson(Map<String, dynamic> json) {
    return Macronutrient(
      name: json['name'],
      unit: json['unit'],
      minAmount: json['minAmount'],
      maxAmount: json['maxAmount'],
    );
  }
}

class RDIMicronutrient {
  final String name;
  final String unit;
  final String amount;

  RDIMicronutrient({
    required this.name,
    required this.unit,
    required this.amount,
  });

  factory RDIMicronutrient.fromJson(Map<String, dynamic> json) {
    return RDIMicronutrient(
      name: json['name'],
      unit: json['unit'],
      amount: json['amount'],
    );
  }
}