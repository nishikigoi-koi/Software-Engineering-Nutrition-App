import 'rdi_macro_micro.dart';

class Rdi {
  final String energyUnit;
  final String totalEnergy;
  final List<Macronutrient> macronutrients;
  final List<RDIMicronutrient> micronutrients;

  Rdi({
    required this.energyUnit,
    required this.totalEnergy,
    required this.macronutrients,
    required this.micronutrients,
  });

  factory Rdi.fromJson(Map<String, dynamic> json) {
    return Rdi(
      energyUnit: json['EnergyUnit'],
      totalEnergy: json['TotalEnergy'],
      macronutrients: (json['macronutrients'] as List)
          .map((m) => Macronutrient.fromJson(m))
          .toList(),
      micronutrients: (json['micronutrients'] as List)
          .map((m) => RDIMicronutrient.fromJson(m))
          .toList(),
    );
  }
}