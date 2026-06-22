import 'session_manager.dart';
import 'package:http/http.dart' as http;

class TotalNutrientsService {
  static Future<http.Response> dayNutrientTotal(String date, String patientID) async {
    final token = SessionManager().token;

    final Uri uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/totalnutrients/day',
      queryParameters: {'date': date, 'patientid': patientID},
    );

    return await http.get(
      uri,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
      },
    );
  }

  static Future<http.Response> weekNutrientTotal(String startDate, String patientID) async {
    final token = SessionManager().token;

    final Uri uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/totalnutrients/week',
      queryParameters: {'startdate': startDate, 'patientid': patientID},
    );

    return await http.get(
      uri,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
      },
    );
  }

  static Future<http.Response> customNutrientTotal(String startDate, String endDate, String patientID) async {
    final token = SessionManager().token;

    final Uri uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/totalnutrients/customperiod',
      queryParameters: {'startdate': startDate, 'enddate': endDate, 'patientid': patientID},
    );

    return await http.get(
      uri,
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token'
      },
    );
  }
}