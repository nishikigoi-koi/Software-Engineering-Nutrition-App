class EnergyFlag {
  final String name;
  final String unit;
  final String rdi;
  final String intake;
  final String direction;

  EnergyFlag({
    required this.name,
    required this.unit,
    required this.rdi,
    required this.intake,
    required this.direction
  });

  factory EnergyFlag.fromJson(Map<String, dynamic> json) {
    return EnergyFlag(
      name: json['name'],
      unit: json['unit'],
      rdi: json['RDI'],
      intake: json['intake'],
      direction: json['direction']
    );
  }
}

class MacronutrientFlag {
  final String name;
  final String unit;
  final String minRDI;
  final String maxRDI;
  final String intake;
  final String direction;

  MacronutrientFlag({
    required this.name,
    required this.unit,
    required this.minRDI,
    required this.maxRDI,
    required this.intake,
    required this.direction
  });

  factory MacronutrientFlag.fromJson(Map<String, dynamic> json) {
    return MacronutrientFlag(
      name: json['name'],
      unit: json['unit'],
      minRDI: json['minRDI'],
      maxRDI: json['maxRDI'],
      intake: json['intake'],
      direction: json['direction']
    );
  }
}

class MicronutrientFlag {
  final String name;
  final String unit;
  final String rdi;
  final String intake;
  final String direction;

  MicronutrientFlag({
    required this.name,
    required this.unit,
    required this.rdi,
    required this.intake,
    required this.direction
  });

  factory MicronutrientFlag.fromJson(Map<String, dynamic> json) {
    return MicronutrientFlag(
      name: json['name'],
      unit: json['unit'],
      rdi: json['RDI'],
      intake: json['intake'],
      direction: json['direction']
    );
  }
}

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