import 'package:flutter/material.dart';
import 'dart:convert';
import '../models/medical_condition.dart';
import '../models/patient.dart';
import '../services/patient_service.dart';
import '../services/medical_condition_service.dart';
import '../services/session_manager.dart';
import '../utils/dialog_utils.dart';
import 'package:flutter_app_web/pages/patient_page.dart';

class MedicalConditionsPage extends StatefulWidget {
  const MedicalConditionsPage({super.key});

  @override
  State<MedicalConditionsPage> createState() => _MedicalConditionsPageState();
}

class _MedicalConditionsPageState extends State<MedicalConditionsPage> {
  List<MedicalCondition> _conditions = [];
  List<Patient> _patients = [];

  MedicalCondition? _selectedCondition;
  final Set<String> _assignedPatientIds = {};

  bool _isNew = false;
  bool _isLoading = true;

  final _nameController = TextEditingController();
  final _descController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadAll();
    });
  }

  Future<void> _loadAll() async {
  setState(() => _isLoading = true);

  final userId = SessionManager().currentUser!.id;

  final patientsResponse =
      await PatientService.getAllPatients(userId);

  final conditionsResponse =
      await MedicalConditionService.getAllConditions();

  if (patientsResponse.statusCode == 200 &&
      conditionsResponse.statusCode == 200) {

    final patientsJson = jsonDecode(patientsResponse.body);
    final conditionsJson = jsonDecode(conditionsResponse.body);

    setState(() {
      _patients = (patientsJson as List)
          .map((e) => Patient.fromJson(e))
          .toList();

      _conditions = (conditionsJson as List)
          .map((e) => MedicalCondition.fromJson(e))
          .toList();

      _isLoading = false;
    });
  } else {
    setState(() => _isLoading = false);
    DialogUtils.showError(context, 'Failed to load data');
  }
}

  Future<void> _selectCondition(MedicalCondition condition) async {
    setState(() {
      _selectedCondition = condition;
      _isNew = false;
      _nameController.text = condition.name;
      _descController.text = condition.description;
      _assignedPatientIds.clear();
    });
    
    for (final p in _patients) {
      final res =
          await MedicalConditionService.getPatientConditions(p.id);

      if (res.statusCode == 200) {
        final list = jsonDecode(res.body) as List;

        final hasCondition = list.any(
          (e) => e['id'] == condition.id,
        );

        if (hasCondition) {
          _assignedPatientIds.add(p.id);
        }
      }
    }

    setState(() {});
  }

  Future<void> _togglePatient(Patient patient, bool value) async {
    if (_selectedCondition == null) return;

    if (value) {
      await MedicalConditionService.assignCondition(
        patient.id,
        _selectedCondition!.id,
      );
      _assignedPatientIds.add(patient.id);
    } else {
      await MedicalConditionService.removeCondition(
        patient.id,
        _selectedCondition!.id,
      );
      _assignedPatientIds.remove(patient.id);
    }

    setState(() {});
  }

  Future<void> _create() async {
    final name = _nameController.text.trim();
    final desc = _descController.text.trim();

    if (name.isEmpty || desc.isEmpty) {
      DialogUtils.showError(context, 'Please ensure all fields are filled out.');
      return;
    }    

    await MedicalConditionService.createCondition(
      name,
      desc,
    );

    _clear();
    _loadAll();
  }

  Future<void> _update() async {
    if (_selectedCondition == null) return;

    final name = _nameController.text.trim();
    final desc = _descController.text.trim();

    if (name.isEmpty || desc.isEmpty) {
      DialogUtils.showError(context, 'Please ensure all fields are filled out.');
      return;
    } 

    await MedicalConditionService.updateCondition(
      _selectedCondition!.id,
      name,
      desc,
    );

    _loadAll();
  }

  Future<void> _delete() async {
    if (_selectedCondition == null) return;

    await MedicalConditionService.deleteCondition(
      _selectedCondition!.id,
    );

    _clear();
    _loadAll();
  }

  void _clear() {
    setState(() {
      _selectedCondition = null;
      _isNew = false;
      _nameController.clear();
      _descController.clear();
      _assignedPatientIds.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : Row(
                    children: [
                      // LEFT: list
                      Container(
                        width: 250,
                        decoration: const BoxDecoration(
                          border: Border(
                            right: BorderSide(color: Color(0xFFE0E0E0)),
                          ),
                        ),
                        child: Column(
                          children: [
                            const Padding(
                              padding: EdgeInsets.all(16),
                              child: Text(
                                'Medical Conditions',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),

                            ListTile(
                              title: const Text('+ New Condition'),
                              selected: _isNew,
                              onTap: () {
                                setState(() {
                                  _isNew = true;
                                  _selectedCondition = null;
                                  _nameController.clear();
                                  _descController.clear();
                                });
                              },
                            ),

                            const Divider(),

                            Expanded(
                              child: ListView.builder(
                                itemCount: _conditions.length,
                                itemBuilder: (_, i) {
                                  final c = _conditions[i];
                                  return ListTile(
                                    title: Text(c.name),
                                    selected:
                                        _selectedCondition?.id == c.id,
                                    onTap: () => _selectCondition(c),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ),

                      // CENTER: editor
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _isNew
                                    ? 'New Condition'
                                    : _selectedCondition?.name ??
                                        'Select Condition',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),

                              const SizedBox(height: 12),

                              TextField(
                                controller: _nameController,
                                decoration: const InputDecoration(
                                  labelText: 'Name',
                                ),
                              ),

                              TextField(
                                controller: _descController,
                                decoration: const InputDecoration(
                                  labelText: 'Description',
                                ),
                              ),

                              const SizedBox(height: 12),

                              Row(
                                children: [
                                  ElevatedButton(
                                    onPressed: _isNew ? _create : null,
                                    child: const Text('Create'),
                                  ),
                                  const SizedBox(width: 8),
                                  ElevatedButton(
                                    onPressed:
                                        _selectedCondition != null
                                            ? _update
                                            : null,
                                    child: const Text('Update'),
                                  ),
                                  const SizedBox(width: 8),
                                  ElevatedButton(
                                    onPressed:
                                        _selectedCondition != null
                                            ? _delete
                                            : null,
                                    child: const Text('Delete'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),

                      // RIGHT: patients assignment
                      Container(
                        width: 300,
                        decoration: const BoxDecoration(
                          border: Border(
                            left: BorderSide(color: Color(0xFFE0E0E0)),
                          ),
                        ),
                        child: Column(
                          children: [
                            const Padding(
                              padding: EdgeInsets.all(16),
                              child: Text('Assign Patients'),
                            ),
                            Expanded(
                              child: ListView.builder(
                                itemCount: _patients.length,
                                itemBuilder: (_, i) {
                                  final p = _patients[i];

                                  return CheckboxListTile(
                                    title: Text(
                                        '${p.firstName} ${p.lastName}'),
                                    value: _assignedPatientIds
                                        .contains(p.id),
                                    onChanged: (v) =>
                                        _togglePatient(p, v ?? false),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
          ),

          // BACK
          Container(
            padding: const EdgeInsets.all(8),
            child: ElevatedButton(
              onPressed: () {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const PatientPage(),
                  ),
                );
              },
              child: const Text('Back to Patients'),
            ),
          ),
        ],
      ),
    );
  }
}