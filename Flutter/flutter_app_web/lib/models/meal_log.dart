class MealLog {
  final String patientId;
  final FoodReference food;
  final DateTime dateTime;
  final double amount;
  final String unit;
  final String mealType;

  MealLog({
    required this.patientId,
    required this.food,
    required this.dateTime,
    required this.amount,
    required this.unit,
    required this.mealType,
  });

  Map<String, dynamic> toJson() {
    return {
      "patientId": patientId,
      "FCDBFoodId": food.fcdbId,
      "CustomFoodId": food.customFoodId,
      "dateTime": dateTime.toIso8601String(),
      "amount": amount,
      "unit": unit,
      "mealType": mealType,
    };
  }

  factory MealLog.fromJson(Map<String, dynamic> json) {
    final fcdbId = json['FCDBFoodId'];
    final customId = json['CustomFoodId'];

    late final FoodReference food;

    if (fcdbId != null) {
      food = FCDBFoodReference(fcdbId);
    } else if (customId != null) {
      food = CustomFoodReference(customId);
    } else {
      throw Exception("MealLog missing food reference");
    }

    return MealLog(
      patientId: json['patientId'],
      food: food,
      dateTime: DateTime.parse(json['dateTime']),
      amount: (json['amount'] as num).toDouble(),
      unit: json['unit'],
      mealType: json['mealType'],
    );
  }
}

abstract class FoodReference {
  String? get fcdbId;
  String? get customFoodId;
}

class FCDBFoodReference implements FoodReference {
  final String id;

  FCDBFoodReference(this.id);

  @override
  String get fcdbId => id;

  @override
  String? get customFoodId => null;
}

class CustomFoodReference implements FoodReference {
  final String id;

  CustomFoodReference(this.id);

  @override
  String? get fcdbId => null;

  @override
  String get customFoodId => id;
}
