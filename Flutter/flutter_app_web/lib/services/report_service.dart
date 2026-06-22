import 'session_manager.dart';
import 'package:http/http.dart' as http;

class ReportService {
  static Future<http.Response> dayReport (String date, String patientID) async {
    final token = SessionManager().token;

    final Uri uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/report/day',
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

  static Future<http.Response> weekReport (String startDate, String patientID) async {
    final token = SessionManager().token;

    final Uri uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/report/week',
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

  static Future<http.Response> customReport (String startDate, String endDate, String patientID) async {
    final token = SessionManager().token;

    final Uri uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/report/customperiod',
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