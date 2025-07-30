#!/bin/bash

# Environment Variables Validation Script for PassFit
# This script validates that all required environment variables are set before building

echo "🔍 Validating environment variables for PassFit..."

# Define required environment variables
required_vars=(
  "EXPO_PUBLIC_FIREBASE_API_KEY"
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID"
  "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"
  "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  "EXPO_PUBLIC_FIREBASE_APP_ID"
  "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"
  "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID"
  "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID"
  "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY"
)

# Track validation status
missing_vars=()
validation_passed=true

# Check each required variable
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
    validation_passed=false
  else
    echo "✅ $var is set"
  fi
done

# Report results
if [ "$validation_passed" = true ]; then
  echo ""
  echo "🎉 All required environment variables are set!"
  echo "✅ Environment validation passed"
  exit 0
else
  echo ""
  echo "❌ Environment validation failed!"
  echo "🚨 Missing required environment variables:"
  for var in "${missing_vars[@]}"; do
    echo "   - $var"
  done
  echo ""
  echo "📋 Setup instructions:"
  echo "1. Copy .env.example to .env: cp .env.example .env"
  echo "2. Fill in the actual values in .env file"
  echo "3. See docs/GOOGLE_AUTH_SETUP.md for detailed setup guide"
  echo ""
  exit 1
fi
