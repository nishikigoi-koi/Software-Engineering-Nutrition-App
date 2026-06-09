# Nutrition Tracking App
> Created by Austin and Maddy

### Overview
This program is intended to be used by Bachelor of Nursing / Bachelor of Applied Science (Exercise) students to record, analyse, and compare someone's dietary intake to RDIs / Nutritional Requirements.

### Prerequisites
Have [Node.js & npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.<br>
Have [Flutter & Dart](https://docs.flutter.dev/install) installed.<br>
Have [Google Chrome](https://www.google.com/chrome/) installed.<br>

### Usage
To use this program, do the following steps:
1. Clone the repositority (`git clone https://github.com/nishikigoi-koi/Software-Engineering-Nutrition-App.git` in terminal).
2. Run `cd ./Node ; npm install` inside of your terminal to move into the node directory and install all required npm packages
3. Run `Copy-Item -Path ".env.example" -Destination ".env"` to copy and rename the "example.env" file to be ".env" <br> (skip this step if you have your own .env set up)
4. Run `npm start` inside of your terminal to start the API server (to stop it press ctrl + c).
<br> (for Dev env use `npm run dev` instead) 
5. Open a **New** terminal window and navigate back to the main directory of the program
6. Run `cd .\Flutter\flutter_web_app\; flutter run -d chrome` inside of this new terminal to run the Flutter UI inside of Chrome.

### Example of flutter run
```
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
