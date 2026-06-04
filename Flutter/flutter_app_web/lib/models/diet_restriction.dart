class DietRestriction {
  final String id;
  final String name;
  final String description;

  DietRestriction({
    required this.id,
    required this.name,
    required this.description
  });

  factory DietRestriction.fromJson(Map<String, dynamic> json) {
    return DietRestriction(
      id: json['id'],
      name: json['name'],
      description: json['description']
    );
  }
}