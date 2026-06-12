class FoodFileSearchResult {
  final String id;
  final String foodName;
  final String shortName;
  final String description;
  final double servingSize;
  final String group;
  final String servingUnit;
  final String measureDescription;

  FoodFileSearchResult({
    required this.id,
    required this.foodName,
    required this.shortName,
    required this.description,
    required this.servingSize,
    required this.group,
    required this.servingUnit,
    required this.measureDescription,
  });

  factory FoodFileSearchResult.fromJson(Map<String, dynamic> json) {
    return FoodFileSearchResult(
      id: json['id'],
      foodName: json['foodName'],
      shortName: json['shortName'],
      description: json['description'] ?? '',
      servingSize: (json['serving_size'] as num).toDouble(),
      group: json['group'],
      servingUnit: json['serving_size_unit'],
      measureDescription: json['measure_description'],
    );
  }
}

class CustomFoodSearchResult {
  final String id;
  final String userId;
  final String foodName;
  final String description;
  final double servingSize;
  final String group;
  final String servingUnit;
  final String measureDescription;

  CustomFoodSearchResult({
    required this.id,
    required this.userId,
    required this.foodName,
    required this.description,
    required this.servingSize,
    required this.group,
    required this.servingUnit,
    required this.measureDescription,
  });

  factory CustomFoodSearchResult.fromJson(Map<String, dynamic> json) {
    return CustomFoodSearchResult(
      id: json['id'],
      userId: json['userId'],
      foodName: json['foodName'],
      description: json['description'],
      servingSize: (json['serving_size'] as num).toDouble(),
      group: json['group'],
      servingUnit: json['serving_size_unit'],
      measureDescription: json['measure_description'],
    );
  }
}
