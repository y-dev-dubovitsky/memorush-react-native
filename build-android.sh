#!/bin/bash

JAVA_11_HOME="/usr/lib/jvm/java-11-openjdk-amd64"

if [ ! -d "$JAVA_11_HOME" ]; then
    echo "❌ Java 11 not found at $JAVA_11_HOME"
    exit 1
fi

export JAVA_HOME="$JAVA_11_HOME"
export PATH="$JAVA_HOME/bin:$PATH"

echo "🔧 Using Java 11 for this build:"
java -version
echo ""

echo "🧹 Cleaning previous builds..."
cd android && ./gradlew clean

echo "🗑️  Clearing download cache..."
rm -rf ../node_modules/expo-modules-core/android/build/downloads

echo "🏗️ Building Android release..."
./gradlew assembleRelease -Pexpo.modules.core.disable.download=true

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📱 APK: app/build/outputs/apk/release/app-release.apk"
else
    echo ""
    echo "❌ Build failed"
    exit 1
fi