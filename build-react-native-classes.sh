#!/bin/bash
ANDROID_HOME=${ANDROID_HOME:-$HOME/Library/Android/sdk}
ANDROID_JAR=$ANDROID_HOME/platforms/android-35/android.jar
[ ! -f "$ANDROID_JAR" ] && ANDROID_JAR=$ANDROID_HOME/platforms/android-31/android.jar

TEMP_DIR=$(mktemp -d)
REACT_SRC=node_modules/react-native/ReactAndroid/src/main/java
OUTPUT_DIR=node_modules/react-native/android/com/facebook/react/react-android/0.75.5
CLASSES_JAR=$OUTPUT_DIR/classes.jar
AAR_FILE=$OUTPUT_DIR/react-android-0.75.5.aar

# Compile essential bridge classes
javac -source 1.8 -target 1.8 -cp "$ANDROID_JAR" -d "$TEMP_DIR" \
  $REACT_SRC/com/facebook/react/bridge/*.java \
  $REACT_SRC/com/facebook/react/*.java \
  2>&1 | head -20

# Create JAR
jar cf "$CLASSES_JAR" -C "$TEMP_DIR" .

# Update AAR
cd "$OUTPUT_DIR" && zip -u "$AAR_FILE" classes.jar && cd - > /dev/null

rm -rf "$TEMP_DIR"
echo "Created classes.jar with React Native bridge classes"
