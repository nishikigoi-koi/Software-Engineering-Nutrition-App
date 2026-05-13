import 'package:flutter/material.dart';

class SignUpPage extends StatefulWidget {
  const SignUpPage({super.key});
 
  @override
  _SignUpPageState createState() => _SignUpPageState();
}
 
class _SignUpPageState extends State<SignUpPage> {
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
    Size size = MediaQuery.of(context).size;
 
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(30.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(
                'Create Account',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 26,
                  color: Color(0xFF1C1C1C),
                ),
              ),
 
              SizedBox(height: 6),
              Text(
                'Sign Up to get started',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.normal,
                  fontSize: 18,
                  color: Color(0xFF1C1C1C),
                ),
              ),
 
              SizedBox(width: size.width / 4, height: 26),
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
                obscureText: true,
              ),
 
              SizedBox(height: 26),
              SizedBox(
                width: size.width / 4,
                height: 49,
                child: ElevatedButton(
                  onPressed: () {
                    // Check if username or password are empty
                    if (_usernameController.text.trim().isEmpty ||
                        _passwordController.text.trim().isEmpty) {
                      showDialog(
                        context: context,
                        builder: (context) => AlertDialog(
                          content: Text(
                              "Please make sure you have filled both fields."),
                        ),
                      );
                      return;
                    }
 
                    // Return to Login page for now.
                    // TODO: Connect to database, compare against existing credentials. | SIGN UP
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF3B62FF),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: Text(
                    'Sign Up',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
 
              SizedBox(height: 10),

              // Clickable link to return to Login page
              GestureDetector(
                onTap: () {
                  Navigator.pop(context);
                },
                child: Text(
                  "Already have an account? Sign In",
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
    );
  }
}