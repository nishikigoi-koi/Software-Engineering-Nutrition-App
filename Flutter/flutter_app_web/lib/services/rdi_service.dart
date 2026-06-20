import 'session_manager.dart';
import 'package:http/http.dart' as http;

class RdiService {
  static const String _base = 'http://localhost:3000/api/rdi';

  static Future<http.Response> getPatientRDI(String patientID) async {
    final token = SessionManager().token;

    return await http.get(
      Uri.parse('$_base/$patientID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
  }
}