import 'session_manager.dart';
import 'package:http/http.dart' as http;

class FoodSearchService {
  static Future<http.Response> searchByName(String food, String userID) async {
    final token = SessionManager().token;
    final Uri uri = Uri(
      scheme: 'http',
      host: 'localhost',
      port: 3000,
      path: '/api/search',
      queryParameters: {'foodname': food, 'userid': userID},
    );

    return await http.get(
        uri,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token'
        },
    );
  }

  static Future<http.Response> searchFoodFiles(String foodFileID) async {
    final token = SessionManager().token;

    return await http.get(
        Uri.parse('http://localhost:3000/api/search-get/foodfile/$foodFileID'),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token'
        },
    );
  }

  static Future<http.Response> searchCustomFood(String customFoodID) async {
    final token = SessionManager().token;

    return await http.get(
        Uri.parse('http://localhost:3000/api/search-get/customfood/$customFoodID'),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token'
        },
    );
  }
}
