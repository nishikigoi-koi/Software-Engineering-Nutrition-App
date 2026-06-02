import 'session_manager.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DietRestrictionService {
  static const String _base = 'http://localhost:3000/api/dietary-restrictions';

  static Future<http.Response> createRestriction(String name, String description) async {
    final token = SessionManager().token;

    return await http.post(
      Uri.parse('$_base/create-dietary-restriction'),
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

  static Future<http.Response> getAllRestrictions() async {
    return await http.get(
      Uri.parse('$_base/all-dietary-restrictions'),
      headers: {'Content-Type': 'application/json'},
    );
  }

  static Future<http.Response> getRestrictionByID(String id) async {
    return await http.get(
      Uri.parse('$_base/get-by-id/$id'),
      headers: {'Content-Type': 'application/json'},
    );
  }

  static Future<http.Response> updateRestriction(String id, String name, String description) async {
    final token = SessionManager().token;

    return await http.put(
      Uri.parse('$_base/update-dietary-restriction/$id'),
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

  static Future<http.Response> deleteRestriction(String id) async {
    final token = SessionManager().token;

    return await http.delete(
      Uri.parse('$_base/delete-dietary-restriction/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
  }

  static Future<http.Response> assignRestriction(String patientID, String restrictionID) async {
    final token = SessionManager().token;

    return await http.post(
      Uri.parse('$_base/assign-to-patient'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'patientId': patientID,
        'dietaryRestrictionId': restrictionID
      }),
    );
  }

  static Future<http.Response> removeRestriction(String patientID, String restrictionID) async {
    final token = SessionManager().token;

    return await http.delete(
      Uri.parse('$_base/remove-from-patient'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'patientId': patientID,
        'dietaryRestrictionId': restrictionID
      }),
    );
  }

  static Future<http.Response> getPatientRestrictions(String patientID) async {
    final token = SessionManager().token;

    return await http.get(
      Uri.parse('$_base/patient-dietary-restrictions/$patientID'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
  }
}