# Nutrition Tracking App
> Created by Austin and Maddy

### Overview
This program is intended to be used by Bachelor of Nursing / Bachelor of Applied Science (Exercise) students to record, analyse, and compare someone's dietary intake to RDIs / Nutritional Requirements.

### Prerequisites
Have [Node.js & npm Installed](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

### Usage
To use this program, do the following steps:
1. Clone the repositority (`git clone https://github.com/nishikigoi-koi/Software-Engineering-Nutrition-App.git` in terminal).
2. Run `cd ./Node ; npm install` inside of your terminal to move into the node directory and install all required npm packages
3. Run `Copy-Item -Path ".env.example" -Destination ".env"` to copy and rename the "example.env" file to be ".env" <br> (skip this step if you have your own .env set up)
4. Run `npm start` inside of your terminal to start the API server (to stop it press ctrl + c).
<br> (for Dev env use `npm run dev` instead) 
5. Open a **New** terminal window and navigate back to the main directory of the program
6. Run `flutter run -d chrome` to run the Flutter frontend in Chrome.

### Example of flutter run
```
C:\Assessments\D301\Software-Engineering-Nutrition-App\Flutter\flutter_app_web>flutter run -d chrome                
Resolving dependencies... 
Downloading packages... 
  matcher 0.12.19 (0.12.20 available)
  meta 1.17.0 (1.18.2 available)
  test_api 0.7.10 (0.7.12 available)
  vector_math 2.2.0 (2.3.0 available)
  vm_service 15.1.0 (15.2.0 available)
Got dependencies!
5 packages have newer versions incompatible with dependency constraints.
Try `flutter pub outdated` for more information.
Launching lib\main.dart on Chrome in debug mode...
Waiting for connection from debug service on Chrome...             27.2s

Flutter run key commands.
r Hot reload. 
R Hot restart.
h List all available interactive commands.
d Detach (terminate "flutter run" but leave application running).
c Clear the screen
q Quit (terminate the application on the device).

Debug service listening on ws://127.0.0.1:65002/oAe1cyVl48E=/ws
A Dart VM Service on Chrome is available at: http://127.0.0.1:65002/oAe1cyVl48E=
The Flutter DevTools debugger and profiler on Chrome is available at: http://127.0.0.1:65002/oAe1cyVl48E=/devtools/?uri=ws://127.0.0.1:65002/oAe1cyVl48E=/ws
Starting application from main method in: org-dartlang-app:/web_entrypoint.dart.

Application finished.

C:\Assessments\D301\Software-Engineering-Nutrition-App\Flutter\flutter_app_web>flutter run -d chrome
Resolving dependencies... 
[Downloads dependencies, lines removed]
Waiting for connection from debug service on Chrome...             32.3s

Flutter run key commands.
r Hot reload. 
R Hot restart.
h List all available interactive commands.
d Detach (terminate "flutter run" but leave application running).
c Clear the screen
q Quit (terminate the application on the device).

Debug service listening on ws://127.0.0.1:65523/[REDACTED]
A Dart VM Service on Chrome is available at: http://127.0.0.1:65523/[REDACTED]
The Flutter DevTools debugger and profiler on Chrome is available at: http://127.0.0.1:65523[REDACTED]/devtools/?uri=ws://127.0.0.1:65523/[REDACTED]/ws
Starting application from main method in: org-dartlang-app:/web_entrypoint.dart.
```
