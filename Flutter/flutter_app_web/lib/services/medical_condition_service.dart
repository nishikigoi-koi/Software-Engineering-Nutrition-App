import 'session_manager.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class MedicalConditionService {
  static const String _base = 'http://localhost:3000/api/medical-conditions';

  static Future<http.Response> createCondition(String name, String description) async {
    final token = SessionManager().token;

    return await http.post(
      Uri.parse('$_base/create-medical-condition'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'name': name,
        'description': description
      }),
    );
  }

  static Future<http.Response> getAllConditions() async {
    return await http.get(
      Uri.parse('$_base/all-medical-conditions'),
      headers: {'Content-Type': 'application/json'},
    );
  }

  static Future<http.Response> getConditionByID(String id) async {
    return await http.get(
      Uri.parse('$_base/get-by-id/$id'),
      headers: {'Content-Type': 'application/json'},
    );
  }

  static Future<http.Response> updateCondition(String id, String name, String description) async {
    final token = SessionManager().token;

    return await http.put(
      Uri.parse('$_base/update-medical-condition/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'name': name,
        'description': description
      }),
    );
  }

  static Future<http.Response> deleteCondition(String id) async {
    final token = SessionManager().token;

    return await http.delete(
      Uri.parse('$_base/delete-medical-condition/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
  }

  static Future<http.Response> assignCondition(String patientID, String conditionID) async {
    final token = SessionManager().token;

    return await http.post(
      Uri.parse('$_base/assign-to-patient'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'patientId': patientID,
        'medicalConditionId': conditionID
      }),
    );
  }

  static Future<http.Response> removeCondition(String patientID, String conditionID) async {
    final token = SessionManager().token;

    return await http.delete(
      Uri.parse('$_base/remove-from-patient'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'patientId': patientID,
        'medicalConditionId': conditionID
      }),
    );
  }

  static Future<http.Response> getPatientConditions(String patientID) async {
    final token = SessionManager().token;

    return await http.get(
      Uri.parse('$_base/patient-medical-conditions/$patientID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
  }
}