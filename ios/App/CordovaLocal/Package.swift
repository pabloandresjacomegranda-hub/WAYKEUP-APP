// swift-tools-version: 5.9
import PackageDescription

// Local SPM package that references the official Cordova binary xcframework.
// Mirrors the structure of github.com/ionic-team/capacitor-swift-pm but as a
// local package so Xcode resolves it without a remote package dependency.
// SPM downloads the xcframework zip on first build (same as the official repo).
let package = Package(
    name: "CordovaLocalPkg",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "Cordova",
            targets: ["CordovaBin"]),
    ],
    dependencies: [],
    targets: [
        .binaryTarget(
            name: "CordovaBin",
            url: "https://github.com/ionic-team/capacitor-swift-pm/releases/download/8.5.3/Cordova.xcframework.zip",
            checksum: "bdcd8eab2d62a077efd76c3c8b9629e65ae7043c1462289a1e55de9be19bbf1f"
        )
    ]
)
