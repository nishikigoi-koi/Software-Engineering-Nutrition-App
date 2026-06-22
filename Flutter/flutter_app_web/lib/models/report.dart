import 'flag_types.dart';

class FoodLogReference {
  final String foodLogId;

  FoodLogReference({required this.foodLogId});

  factory FoodLogReference.fromJson(Map<String, dynamic> json) {
    return FoodLogReference(foodLogId: json['foodLogId']);
  }
}

class Report {
  final String title;
  final String date;
  final String patientName;
  final List<FoodLogReference> foodLogs;
  final EnergyFlag energy;
  final List<MacronutrientFlag> macronutrients;
  final List<MicronutrientFlag> micronutrients;

  Report({
    required this.title,
    required this.date,
    required this.patientName,
    required this.foodLogs,
    required this.energy,
    required this.macronutrients,
    required this.micronutrients,
  });

  factory Report.fromJson(Map<String, dynamic> json) {
    final rdiComparison = json['RDIComparedToTotalIntake'];
    return Report(
      title: json['title'],
      date: json['date'],
      patientName: json['patientName'],
      foodLogs: (json['foodLogs'] as List)
          .map((f) => FoodLogReference.fromJson(f))
          .toList(),
      energy: EnergyFlag.fromJson(rdiComparison['energy']),
      macronutrients: (rdiComparison['macronutrients'] as List)
          .map((m) => MacronutrientFlag.fromJson(m))
          .toList(),
      micronutrients: (rdiComparison['micronutrients'] as List)
          .map((m) => MicronutrientFlag.fromJson(m))
          .toList(),
    );
  }
}