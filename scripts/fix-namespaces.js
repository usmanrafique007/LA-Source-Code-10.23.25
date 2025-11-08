const fs = require("fs");
const path = require("path");

const patches = [
  {
    file: "node_modules/react-native-blob-util/android/build.gradle",
    namespace: "com.ReactNativeBlobUtil",
  },
  // You can add more libs here later if needed:
  // { file: "node_modules/react-native-sound/android/build.gradle", namespace: "com.zmxv.RNSound" },
  // { file: "node_modules/react-native-device-info/android/build.gradle", namespace: "com.learnium.RNDeviceInfo" },
];

patches.forEach(({ file, namespace }) => {
  const gradlePath = path.resolve(file);
  if (!fs.existsSync(gradlePath)) {
    console.warn(`⚠️ File not found: ${file}`);
    return;
  }

  let gradle = fs.readFileSync(gradlePath, "utf8");

  // Skip if namespace already exists
  if (gradle.includes("namespace")) {
    console.log(`✅ Namespace already set in ${file}`);
    return;
  }

  // Add namespace right after the "android {" line
  const updated = gradle.replace(
    /android\s*{/,
    `android {\n    namespace "${namespace}"`
  );

  fs.writeFileSync(gradlePath, updated);
  console.log(`✅ Patched namespace in ${file}`);
});

console.log("✨ Namespace patching complete!");
