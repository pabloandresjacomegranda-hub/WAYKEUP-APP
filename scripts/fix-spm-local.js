import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';

const capacitorVersion = JSON.parse(readFileSync('node_modules/@capacitor/core/package.json', 'utf8')).version;
const capacitorSpmDependency = `.package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "${capacitorVersion}")`;
const pluginPaths = [
  'node_modules/@capacitor/app/Package.swift',
  'node_modules/@capacitor/haptics/Package.swift',
  'node_modules/@capacitor/local-notifications/Package.swift',
];

function restorePluginPackage(packagePath) {
  if (!existsSync(packagePath)) return;

  const content = readFileSync(packagePath, 'utf8');
  const updated = content
    .replace(
      /\.package\(name: "CapacitorLocalPkg", path: "\.\.\/\.\.\/\.\.\/ios\/App\/CapacitorLocal"\),\s*\.package\(name: "CordovaLocalPkg", path: "\.\.\/\.\.\/\.\.\/ios\/App\/CordovaLocal"\)\s*/g,
      `${capacitorSpmDependency},\n        `
    )
    .replace(/package: "CapacitorLocalPkg"/g, 'package: "capacitor-swift-pm"')
    .replace(/package: "CordovaLocalPkg"/g, 'package: "capacitor-swift-pm"');

  if (updated !== content) writeFileSync(packagePath, updated);
}

function restoreIosCodeSigning() {
  const projectPath = 'ios/App/App.xcodeproj/project.pbxproj';
  if (!existsSync(projectPath)) return;

  const content = readFileSync(projectPath, 'utf8');
  const updated = content
    .replace(/CODE_SIGN_IDENTITY = "";/g, 'CODE_SIGN_IDENTITY = "Apple Development";')
    .replace(/CODE_SIGNING_ALLOWED = NO;/g, 'CODE_SIGNING_ALLOWED = YES;')
    .replace(
      /CODE_SIGN_STYLE = Automatic;\n(\s*)CURRENT_PROJECT_VERSION = 1;/g,
      'CODE_SIGN_STYLE = Automatic;\n$1CODE_SIGN_IDENTITY = "Apple Development";\n$1CODE_SIGNING_ALLOWED = YES;\n$1CURRENT_PROJECT_VERSION = 1;'
    );

  if (updated !== content) writeFileSync(projectPath, updated);
}

function restoreCapAppPackage() {
  const packagePath = 'ios/App/CapApp-SPM/Package.swift';
  if (!existsSync(packagePath)) return;

  const content = readFileSync(packagePath, 'utf8');
  const updated = content
    .replace(
      /\.package\(name: "CapacitorApp", path: "\.\.\/\.\.\/\.\.\/node_modules\/@capacitor\/app"\),/,
      '.package(name: "CapacitorApp", path: "../../../node_modules/@capacitor/app"),'
    )
    .replace(
      /\.package\(name: "CapacitorHaptics", path: "\.\.\/\.\.\/\.\.\/node_modules\/@capacitor\/haptics"\),/,
      '.package(name: "CapacitorHaptics", path: "../../../node_modules/@capacitor/haptics"),'
    )
    .replace(
      /\.package\(name: "CapacitorLocalNotifications", path: "(?:\.\.\/\.\.\/\.\.\/node_modules\/@capacitor\/local-notifications|\.\.\/LocalNotifications)"\)/,
      '.package(name: "CapacitorLocalNotifications", path: "../LocalNotifications")'
    )
    .replace(
      /\.package\(name: "CapacitorLocalPkg", path: "\.\.\/CapacitorLocal"\),\s*\.package\(name: "CordovaLocalPkg", path: "\.\.\/CordovaLocal"\),?/g,
      capacitorSpmDependency
    );

  if (updated !== content) writeFileSync(packagePath, updated);
}

restoreIosCodeSigning();
restoreCapAppPackage();
pluginPaths.forEach(restorePluginPackage);

function patchSwiftSources(directory) {
  if (!existsSync(directory)) return;

  for (const entry of readdirSync(directory)) {
    const path = `${directory}/${entry}`;
    if (statSync(path).isDirectory()) {
      patchSwiftSources(path);
      continue;
    }

    if (!path.endsWith('.swift')) continue;
    const content = readFileSync(path, 'utf8');
    const updated = content.replace(
      /convertNotificationUserInfo\s*\(\s*request\.content\.userInfo\s*\)/g,
      'JSTypes.coerceDictionaryToJSObject(request.content.userInfo)'
    );
    if (updated !== content) writeFileSync(path, updated);
  }
}

patchSwiftSources('node_modules/@capacitor/local-notifications');
patchSwiftSources('ios/App/LocalNotifications');

const appPluginPath = 'node_modules/@capacitor/app/ios/Sources/AppPlugin/AppPlugin.swift';
if (existsSync(appPluginPath)) {
  const content = readFileSync(appPluginPath, 'utf8');
  const updated = content.replace(/call\.reject\("Unable to get App Info"(?:,\s*nil){0,4}\)/g, 'call.unimplemented()');
  if (updated !== content) writeFileSync(appPluginPath, updated);
}

