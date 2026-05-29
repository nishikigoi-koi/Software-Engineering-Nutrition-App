class User {
  final String id;
  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;
  final String username;

  User({required this.id, required this.createdAt, required this.updatedAt, required this.deletedAt, required this.username});


  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      createdAt: json['createdAt'],
      updatedAt: json['updatedAt'],
      deletedAt: json['deletedAt'],
      username: json['username']
    );
  }
}