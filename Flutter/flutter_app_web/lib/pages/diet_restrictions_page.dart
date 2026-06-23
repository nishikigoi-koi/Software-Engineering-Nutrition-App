import 'package:flutter/material.dart';
import 'dart:convert';
import '../models/diet_restriction.dart';
import '../models/patient.dart';
import '../services/patient_service.dart';
import '../services/diet_restriction_service.dart';
import '../services/session_manager.dart';
import '../utils/dialog_utils.dart';
import 'patient_page.dart';

class DietRestrictionsPage extends StatefulWidget {
  const DietRestrictionsPage({super.key});

  @override
  State<DietRestrictionsPage> createState() =>
      _DietRestrictionsPageState();
}

class _DietRestrictionsPageState extends State<DietRestrictionsPage> {
  List<DietRestriction> _items = [];
  List<Patient> _patients = [];

  DietRestriction? _selected;
  final Set<String> _assigned = {};

  bool _isNew = false;
  bool _loading = true;

  final _name = TextEditingController();
  final _desc = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _load();
    });
  }

Future<void> _load() async {
  setState(() => _loading = true);

  final userId = SessionManager().currentUser!.id;

  final patientsResponse =
      await PatientService.getAllPatients(userId);

  final restrictionsResponse =
      await DietRestrictionService.getAllRestrictions();

  if (patientsResponse.statusCode == 200 &&
      restrictionsResponse.statusCode == 200) {

    final patientsJson =
        jsonDecode(patientsResponse.body);

    final restrictionsJson =
        jsonDecode(restrictionsResponse.body);

    setState(() {
      _patients = (patientsJson as List)
          .map((e) => Patient.fromJson(e))
          .toList();

      _items = (restrictionsJson as List)
          .map((e) => DietRestriction.fromJson(e))
          .toList();

      _loading = false;
    });
  } else {
    setState(() => _loading = false);
    DialogUtils.showError(context, 'Failed to load data');
  }
}

  Future<void> _select(DietRestriction r) async {
    setState(() {
      _selected = r;
      _isNew = false;
      _name.text = r.name;
      _desc.text = r.description;
      _assigned.clear();
    });

    for (final p in _patients) {
      final res =
          await DietRestrictionService.getPatientRestrictions(
              p.id);

      if (res.statusCode == 200) {
        final list = jsonDecode(res.body) as List;

        if (list.any((e) => e['id'] == r.id)) {
          _assigned.add(p.id);
        }
      }
    }

    setState(() {});
  }

  Future<void> _toggle(Patient p, bool v) async {
    if (_selected == null) return;

    if (v) {
      await DietRestrictionService.assignRestriction(
        p.id,
        _selected!.id,
      );
      _assigned.add(p.id);
    } else {
      await DietRestrictionService.removeRestriction(
        p.id,
        _selected!.id,
      );
      _assigned.remove(p.id);
    }

    setState(() {});
  }

  Future<void> _create() async {
    
    final name = _name.text.trim();
    final desc = _desc.text.trim();

    if (name.isEmpty || desc.isEmpty) {
      DialogUtils.showError(context, 'Please ensure all fields are filled out.');
      return;
    } 

    await DietRestrictionService.createRestriction(
      name,
      desc,
    );

    _clear();
    _load();
  }

  Future<void> _update() async {
    if (_selected == null) return;

    final name = _name.text.trim();
    final desc = _desc.text.trim();

    if (name.isEmpty || desc.isEmpty) {
      DialogUtils.showError(context, 'Please ensure all fields are filled out.');
      return;
    } 

    await DietRestrictionService.updateRestriction(
      _selected!.id,
      name,
      desc,
    );

    _load();
  }

  Future<void> _delete() async {
    if (_selected == null) return;

    await DietRestrictionService.deleteRestriction(
      _selected!.id,
    );

    _clear();
    _load();
  }

  void _clear() {
    setState(() {
      _selected = null;
      _isNew = false;
      _name.clear();
      _desc.clear();
      _assigned.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : Row(
                    children: [
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
                              child: Text('Diet Restrictions'),
                            ),

                            ListTile(
                              title: const Text('+ New Restriction'),
                              selected: _isNew,
                              onTap: () {
                                setState(() {
                                  _isNew = true;
                                  _selected = null;
                                  _name.clear();
                                  _desc.clear();
                                });
                              },
                            ),

                            const Divider(),

                            Expanded(
                              child: ListView.builder(
                                itemCount: _items.length,
                                itemBuilder: (_, i) {
                                  final r = _items[i];
                                  return ListTile(
                                    title: Text(r.name),
                                    selected:
                                        _selected?.id == r.id,
                                    onTap: () => _select(r),
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ),

                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: _isNew || _selected != null
                          ? Column(
                            crossAxisAlignment:
                                CrossAxisAlignment.start,
                            children: [
                              Text(
                                _isNew
                                    ? 'New Restriction'
                                    : _selected?.name ??
                                        'Select Restriction',
                                style: const TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),

                              TextField(
                                controller: _name,
                                decoration: const InputDecoration(
                                  labelText: 'Name',
                                ),
                              ),

                              TextField(
                                controller: _desc,
                                decoration: const InputDecoration(
                                  labelText: 'Description',
                                ),
                              ),

                              Row(
                                children: [
                                  ElevatedButton(
                                    onPressed:
                                        _isNew ? _create : null,
                                    child: const Text('Create'),
                                  ),
                                  ElevatedButton(
                                    onPressed:
                                        _selected != null
                                            ? _update
                                            : null,
                                    child: const Text('Update'),
                                  ),
                                  ElevatedButton(
                                    onPressed:
                                        _selected != null
                                            ? _delete
                                            : null,
                                    child: const Text('Delete'),
                                  ),
                                ],
                              ),
                            ],
                          )
                        : Center(
                            child: Text(
                              'Select a restriction or create a new one.',
                              style: TextStyle(fontSize: 14, color: Color(0xFF87879D)),             
                            )
                          )
                        ),
                      ),

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
                                    value: _assigned.contains(p.id),
                                    onChanged: (v) =>
                                        _toggle(p, v ?? false),
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