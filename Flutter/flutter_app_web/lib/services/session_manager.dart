import 'package:flutter/foundation.dart';
import 'package:flutter_app_web/models/user.dart';

class SessionManager {
  static final SessionManager _instance = SessionManager._internal();
  factory SessionManager() => _instance;
  SessionManager._internal();

  User? currentUser;
  String? token;

  void clear() {
    // Clear current session
    currentUser = null;
    token = null;
  }
}