import 'package:flutter/material.dart';
import 'package:flutter_app_web/services/session_manager.dart';
import 'package:flutter_app_web/services/user_service.dart';
import 'login_page.dart';
 
class HomePage extends StatefulWidget {
  const HomePage({super.key});
 
  @override
  _HomePageState createState() => _HomePageState();
}
 
class _HomePageState extends State<HomePage> {
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
      }
    });
  }
 
  @override
  Widget build(BuildContext context) {
    // TODO: Redesign Home Page.
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
                  'Home',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 26,
                    color: Color(0xFF1C1C1C),
                  ),
                ),
 
                SizedBox(height: 26),

                Text(
                  'This button is simply a test for JWT auth.',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: Color(0xFF1C1C1C),
                  ),
                ),
                SizedBox(
                  width: 400,
                  height: 49,
                  child: ElevatedButton(
                    onPressed: () async {
                      final response = await UserService.getAllUsers();

                      if (response.statusCode == 200) {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            content: Text('Check terminal for output.'),
                          )
                        );
                        debugPrint(response.body);

                      } else {
                        showDialog(
                          context: context,
                          builder:(context) => AlertDialog(
                            content: Text('Error: http code ${response.statusCode}'),
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
                      'Get All Users',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),

                SizedBox(height: 26),

                SizedBox(
                  width: 400,
                  height: 49,
                  child: ElevatedButton(
                    onPressed: () {
                      SessionManager().clear();
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(builder: (context) => LoginPage()),
                        (route) => false,
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF3B62FF),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      'Logout',
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
    );
  }
}
