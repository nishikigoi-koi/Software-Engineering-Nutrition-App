import 'flag_types.dart';

class Flags {
  final EnergyFlag energyFlag;
  final List<MacronutrientFlag> macronutrientFlags;
  final List<MicronutrientFlag> micronutrientFlags;

  Flags({
    required this.energyFlag,
    required this.macronutrientFlags,
    required this.micronutrientFlags
  });

  factory Flags.fromJson(Map<String, dynamic> json) {
    return Flags(
      energyFlag: EnergyFlag.fromJson(json['energy']),
      macronutrientFlags: (json['macronutrients'] as List)
        .map((m) => MacronutrientFlag.fromJson(m))
        .toList(),
      micronutrientFlags: (json['micronutrients'] as List)
        .map((m) => MicronutrientFlag.fromJson(m))
        .toList(),
    );
  }
}