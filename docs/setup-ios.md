# Setup: iOS simulator + Maestro (macOS)

1. **Check the basics**
   ```bash
   xcode-select -p        # Xcode command line tools (install with: xcode-select --install)
   java -version          # Maestro needs Java 17+ (brew install --cask temurin)
   ```
2. **Boot a simulator**: `open -a Simulator`
3. **Install twodos on it** from the Flutter project: `flutter run -d "iPhone 16"`,
   or `flutter build ios --simulator` then `xcrun simctl install booted build/ios/iphonesimulator/Runner.app`.
4. **Log in once** with the dedicated test account and create a list named `Lab list`.
5. **Find the bundle ID** and put it in `chapters/01-gen-ai-in-software-testing/03-ai-assisted-ui-flows/labels.env` as `APP_ID`:
   ```bash
   xcrun simctl listapps booted | grep -i -B2 -A2 twodos
   ```
6. **Install Maestro**: `curl -fsSL "https://get.maestro.mobile.dev" | bash`, then `maestro --help`.
7. **Secrets**: `cp .env.example .env` and fill in the test account.
8. **First run**: `npm install`, then `npm run flows:capture`. Screenshots land in the Maestro output folder under `reports/`.
