// swift-tools-version: 5.9
import PackageDescription

// Local SPM package that references the official Capacitor binary xcframework.
// Mirrors the structure of github.com/ionic-team/capacitor-swift-pm but as a
// local package so Xcode resolves it without a remote package dependency.
// SPM downloads the xcframework zip on first build (same as the official repo).
let package = Package(
    name: "CapacitorLocalPkg",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "Capacitor",
            targets: ["CapacitorBin"]),
    ],
    dependencies: [
        .package(name: "CordovaLocalPkg", path: "../CordovaLocal"),
    ],
    targets: [
        .binaryTarget(
            name: "CapacitorBin",
            url: "https://github.com/ionic-team/capacitor-swift-pm/releases/download/8.5.3/Capacitor.xcframework.zip",
            checksum: "9316f568444411d362dcb4d1946e7572d4aef5d690c122ff6f1cb8a44a920c9f"
        )
    ]
)
