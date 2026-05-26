import 'package:flutter/material.dart';
import 'signup_page.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter_app_web/models/user.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: 400),
          child: Padding(
            padding: const EdgeInsets.all(30.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  'Welcome',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 26,
                    color: Color(0xFF1C1C1C),
                  ),
                ),

                SizedBox(height: 6),
                Text(
                  'Sign In to continue',
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

                SizedBox(height: 26),
                TextField(
                  controller: _passwordController,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    border: OutlineInputBorder(),
                  ),
                  obscureText: true, // hide password
                ),

                SizedBox(height: 26),

                SizedBox(
                  width: 400,
                  height: 49,
                  child: ElevatedButton(
                    onPressed: () async {
                      // Check if username or password are empty
                      if (_usernameController.text.trim().isEmpty ||
                          _passwordController.text.trim().isEmpty) {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            content: Text("Please make sure you have filled both fields."),
                          ),
                        );
                        return;
                      }
 
                      // Call login API
                      final response = await http.post(
                        Uri.parse('http://localhost:3000/api/users/check-password'),
                        headers: {'Content-Type': 'application/json'},
                        body: jsonEncode({
                          'username': _usernameController.text,
                          'password': _passwordController.text,
                        }),
                      );
 
                      // TODO: Navigate to home page
                      if (response.statusCode == 200) {
                        try {
                          Map<String, dynamic> userDetails = jsonDecode(response.body);
                          final user = User.fromJson(userDetails);

                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              content: Text("Login successful!"),
                            ),
                          );
                        } catch(e) {
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              content: Text("Error: $e"),
                            ),
                          );
                        }
                      } else {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            content: Text("Invalid username or password."),
                          ),
                        );
                      }
                    },
 
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF3B62FF),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
 
                    child: Text(
                      'Login',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
 
                SizedBox(height: 10),
 
                // Clickable text for viewing Sign Up page
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => SignUpPage()),
                    );
                  },
                  child: Text(
                    "Don't have an account? Sign Up",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      color: Color(0xFF87879D),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
