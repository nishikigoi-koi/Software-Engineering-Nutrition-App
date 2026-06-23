import 'package:flutter/material.dart';
import 'package:flutter_app_web/services/session_manager.dart';
import 'package:flutter_app_web/services/user_service.dart';
import 'package:flutter_app_web/utils/dialog_utils.dart';
import 'login_page.dart';
import 'home_page.dart';
import 'patient_page.dart';
import 'meal_log_page.dart';
import 'report_page.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isSaving = false;
  bool _isDeleting = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (SessionManager().currentUser == null) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => LoginPage()),
          (route) => false,
        );
      } else {
        _usernameController.text = SessionManager().currentUser!.username;
      }
    });
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _saveChanges() async {
    final username = _usernameController.text.trim();
    final password = _passwordController.text.trim();

    if (username.isEmpty || password.isEmpty) {
      DialogUtils.showError(context, 'Please fill in both fields.');
      return;
    }

    setState(() => _isSaving = true);

    final userId = SessionManager().currentUser!.id;
    final response = await UserService.updateUser(userId, username, password);

    setState(() => _isSaving = false);

    if (response.statusCode == 200) {
      _passwordController.clear();
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          content: Text('Account details updated successfully.'),
        ),
      );
    } else {
      DialogUtils.showError(context, 'This username already exists.');
    }
  }

  Future<void> _deleteAccount() async {
    setState(() => _isDeleting = true);

    final userId = SessionManager().currentUser!.id;
    final response = await UserService.deleteUser(userId);

    setState(() => _isDeleting = false);

    if (response.statusCode == 200 || response.statusCode == 204) {
      SessionManager().clear();
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => LoginPage()),
        (route) => false,
      );
    } else {
      DialogUtils.showError(context, 'Failed to delete account. (${response.statusCode} ${response.body})');
    }
  }

  void _confirmDeleteAccount() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Delete Account'),
        content: Text('Are you sure you want to delete your account? This cannot be undone and all your data will be lost.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _deleteAccount();
            },
            child: Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: Center(
              child: ConstrainedBox(
                constraints: BoxConstraints(maxWidth: 400),
                child: Padding(
                  padding: const EdgeInsets.all(30.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Text(
                        'Settings',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.bold,
                          fontSize: 26,
                          color: Color(0xFF1C1C1C),
                        ),
                      ),
                      SizedBox(height: 6),
                      Text(
                        'Manage your account',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.normal,
                          fontSize: 18,
                          color: Color(0xFF1C1C1C),
                        ),
                      ),
                      SizedBox(height: 26),

                      TextField(
                        controller: _usernameController,
                        decoration: InputDecoration(
                          labelText: 'Username',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      SizedBox(height: 16),

                      TextField(
                        controller: _passwordController,
                        decoration: InputDecoration(
                          labelText: 'Password',
                          border: OutlineInputBorder(),
                        ),
                        obscureText: true,
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Enter your current password to keep it the same, or a new password to change it.',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 12,
                          color: Color(0xFF87879D),
                        ),
                      ),
                      SizedBox(height: 26),

                      SizedBox(
                        height: 49,
                        child: ElevatedButton(
                          onPressed: _isSaving ? null : _saveChanges,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xFF3B62FF),
                            disabledBackgroundColor: Color(0xFFCCCCCC),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: Text(
                            _isSaving ? 'Saving...' : 'Save Changes',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),

                      SizedBox(height: 40),
                      Divider(),
                      SizedBox(height: 16),

                      Text(
                        'Danger Zone',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.red,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Deleting your account is permanent and cannot be undone.',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 13,
                          color: Color(0xFF87879D),
                        ),
                      ),
                      SizedBox(height: 12),

                      SizedBox(
                        height: 49,
                        child: ElevatedButton(
                          onPressed: _isDeleting ? null : _confirmDeleteAccount,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                            disabledBackgroundColor: Color(0xFFCCCCCC),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: Text(
                            _isDeleting ? 'Deleting...' : 'Delete Account',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          // Bottom navbar
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: Color(0xFFE0E0E0))),
            ),
            child: Row(
              children: [
                _navButton('Home', Icons.home, () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => HomePage()),
                    (route) => false,
                  );
                }),
                _navButton('Patients', Icons.people, () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => PatientPage()),
                    (route) => false,
                  );
                }),
                _navButton('Meals', Icons.restaurant, () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => MealLogPage()),
                    (route) => false,
                  );
                }),
                _navButton('Reports', Icons.bar_chart, () {
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (context) => ReportPage()),
                    (route) => false,
                  );
                }),
                _navButton('Settings', Icons.settings, null),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _navButton(String label, IconData icon, VoidCallback? onPressed) {
    return Expanded(
      child: TextButton(
        onPressed: onPressed,
        style: TextButton.styleFrom(
          padding: EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.zero),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, color: Color(0xFF3B62FF), size: 22),
            SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                color: Color(0xFF3B62FF),
              ),
            ),
          ],
        ),
      ),
    );
  }
}