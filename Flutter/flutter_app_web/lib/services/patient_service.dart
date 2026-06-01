import 'session_manager.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class PatientService {
  static const String _base = 'http://localhost:3000/api/patients';

  static Future<http.Response> createPatient(
    String userID,
    String firstName,
    String lastName,
    String birthDate,
    String gender,
    String ethnicity,
    double weight,
    double height,
    String activityLevel
  ) async {
    final token = SessionManager().token;

    return await http.post(
      Uri.parse('$_base/create-patient'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'userId': userID,
        'firstName': firstName,
        'lastName': lastName,
        'birthDate': birthDate,
        'gender': gender,
        'ethnicity': ethnicity,
        'weight': weight,
        'height': height,
        'activityLevel': activityLevel
      }),
    );
  }

  static Future<http.Response> getAllPatients(String userID) async {
    final token = SessionManager().token;

    return await http.get(
      Uri.parse('$_base/all-patients/$userID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
  }

  static Future<http.Response> getPatientByID(String patientID) async {
    final token = SessionManager().token;

    return await http.get(
      Uri.parse('$_base/get-by-id/$patientID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
  }

  static Future<http.Response> updatePatient(
    String firstName,
    String lastName,
    String birthDate,
    String gender,
    String ethnicity,
    double weight,
    double height,
    String activityLevel
  ) async {
    final token = SessionManager().token;

    return await http.put(
      Uri.parse('$_base/create-patient'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'firstName': firstName,
        'lastName': lastName,
        'birthDate': birthDate,
        'gender': gender,
        'ethnicity': ethnicity,
        'weight': weight,
        'height': height,
        'activityLevel': activityLevel
      }),
    );
  }

  static Future<http.Response> deletePatient(String patientID) async {
    final token = SessionManager().token;

    return await http.delete(
      Uri.parse('$_base/delete-patient/$patientID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
  }
}