class MedicalCondition {
  final String id;
  final String name;
  final String description;

  MedicalCondition({
    required this.id,
    required this.name,
    required this.description
  });

  factory MedicalCondition.fromJson(Map<String, dynamic> json) {
    return MedicalCondition(
      id: json['id'],
      name: json['name'],
      description: json['description']
    );
  }
}