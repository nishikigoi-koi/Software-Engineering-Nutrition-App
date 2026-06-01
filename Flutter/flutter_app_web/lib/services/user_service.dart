import 'session_manager.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class UserService {
  static const String _base = 'http://localhost:3000/api/users';

  static Future<http.Response> login(String username, String password) async {
    return await http.post(
      Uri.parse('$_base/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );
  }

  static Future<http.Response> createUser(String username, String password) async {
    return await http.post(
      Uri.parse('$_base/create-user'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
          'username': username,
          'password': password
        }),
    );
  }

  static Future<http.Response> getAllUsers() async {
    final token = SessionManager().token;
    
    return await http.get(
      Uri.parse('$_base/all-users'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
  }

  static Future<http.Response> getUserByID(String id) async {
    final token = SessionManager().token;

    return await http.get(
      Uri.parse('$_base/get-by-id/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
  }

  static Future<http.Response> updateUser(String id, String newUsername, String newPassword) async {
    final token = SessionManager().token;
    
    return await http.put(
      Uri.parse('$_base/update-user/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
      body: jsonEncode({
        'username': newUsername,
        'password': newPassword
      }),
    );
  }

  static Future<http.Response> deleteUser(String id) async {
    final token = SessionManager().token;

    return await http.delete(
      Uri.parse('$_base/delete-user/$id'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token'
      },
    );
  }
}