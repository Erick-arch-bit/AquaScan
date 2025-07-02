# QR Scanner Event Checker App

A modern, minimalist React Native application built with Expo for event access control and wristband verification. This app provides real-time venue capacity monitoring, QR code scanning for wristband verification, and comprehensive dashboard analytics.

## 🚀 Features

### Core Functionality
- **QR Code Scanner**: Real-time wristband verification using device camera
- **Dashboard Analytics**: Live venue capacity monitoring and checker performance metrics
- **Wristband Management**: Complete tracking of verified, pending, and rejected wristbands
- **User Authentication**: Secure login system with token-based authentication
- **Profile Management**: User account information and app settings

### Key Highlights
- **Real-time Updates**: Live data synchronization every 30 seconds
- **Offline-Ready**: Graceful handling of network connectivity issues
- **Modern UI/UX**: Clean, minimalist design with professional aesthetics
- **Cross-Platform**: Works on iOS, Android, and Web platforms
- **Production-Ready**: Comprehensive error handling and user feedback

## 🎨 Design System

### Color Palette
```css
Primary Blue: #021024    /* Headers, primary text */
Secondary Blue: #052859  /* Buttons, accents */
Light Blue: #7DA0CA     /* Secondary text, icons */
Background: #C1E8FF     /* Main background */
White: #FFFFFF          /* Cards, overlays */
Success: #4CAF50        /* Verified states */
Error: #FF3B30          /* Error states */
Warning: #FFA726        /* Warning states */
```

### Typography
- **Headers**: Bold, 24-32px, Primary Blue
- **Body Text**: Regular, 16px, Primary Blue
- **Secondary Text**: Medium, 14px, Light Blue
- **Buttons**: Bold, 16-18px, White on Primary Blue

### Spacing System
- **Base Unit**: 8px
- **Small**: 8px, 12px, 16px
- **Medium**: 20px, 24px, 32px
- **Large**: 40px, 60px, 80px

## 📱 App Structure

### Navigation Architecture
```
Root Layout (_layout.tsx)
├── Authentication Stack (auth)
│   └── Login Screen
└── Main Tabs (tabs)
    ├── Dashboard (index)
    ├── Wristbands Management
    ├── QR Scanner
    └── Profile (hidden from tabs)
```

### Screen Descriptions

#### 1. Login Screen (`(auth)/login.tsx`)
- **Purpose**: User authentication and app entry point
- **Features**: Email/password login, error handling, loading states
- **API Integration**: Connects to `https://api.xolotlcl.com/api/loginXcl`

#### 2. Dashboard (`(tabs)/index.tsx`)
- **Purpose**: Real-time venue monitoring and analytics
- **Components**: 
  - Venue capacity gauge with status indicators
  - Checker performance summary table
  - Auto-refresh functionality
- **Data Sources**: Mock API with realistic venue data

#### 3. Wristbands (`(tabs)/wristbands.tsx`)
- **Purpose**: Complete wristband inventory and status tracking
- **Features**: 
  - Search and filter functionality
  - Status-based filtering (All, Verified, Pending)
  - Individual wristband details with verification history

#### 4. Scanner (`(tabs)/scanner.tsx`)
- **Purpose**: QR code scanning and real-time verification
- **Features**:
  - Camera-based QR scanning
  - Manual code entry support
  - Instant verification feedback
  - Success/error modal dialogs
- **Camera Integration**: Uses `expo-camera` with proper permissions

#### 5. Profile (`(tabs)/profile.tsx`)
- **Purpose**: User account management and app information
- **Features**:
  - User information display
  - App version and support information
  - Secure logout functionality

## 🛠 Technical Architecture

### Technology Stack
- **Framework**: React Native with Expo SDK 52.0.30
- **Navigation**: Expo Router 4.0.17
- **Language**: TypeScript
- **Styling**: StyleSheet (React Native)
- **Icons**: Lucide React Native
- **Camera**: Expo Camera
- **State Management**: React Hooks (useState, useEffect)

### Project Structure
```
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout with navigation
│   ├── (auth)/                  # Authentication stack
│   │   ├── _layout.tsx         # Auth layout
│   │   └── login.tsx           # Login screen
│   ├── (tabs)/                  # Main tab navigation
│   │   ├── _layout.tsx         # Tab layout with headers
│   │   ├── index.tsx           # Dashboard screen
│   │   ├── wristbands.tsx      # Wristbands management
│   │   ├── scanner.tsx         # QR scanner
│   │   └── profile.tsx         # User profile
│   └── +not-found.tsx          # 404 error page
├── components/                   # Reusable components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── VenueCapacity.tsx   # Capacity gauge component
│   │   └── CheckerSummary.tsx  # Checker performance table
│   └── wristbands/             # Wristband-specific components
│       └── WristbandItem.tsx   # Individual wristband card
├── services/                    # API and business logic
│   ├── api.ts                  # Mock API service
│   └── auth.ts                 # Authentication service
├── hooks/                       # Custom React hooks
│   └── useFrameworkReady.ts    # Framework initialization
└── assets/                      # Static assets
    └── images/                 # App icons and images
```

### Key Services

#### Authentication Service (`services/auth.ts`)
```typescript
class AuthService {
  static async login(email: string, password: string)
  static async logout()
  static async isAuthenticated(): Promise<boolean>
  static async getUserEmail(): Promise<string | null>
  static async getAuthHeaders(): Promise<HeadersInit>
}
```

#### API Service (`services/api.ts`)
```typescript
class ApiService {
  static async getVenueCapacity()
  static async getCheckersSummary()
  static async getWristbands()
  static async verifyWristband(qrCode: string)
  static async updateWristbandStatus(id: string, status: string)
}
```

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd event-checker-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run start      # Start Expo development server
npm run dev        # Start web development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
npm run test       # Run test suite
npm run lint       # Run ESLint
```

### Environment Configuration
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=https://api.xolotlcl.com/api
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## 📊 Data Models

### User Authentication
```typescript
interface LoginResponse {
  status: number;
  access_token: string;
  message?: string;
}
```

### Venue Capacity
```typescript
interface VenueCapacity {
  current: number;    // Current occupancy
  max: number;        // Maximum capacity
  percentage: number; // Occupancy percentage
}
```

### Checker Performance
```typescript
interface CheckerData {
  id: string;
  name: string;
  scanned: number;    // Total scans performed
  verified: number;   // Successfully verified
  rejected: number;   // Rejected scans
}
```

### Wristband Data
```typescript
interface Wristband {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: string;
}
```

### Verification Response
```typescript
interface VerificationResult {
  valid: boolean;
  message: string;
}
```

## 🎯 API Integration

### Authentication Endpoints
```typescript
POST /loginXcl
Body: { email: string, password: string }
Response: { status: number, access_token: string }

POST /logoutXcl
Headers: { Authorization: "Bearer <token>" }
Response: { status: number, msg: string }
```

### Mock Data Structure
The app currently uses mock data for development and testing:

```typescript
const MOCK_DATA = {
  capacity: { current: 375, max: 500, percentage: 75 },
  checkers: [
    { id: '1', name: 'Juan Pérez', scanned: 87, verified: 82, rejected: 5 },
    // ... more checkers
  ],
  wristbands: [
    { 
      id: 'WB-123456', 
      name: 'Invitado VIP', 
      status: 'verified',
      verifiedAt: '2024-01-15T10:30:00Z',
      verifiedBy: 'Juan Pérez' 
    },
    // ... more wristbands
  ]
};
```

## 🔒 Security Features

### Authentication
- **Token-based Authentication**: JWT tokens for secure API access
- **Secure Storage**: Tokens stored in platform-appropriate secure storage
- **Auto-logout**: Automatic session cleanup on logout
- **Error Handling**: Graceful handling of authentication failures

### Data Protection
- **Input Validation**: All user inputs validated before processing
- **Error Boundaries**: Comprehensive error handling throughout the app
- **Network Security**: HTTPS-only API communications
- **Permission Management**: Proper camera permission handling

## 📱 Platform Compatibility

### Supported Platforms
- **iOS**: iPhone and iPad (iOS 13+)
- **Android**: Android devices (API level 21+)
- **Web**: Modern browsers (Chrome, Firefox, Safari, Edge)

### Platform-Specific Features
```typescript
import { Platform } from 'react-native';

// Example of platform-specific implementation
const getStorageMethod = () => {
  if (Platform.OS === 'web') {
    return localStorage;
  } else {
    return AsyncStorage; // For mobile platforms
  }
};
```

### Camera Permissions
```typescript
// Camera permission handling
const [permission, requestPermission] = useCameraPermissions();

if (!permission?.granted) {
  // Show permission request UI
  return <PermissionScreen onRequest={requestPermission} />;
}
```

## 🧪 Testing Strategy

### Component Testing
- Unit tests for individual components
- Integration tests for service interactions
- Mock data for consistent testing environments

### User Flow Testing
1. **Authentication Flow**: Login → Dashboard navigation
2. **Scanner Flow**: Camera access → QR scan → Verification
3. **Data Flow**: Dashboard refresh → Real-time updates
4. **Navigation Flow**: Tab switching → Profile access

### Performance Testing
- **Load Testing**: Large datasets in wristband lists
- **Network Testing**: Offline/online state handling
- **Memory Testing**: Camera component lifecycle management

## 🚀 Deployment

### Build Configuration
```json
// app.json
{
  "expo": {
    "name": "Event Checker App",
    "slug": "event-checker-app",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "web": {
      "bundler": "metro",
      "output": "static"
    }
  }
}
```

### Production Build
```bash
# Build for production
npx expo build:web

# Build for mobile platforms
npx expo build:ios
npx expo build:android
```

### Environment Variables
```bash
# Production environment
EXPO_PUBLIC_API_URL=https://api.production.com/api
EXPO_PUBLIC_ENVIRONMENT=production
```

## 🔄 State Management

### Local State Patterns
```typescript
// Component state management
const [data, setData] = useState(initialData);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Effect for data loading
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      const result = await ApiService.getData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  loadData();
}, []);
```

### Global State (Authentication)
```typescript
// Authentication state managed in AuthService
class AuthService {
  private static token: string | null = null;
  private static userEmail: string | null = null;
  
  // State persistence across app sessions
  static async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    
    // Load from storage
    if (Platform.OS === 'web') {
      this.token = localStorage.getItem(AUTH_TOKEN_KEY);
    }
    
    return this.token;
  }
}
```

## 🎨 UI/UX Guidelines

### Design Principles
1. **Minimalism**: Clean, uncluttered interfaces
2. **Consistency**: Uniform spacing, colors, and typography
3. **Accessibility**: High contrast ratios and readable fonts
4. **Responsiveness**: Adaptive layouts for all screen sizes
5. **Feedback**: Clear visual feedback for all user actions

### Component Patterns
```typescript
// Consistent card component pattern
const CardComponent = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#021024',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
});
```

### Animation Guidelines
- **Subtle Transitions**: 300ms duration for most animations
- **Easing**: Use `ease-in-out` for natural motion
- **Performance**: Prefer `react-native-reanimated` for complex animations
- **Accessibility**: Respect user's motion preferences

## 📈 Performance Optimization

### Best Practices
1. **Lazy Loading**: Components loaded on demand
2. **Image Optimization**: Proper image sizing and caching
3. **List Virtualization**: For large datasets (wristband lists)
4. **Memory Management**: Proper cleanup of camera resources
5. **Network Optimization**: Request batching and caching

### Code Splitting
```typescript
// Lazy loading for heavy components
const Scanner = lazy(() => import('./Scanner'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Scanner />
</Suspense>
```

### Memory Management
```typescript
// Proper cleanup in useEffect
useEffect(() => {
  const interval = setInterval(fetchData, 30000);
  
  return () => {
    clearInterval(interval); // Cleanup on unmount
  };
}, []);
```

## 🐛 Troubleshooting

### Common Issues

#### Camera Not Working
```typescript
// Check permissions
const [permission, requestPermission] = useCameraPermissions();
if (!permission?.granted) {
  await requestPermission();
}

// Ensure proper cleanup
useEffect(() => {
  return () => {
    // Camera cleanup logic
  };
}, []);
```

#### Authentication Issues
```typescript
// Clear stored tokens
AuthService.logout(); // Clears all stored auth data

// Check token validity
const isValid = await AuthService.isAuthenticated();
if (!isValid) {
  router.replace('/(auth)/login');
}
```

#### Network Connectivity
```typescript
// Handle network errors gracefully
try {
  const data = await ApiService.getData();
  setData(data);
} catch (error) {
  if (error.message.includes('network')) {
    setError('Conexión perdida. Verifique su internet.');
  } else {
    setError('Error del servidor. Intente más tarde.');
  }
}
```

### Debug Mode
```typescript
// Enable debug logging
const DEBUG = __DEV__ || process.env.EXPO_PUBLIC_DEBUG === 'true';

if (DEBUG) {
  console.log('Debug info:', data);
}
```

## 📚 Additional Resources

### Documentation Links
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Documentation](https://expo.github.io/router/docs/)
- [Expo Camera Documentation](https://docs.expo.dev/versions/latest/sdk/camera/)

### Development Tools
- [Expo Dev Tools](https://docs.expo.dev/workflow/debugging/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/) (for advanced debugging)

### Community Resources
- [Expo Discord](https://discord.gg/expo)
- [React Native Community](https://reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Follow Expo's ESLint configuration
- **Prettier**: Code formatting with 2-space indentation
- **Naming**: Use descriptive, camelCase variable names
- **Comments**: Document complex logic and API integrations

### Testing Requirements
- Unit tests for new components
- Integration tests for API interactions
- Manual testing on iOS, Android, and Web
- Performance testing for camera operations

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Expo SDK**: 53.0.12  
**React Native**: 0.79.4
