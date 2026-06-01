class Patient {
  final String id;
  final String userId;
  final String firstName;
  final String lastName;
  final DateTime birthDate;
  final String gender;
  final String ethnicity;
  final double weight;
  final double height;
  final String activityLevel;

  Patient({
    required this.id,
    required this.userId,
    required this.firstName,
    required this.lastName,
    required this.birthDate,
    required this.gender,
    required this.ethnicity,
    required this.weight,
    required this.height,
    required this.activityLevel,
  });

  factory Patient.fromJson(Map<String, dynamic> json) {
    return Patient(
      id: json['id'],
      userId: json['userId'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      birthDate: DateTime.parse(json['birthDate']),
      gender: json['gender'],
      ethnicity: json['ethnicity'],
      weight: (json['weight'] as num).toDouble(),
      height: (json['height'] as num).toDouble(),
      activityLevel: json['activityLevel'],
    );
  }
}