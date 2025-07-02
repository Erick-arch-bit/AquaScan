# Deployment Guide

## Overview

This guide covers the deployment process for the QR Scanner Event Checker App across different platforms (iOS, Android, and Web) using Expo's build and deployment tools.

## Prerequisites

### Development Environment
- **Node.js**: 18.x or higher
- **npm**: 8.x or higher
- **Expo CLI**: Latest version (`npm install -g @expo/cli`)
- **EAS CLI**: Latest version (`npm install -g eas-cli`)

### Accounts Required
- **Expo Account**: For build services and deployment
- **Apple Developer Account**: For iOS App Store deployment
- **Google Play Console**: For Android Play Store deployment
- **Web Hosting**: For web deployment (Netlify, Vercel, etc.)

### Platform-Specific Requirements

#### iOS Development
- **macOS**: Required for iOS builds and testing
- **Xcode**: Latest version from Mac App Store
- **iOS Simulator**: For testing
- **Apple Developer Program**: $99/year for App Store distribution

#### Android Development
- **Android Studio**: For testing and debugging
- **Android SDK**: Installed via Android Studio
- **Java Development Kit (JDK)**: Version 11 or higher

## Project Configuration

### 1. App Configuration (`app.json`)
```json
{
  "expo": {
    "name": "Event Checker App",
    "slug": "event-checker-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.eventchecker",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.eventchecker",
      "versionCode": 1
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": ["expo-router"],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### 2. EAS Build Configuration (`eas.json`)
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Environment Variables

#### Development (`.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_ENVIRONMENT=development
EXPO_PUBLIC_DEBUG=true
```

#### Staging (`.env.staging`)
```env
EXPO_PUBLIC_API_URL=https://staging-api.xolotlcl.com/api
EXPO_PUBLIC_ENVIRONMENT=staging
EXPO_PUBLIC_DEBUG=false
```

#### Production (`.env.production`)
```env
EXPO_PUBLIC_API_URL=https://api.xolotlcl.com/api
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_DEBUG=false
```

## Build Process

### 1. Local Development Build
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on specific platforms
npx expo start --ios
npx expo start --android
npx expo start --web
```

### 2. Development Build (with EAS)
```bash
# Login to Expo
npx expo login

# Configure EAS
eas build:configure

# Build for development
eas build --platform ios --profile development
eas build --platform android --profile development
```

### 3. Preview Build
```bash
# Build preview versions for testing
eas build --platform ios --profile preview
eas build --platform android --profile preview

# Install on device
eas build:run --platform ios
eas build:run --platform android
```

### 4. Production Build
```bash
# Build for production
eas build --platform ios --profile production
eas build --platform android --profile production
eas build --platform all --profile production
```

## Platform-Specific Deployment

### iOS Deployment

#### 1. App Store Connect Setup
1. **Create App Record**:
   - Log into [App Store Connect](https://appstoreconnect.apple.com)
   - Create new app with bundle identifier: `com.yourcompany.eventchecker`
   - Fill in app information, categories, and pricing

2. **App Information**:
   ```
   Name: Event Checker App
   Subtitle: QR Scanner for Event Access Control
   Category: Business
   Content Rating: 4+
   ```

3. **App Store Screenshots**:
   - iPhone 6.7": 1290 x 2796 pixels
   - iPhone 6.5": 1242 x 2688 pixels
   - iPhone 5.5": 1242 x 2208 pixels
   - iPad Pro 12.9": 2048 x 2732 pixels

#### 2. Build and Submit
```bash
# Build for App Store
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

#### 3. TestFlight Distribution
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios --profile preview
```

### Android Deployment

#### 1. Google Play Console Setup
1. **Create App**:
   - Go to [Google Play Console](https://play.google.com/console)
   - Create new app with package name: `com.yourcompany.eventchecker`
   - Complete app details and content rating

2. **App Information**:
   ```
   Title: Event Checker App
   Short Description: QR Scanner for Event Access Control
   Full Description: Professional event management app for wristband verification and venue capacity monitoring.
   Category: Business
   Content Rating: Everyone
   ```

3. **Store Listing Assets**:
   - App Icon: 512 x 512 pixels
   - Feature Graphic: 1024 x 500 pixels
   - Screenshots: Various sizes for phones and tablets

#### 2. Build and Submit
```bash
# Build for Play Store
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

#### 3. Internal Testing
```bash
# Build for internal testing
eas build --platform android --profile preview

# Distribute via internal testing track
eas submit --platform android --track internal
```

### Web Deployment

#### 1. Build for Web
```bash
# Build static web assets
npx expo export:web

# Output will be in 'dist' directory
```

#### 2. Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --dir=dist --prod
```

#### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

#### 4. Custom Server Deployment
```bash
# Build for custom server
npx expo export:web

# Copy dist folder to your web server
scp -r dist/* user@yourserver.com:/var/www/html/
```

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/build.yml`)
```yaml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Setup Expo
      uses: expo/expo-github-action@v8
      with:
        expo-version: latest
        token: ${{ secrets.EXPO_TOKEN }}
    
    - name: Build for preview
      if: github.ref != 'refs/heads/main'
      run: eas build --platform all --profile preview --non-interactive
    
    - name: Build for production
      if: github.ref == 'refs/heads/main'
      run: eas build --platform all --profile production --non-interactive
    
    - name: Deploy web
      if: github.ref == 'refs/heads/main'
      run: |
        npx expo export:web
        netlify deploy --dir=dist --prod --auth=${{ secrets.NETLIFY_AUTH_TOKEN }} --site=${{ secrets.NETLIFY_SITE_ID }}
```

### Environment Secrets
Configure these secrets in your CI/CD platform:
```
EXPO_TOKEN=your_expo_access_token
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_netlify_site_id
APPLE_ID=your_apple_id
APPLE_APP_SPECIFIC_PASSWORD=your_app_password
GOOGLE_SERVICE_ACCOUNT_KEY=your_service_account_json
```

## Release Management

### Version Management
```bash
# Update version in app.json
{
  "expo": {
    "version": "1.1.0",
    "ios": {
      "buildNumber": "2"
    },
    "android": {
      "versionCode": 2
    }
  }
}

# Create git tag
git tag v1.1.0
git push origin v1.1.0
```

### Release Notes Template
```markdown
## Version 1.1.0

### New Features
- Enhanced QR scanner with improved accuracy
- Real-time dashboard updates
- Offline mode support

### Improvements
- Faster app startup time
- Better error handling
- Updated UI components

### Bug Fixes
- Fixed camera permission issues
- Resolved login timeout problems
- Fixed data synchronization bugs

### Technical Changes
- Updated to Expo SDK 52
- Improved API error handling
- Enhanced security measures
```

## Monitoring and Analytics

### 1. Expo Analytics
```typescript
// Track app usage
import { Analytics } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXXXXX-X');

// Track screen views
analytics.screen('Dashboard');
analytics.screen('Scanner');

// Track events
analytics.event('QR_Scan', {
  category: 'User Action',
  label: 'Successful Scan'
});
```

### 2. Crash Reporting
```typescript
// Setup Sentry for crash reporting
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
});

// Capture errors
try {
  // App logic
} catch (error) {
  Sentry.captureException(error);
}
```

### 3. Performance Monitoring
```typescript
// Monitor app performance
import { Performance } from 'expo-performance';

const startTime = Performance.now();
// Perform operation
const endTime = Performance.now();
const duration = endTime - startTime;

if (duration > 1000) {
  console.warn(`Slow operation: ${duration}ms`);
}
```

## Security Considerations

### 1. Code Obfuscation
```bash
# Enable code obfuscation for production
# In eas.json
{
  "build": {
    "production": {
      "env": {
        "EXPO_OPTIMIZE": "true"
      }
    }
  }
}
```

### 2. API Security
```typescript
// Secure API configuration
const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Version': '1.0',
  },
};

// Certificate pinning for production
if (process.env.EXPO_PUBLIC_ENVIRONMENT === 'production') {
  API_CONFIG.certificatePinning = {
    hostname: 'api.xolotlcl.com',
    publicKeyHash: 'YOUR_PUBLIC_KEY_HASH'
  };
}
```

### 3. Environment Variables Security
```bash
# Never commit sensitive data
# Use Expo's secure environment variables
npx expo env:set EXPO_PUBLIC_API_URL https://api.xolotlcl.com/api
npx expo env:set --environment production API_SECRET your_secret_key
```

## Troubleshooting

### Common Build Issues

#### 1. iOS Build Failures
```bash
# Clear Expo cache
npx expo r -c

# Update iOS dependencies
cd ios && pod install && cd ..

# Check certificate validity
eas credentials
```

#### 2. Android Build Failures
```bash
# Clean Android build
cd android && ./gradlew clean && cd ..

# Update Android dependencies
npx expo install --fix

# Check keystore configuration
eas credentials
```

#### 3. Web Build Issues
```bash
# Clear web cache
rm -rf .expo/web

# Rebuild web assets
npx expo export:web --clear
```

### Performance Issues
```bash
# Analyze bundle size
npx expo export:web --analyze

# Check for memory leaks
npx expo start --dev-client --clear

# Profile app performance
npx expo start --profiling
```

### Deployment Failures
```bash
# Check EAS build status
eas build:list

# View build logs
eas build:view [BUILD_ID]

# Retry failed builds
eas build --platform ios --profile production --clear-cache
```

## Maintenance

### Regular Updates
- **Monthly**: Update Expo SDK and dependencies
- **Quarterly**: Review and update security configurations
- **Bi-annually**: Audit third-party dependencies
- **Annually**: Review and update certificates and keys

### Monitoring Checklist
- [ ] App Store/Play Store reviews and ratings
- [ ] Crash reports and error logs
- [ ] Performance metrics and load times
- [ ] User analytics and engagement
- [ ] Security vulnerability scans
- [ ] API endpoint health checks

This deployment guide provides comprehensive instructions for building, deploying, and maintaining the QR Scanner Event Checker App across all supported platforms.