import 'session_manager.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_app_web/models/nutrition_info.dart';
import 'package:flutter_app_web/models/micronutrient.dart';

class CustomFoodService {
  static const String _base = 'http://localhost:3000/api/customfood';

  static Future<http.Response> createCustomFood(
    String userID,
    String foodName,
    String description,
    double servingSize,
    String group,
    String servingUnit,
    String measureDescription,
    NutritionInfo energy,
    NutritionInfo protein,
    NutritionInfo totalFat,
    NutritionInfo saturatedFat,
    NutritionInfo carbohydrate,
    NutritionInfo sugars,
    NutritionInfo fiber,
    NutritionInfo sodium, {
    List<Micronutrient> micronutrients = const [],
  }) async {
    final token = SessionManager().token;

    return await http.post(
      Uri.parse('$_base/create'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        "userId": userID,
        "foodName": foodName,
        "description": description,
        "serving_size": servingSize,
        "group": group,
        "serving_size_unit": servingUnit,
        "measure_description": measureDescription,
        "energy": energy.toJson(),
        "protein": protein.toJson(),
        "totalFat": totalFat.toJson(),
        "saturatedFat": saturatedFat.toJson(),
        "carbohydrate": carbohydrate.toJson(),
        "sugars": sugars.toJson(),
        "fiber": fiber.toJson(),
        "sodium": sodium.toJson(),
        "microNutrients": micronutrients.map((m) => m.toJson()).toList(),
      }),
    );
  }

  static Future<http.Response> updateCustomFood(
    String customFoodID,
    String userID,
    String foodName,
    String description,
    double servingSize,
    String group,
    String servingUnit,
    String measureDescription,
    NutritionInfo energy,
    NutritionInfo protein,
    NutritionInfo totalFat,
    NutritionInfo saturatedFat,
    NutritionInfo carbohydrate,
    NutritionInfo sugars,
    NutritionInfo fiber,
    NutritionInfo sodium, {
    List<Micronutrient> micronutrients = const [],
  }) async {
    final token = SessionManager().token;

    return await http.put(
      Uri.parse('$_base/update/$customFoodID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        "userId": userID,
        "foodName": foodName,
        "description": description,
        "serving_size": servingSize,
        "group": group,
        "serving_size_unit": servingUnit,
        "measure_description": measureDescription,
        "energy": energy.toJson(),
        "protein": protein.toJson(),
        "totalFat": totalFat.toJson(),
        "saturatedFat": saturatedFat.toJson(),
        "carbohydrate": carbohydrate.toJson(),
        "sugars": sugars.toJson(),
        "fiber": fiber.toJson(),
        "sodium": sodium.toJson(),
        "microNutrients": micronutrients.map((m) => m.toJson()).toList(),
      }),
    );
  }

  static Future<http.Response> deleteCustomFood(String customFoodID) async {
    final token = SessionManager().token;

    return await http.delete(
      Uri.parse('$_base/delete/$customFoodID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
  }

  static Future<http.Response> getCustomFoodByID(String customFoodID) async {
    final token = SessionManager().token;

    return await http.get(
      Uri.parse('$_base/get/$customFoodID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
  }

  static Future<http.Response> getCustomFoodsByUser(String userID) async {
    final token = SessionManager().token;

    return await http.get(
      Uri.parse('$_base/getbyuserid/$userID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
  }
}
