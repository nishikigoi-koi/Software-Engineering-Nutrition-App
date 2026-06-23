import 'dart:convert';
import 'package:http/http.dart' as http;
import 'session_manager.dart';
import '../models/meal_log.dart';

class MealLogService {
  static const String _base = 'http://localhost:3000/api/log';

  static Future<http.Response> createMealLog(MealLog log) async {
    final token = SessionManager().token;

    return await http.post(
      Uri.parse('$_base/create'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(log.toJson()),
    );
  }

  static Future<http.Response> updateMealLog(String mealID, MealLog log) async {
    final token = SessionManager().token;

    return await http.put(
      Uri.parse('$_base/update/$mealID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(log.toJson()),
    );
  }

  static Future<http.Response> deleteMealLog(String mealID) async {
    final token = SessionManager().token;

    final response = await http.delete(
      Uri.parse('$_base/delete/$mealID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    return response;
    
  }

  static Future<http.Response> getPatientMeals(String patientID) async {
    final token = SessionManager().token;

    return await http.get(
      Uri.parse('$_base/getbypatient/$patientID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
  }

  static Future<http.Response> getPatientMealsByDate(
    String date,
    String patientID,
  ) async {
    final token = SessionManager().token;

    final uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/log/getbypatientanddate',
      queryParameters: {'date': date, 'patientid': patientID},
    );

    return await http.get(
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
  }
}
