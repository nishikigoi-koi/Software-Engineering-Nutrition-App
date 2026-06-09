class FoodBase {
  final String id;
  final String foodName;
  final String description;
  final double servingSize;
  final String group;
  final String servingSizeUnit;
  final String measureDescription;

  FoodBase({
    required this.id,
    required this.foodName,
    required this.description,
    required this.servingSize,
    required this.group,
    required this.servingSizeUnit,
    required this.measureDescription,
  });
}
