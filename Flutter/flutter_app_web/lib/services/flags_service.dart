import 'session_manager.dart';
import 'package:http/http.dart' as http;

class FlagsService {
  static Future<http.Response> dayFlags (String date, String patientID) async {
    final token = SessionManager().token;

    final Uri uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/flag/day',
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

  static Future<http.Response> weekFlags (String startDate, String patientID) async {
    final token = SessionManager().token;

    final Uri uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/flag/week',
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

  static Future<http.Response> customFlags (String startDate, String endDate, String patientID) async {
    final token = SessionManager().token;

    final Uri uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/flag/customperiod',
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