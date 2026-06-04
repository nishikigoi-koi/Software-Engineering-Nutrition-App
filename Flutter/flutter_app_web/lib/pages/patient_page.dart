import 'package:flutter/material.dart';
import 'package:flutter_app_web/models/patient.dart';
import 'package:flutter_app_web/pages/home_page.dart';
import 'package:flutter_app_web/services/session_manager.dart';
import 'package:flutter_app_web/services/patient_service.dart';
import 'package:flutter_app_web/utils/dialog_utils.dart';
import 'dart:convert';
import 'login_page.dart';
import 'medical_conditions_page.dart';
import 'diet_restrictions_page.dart';

class PatientPage extends StatefulWidget {
  const PatientPage({super.key});

  @override
  _PatientPageState createState() => _PatientPageState();
}

class _PatientPageState extends State<PatientPage> {
  List<Patient> _patients = [];
  Patient? _selectedPatient;
  bool _isNewPatient = false;
  bool _isLoading = true;

  // Form controllers
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _birthDateController = TextEditingController();
  final _ethnicityController = TextEditingController();
  final _weightController = TextEditingController();
  final _heightController = TextEditingController();
  String? _selectedGender;
  String? _selectedActivityLevel;

  final List<String> _genderOptions = ['Male', 'Female', 'Non-binary'];
  final List<String> _activityOptions = ['Light', 'Moderate', 'Active'];

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
        _loadPatients();
      }
    });
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _birthDateController.dispose();
    _ethnicityController.dispose();
    _weightController.dispose();
    _heightController.dispose();
    super.dispose();
  }

  // API calls 
  Future<void> _loadPatients() async {
    setState(() => _isLoading = true);
    final userId = SessionManager().currentUser!.id;

    final response = await PatientService.getAllPatients(userId);

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      setState(() {
        _patients = data.map((p) => Patient.fromJson(p)).toList();
        _isLoading = false;
      });
    } else {
      setState(() => _isLoading = false);
      DialogUtils.showError(context, 'Failed to load patients. (${response.statusCode})');
    }
  }

  Future<void> _createPatient() async {
    final userId = SessionManager().currentUser!.id;

    final response = await PatientService.createPatient(
      userId,
      _firstNameController.text,
      _lastNameController.text,
      _birthDateController.text,
      _selectedGender ?? '',
      _ethnicityController.text,
      double.tryParse(_weightController.text) ?? 0,
      double.tryParse(_heightController.text) ?? 0,
      _selectedActivityLevel ?? '',
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      await _loadPatients();
      _clearForm();
    } else {
      DialogUtils.showError(context, 'Failed to create patient. (${response.statusCode})');
    }
  }

  Future<void> _updatePatient() async {
    if (_selectedPatient == null) return;

    final response = await PatientService.updatePatient(
      _selectedPatient!.id,
      _firstNameController.text,
      _lastNameController.text,
      _birthDateController.text,
      _selectedGender ?? '',
      _ethnicityController.text,
      double.tryParse(_weightController.text) ?? 0,
      double.tryParse(_heightController.text) ?? 0,
      _selectedActivityLevel ?? '',
    );

    if (response.statusCode == 200) {
      await _loadPatients();
    } else {
      DialogUtils.showError(context, 'Failed to update patient. (${response.statusCode})');
    }
  }

  Future<void> _deletePatient() async {
    if (_selectedPatient == null) return;

    final response = await PatientService.deletePatient(_selectedPatient!.id);

    if (response.statusCode == 200 || response.statusCode == 204) {
      await _loadPatients();
      _clearForm();
    } else {
      DialogUtils.showError(context, 'Failed to delete patient. (${response.statusCode})');
    }
  }

  // Helpers 

  void _selectPatient(Patient patient) {
    setState(() {
      _selectedPatient = patient;
      _isNewPatient = false;
      _firstNameController.text = patient.firstName;
      _lastNameController.text = patient.lastName;
      _birthDateController.text = patient.birthDate.toIso8601String().split('T')[0];
      _ethnicityController.text = patient.ethnicity;
      _weightController.text = patient.weight.toString();
      _heightController.text = patient.height.toString();
      _selectedGender = patient.gender;
      _selectedActivityLevel = patient.activityLevel;
    });
  }

  void _selectNewPatient() {
    setState(() {
      _selectedPatient = null;
      _isNewPatient = true;
      _firstNameController.clear();
      _lastNameController.clear();
      _birthDateController.clear();
      _ethnicityController.clear();
      _weightController.clear();
      _heightController.clear();
      _selectedGender = null;
      _selectedActivityLevel = null;
    });
  }

  void _clearForm() {
    setState(() {
      _selectedPatient = null;
      _isNewPatient = false;
      _firstNameController.clear();
      _lastNameController.clear();
      _birthDateController.clear();
      _ethnicityController.clear();
      _weightController.clear();
      _heightController.clear();
      _selectedGender = null;
      _selectedActivityLevel = null;
    });
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Main content
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Patient list 
                      Container(
                        width: 250,
                        decoration: BoxDecoration(
                          border: Border(
                            right: BorderSide(color: Color(0xFFE0E0E0)),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Text(
                                'Patients',
                                style: TextStyle(
                                  fontFamily: 'Poppins',
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                  color: Color(0xFF1C1C1C),
                                ),
                              ),
                            ),
                            Divider(height: 1),
                            // "Create new patient" option
                            ListTile(
                              title: Text(
                                '+ New Patient',
                                style: TextStyle(
                                  fontFamily: 'Poppins',
                                  fontSize: 14,
                                  color: Color(0xFF3B62FF),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              selected: _isNewPatient,
                              selectedTileColor: Color(0xFFEEF1FF),
                              onTap: _selectNewPatient,
                            ),
                            Divider(height: 1),
                            // Patient list
                            Expanded(
                              child: _patients.isEmpty
                                  ? Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Text(
                                        'Select or add a patient.',
                                        style: TextStyle(
                                          fontFamily: 'Poppins',
                                          fontSize: 13,
                                          color: Color(0xFF87879D),
                                        ),
                                      ),
                                    )
                                  : ListView.builder(
                                      itemCount: _patients.length,
                                      itemBuilder: (context, index) {
                                        final patient = _patients[index];
                                        final isSelected = _selectedPatient?.id == patient.id;
                                        return ListTile(
                                          title: Text(
                                            '${patient.firstName} ${patient.lastName}',
                                            style: TextStyle(
                                              fontFamily: 'Poppins',
                                              fontSize: 14,
                                              color: Color(0xFF1C1C1C),
                                            ),
                                          ),
                                          selected: isSelected,
                                          selectedTileColor: Color(0xFFEEF1FF),
                                          onTap: () => _selectPatient(patient),
                                        );
                                      },
                                    ),
                            ),
                          ],
                        ),
                      ),

                      // Patient details 
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _isNewPatient
                                    ? 'New Patient'
                                    : _selectedPatient != null
                                        ? '${_selectedPatient!.firstName} ${_selectedPatient!.lastName}'
                                        : 'No Patient Selected',
                                style: TextStyle(
                                  fontFamily: 'Poppins',
                                  fontWeight: FontWeight.bold,
                                  fontSize: 22,
                                  color: Color(0xFF1C1C1C),
                                ),
                              ),
                              SizedBox(height: 20),

                              if (_isNewPatient || _selectedPatient != null) ...[
                                // Name row
                                Row(
                                  children: [
                                    Expanded(
                                      child: TextField(
                                        controller: _firstNameController,
                                        decoration: InputDecoration(
                                          labelText: 'First Name',
                                          border: OutlineInputBorder(),
                                        ),
                                      ),
                                    ),
                                    SizedBox(width: 16),
                                    Expanded(
                                      child: TextField(
                                        controller: _lastNameController,
                                        decoration: InputDecoration(
                                          labelText: 'Last Name',
                                          border: OutlineInputBorder(),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(height: 16),

                                // Birth date and ethnicity
                                Row(
                                  children: [
                                    Expanded(
                                      child: TextField(
                                        controller: _birthDateController,
                                        decoration: InputDecoration(
                                          labelText: 'Birth Date (YYYY-MM-DD)',
                                          border: OutlineInputBorder(),
                                        ),
                                      ),
                                    ),
                                    SizedBox(width: 16),
                                    Expanded(
                                      child: TextField(
                                        controller: _ethnicityController,
                                        decoration: InputDecoration(
                                          labelText: 'Ethnicity',
                                          border: OutlineInputBorder(),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(height: 16),

                                // Gender and activity level
                                Row(
                                  children: [
                                    Expanded(
                                      child: DropdownButtonFormField<String>(
                                        initialValue: _selectedGender,
                                        decoration: InputDecoration(
                                          labelText: 'Gender',
                                          border: OutlineInputBorder(),
                                        ),
                                        items: _genderOptions
                                            .map((g) => DropdownMenuItem(value: g, child: Text(g)))
                                            .toList(),
                                        onChanged: (value) => setState(() => _selectedGender = value),
                                      ),
                                    ),
                                    SizedBox(width: 16),
                                    Expanded(
                                      child: DropdownButtonFormField<String>(
                                        initialValue: _selectedActivityLevel,
                                        decoration: InputDecoration(
                                          labelText: 'Activity Level',
                                          border: OutlineInputBorder(),
                                        ),
                                        items: _activityOptions
                                            .map((a) => DropdownMenuItem(value: a, child: Text(a)))
                                            .toList(),
                                        onChanged: (value) => setState(() => _selectedActivityLevel = value),
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(height: 16),

                                // Weight and height
                                Row(
                                  children: [
                                    Expanded(
                                      child: TextField(
                                        controller: _weightController,
                                        decoration: InputDecoration(
                                          labelText: 'Weight (kg)',
                                          border: OutlineInputBorder(),
                                        ),
                                        keyboardType: TextInputType.number,
                                      ),
                                    ),
                                    SizedBox(width: 16),
                                    Expanded(
                                      child: TextField(
                                        controller: _heightController,
                                        decoration: InputDecoration(
                                          labelText: 'Height (cm)',
                                          border: OutlineInputBorder(),
                                        ),
                                        keyboardType: TextInputType.number,
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(height: 24),

                                // Action buttons
                                Row(
                                  children: [
                                    ElevatedButton(
                                      onPressed: _isNewPatient ? _createPatient : null,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Color(0xFF3B62FF),
                                        disabledBackgroundColor: Color(0xFFCCCCCC),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                                      ),
                                      child: Text('Add Patient',
                                          style: TextStyle(color: Colors.white, fontFamily: 'Poppins')),
                                    ),
                                    SizedBox(width: 12),
                                    ElevatedButton(
                                      onPressed: _selectedPatient != null ? _updatePatient : null,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Color(0xFF3B62FF),
                                        disabledBackgroundColor: Color(0xFFCCCCCC),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                                      ),
                                      child: Text('Edit Patient',
                                          style: TextStyle(color: Colors.white, fontFamily: 'Poppins')),
                                    ),
                                    SizedBox(width: 12),
                                    ElevatedButton(
                                      onPressed: _selectedPatient != null
                                          ? () => DialogUtils.showConfirmDelete(
                                                context,
                                                '${_selectedPatient!.firstName} ${_selectedPatient!.lastName}',
                                                _deletePatient,
                                              )
                                          : null,
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.red,
                                        disabledBackgroundColor: Color(0xFFCCCCCC),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                                      ),
                                      child: Text('Delete Patient',
                                          style: TextStyle(color: Colors.white, fontFamily: 'Poppins')),
                                    ),
                                  ],
                                ),
                              ] else
                                Text(
                                  'Select a patient from the list or create a new one.',
                                  style: TextStyle(
                                    fontFamily: 'Poppins',
                                    fontSize: 14,
                                    color: Color(0xFF87879D),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),

                      // Management buttons 
                      Container(
                        width: 200,
                        decoration: BoxDecoration(
                          border: Border(
                            left: BorderSide(color: Color(0xFFE0E0E0)),
                          ),
                        ),
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Text(
                              'Management',
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                                color: Color(0xFF1C1C1C),
                              ),
                            ),
                            SizedBox(height: 12),
                            ElevatedButton(
                              onPressed: _selectedPatient != null
                                  ? () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (_) => const MedicalConditionsPage(),
                                        ),
                                      );
                                    }
                                  : null,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFF3B62FF),
                                disabledBackgroundColor: Color(0xFFCCCCCC),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                padding: EdgeInsets.symmetric(vertical: 14),
                              ),
                              child: Text(
                                'Med. Conditions',
                                textAlign: TextAlign.center,
                                style: TextStyle(color: Colors.white, fontFamily: 'Poppins', fontSize: 13),
                              ),
                            ),
                            SizedBox(height: 12),
                            ElevatedButton(
                              onPressed: _selectedPatient != null
                                ? () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => const DietRestrictionsPage(),
                                      ),
                                    );
                                  }
                                : null,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFF3B62FF),
                                disabledBackgroundColor: Color(0xFFCCCCCC),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                padding: EdgeInsets.symmetric(vertical: 14),
                              ),
                              child: Text(
                                'Diet Restrictions',
                                textAlign: TextAlign.center,
                                style: TextStyle(color: Colors.white, fontFamily: 'Poppins', fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
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
                _navButton('Patients', Icons.people, () {}),
                _navButton('Meals', Icons.restaurant, () {}),
                _navButton('Reports', Icons.bar_chart, () {}),
                _navButton('Settings', Icons.settings, () {}),
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