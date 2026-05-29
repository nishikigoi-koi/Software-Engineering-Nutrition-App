import 'package:flutter/material.dart';
import 'package:flutter_app_web/services/session_manager.dart';
import 'login_page.dart';

class SessionTestPage extends StatelessWidget {
  const SessionTestPage({super.key});

  @override
  Widget build(BuildContext context) {
    final user = SessionManager().currentUser;

    return Scaffold(
      appBar: AppBar(title: Text('Session Test')),
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
                  'Session Test',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 26,
                    color: Color(0xFF1C1C1C),
                  ),
                ),

                SizedBox(height: 26),

                // Display session data
                Text('ID: ${user?.id ?? 'null'}',
                  style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF1C1C1C)),
                ),
                SizedBox(height: 6),
                Text('Username: ${user?.username ?? 'null'}',
                  style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF1C1C1C)),
                ),
                SizedBox(height: 6),
                Text('Created At: ${user?.createdAt ?? 'null'}',
                  style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF1C1C1C)),
                ),
                SizedBox(height: 6),
                Text('Updated At: ${user?.updatedAt ?? 'null'}',
                  style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF1C1C1C)),
                ),
                SizedBox(height: 6),
                Text('Deleted At: ${user?.deletedAt ?? 'null'}',
                  style: TextStyle(fontFamily: 'Poppins', fontSize: 14, color: Color(0xFF1C1C1C)),
                ),

                SizedBox(height: 26),

                SizedBox(
                  width: 400,
                  height: 49,
                  child: ElevatedButton(
                    onPressed: () {
                      // Clear the session data (setting currentUser to null).
                      SessionManager().clear();

                      // Remove all previous items from navigation queue, so pressing back does nothing.
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