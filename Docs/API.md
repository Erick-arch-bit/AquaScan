# API Documentation

## Overview

This document describes the API endpoints and data structures used by the QR Scanner Event Checker App. The application currently uses a combination of real authentication endpoints and mock data for development purposes.

## Base Configuration

### Production API
- **Base URL**: `https://api.xolotlcl.com/api`
- **Authentication**: Bearer Token
- **Content-Type**: `application/json`

### Development Mode
The app uses mock data with simulated network delays for development and testing purposes.

## Authentication Endpoints

### Login
Authenticate user and receive access token.

**Endpoint**: `POST /loginXcl`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Response Success** (200):
```json
{
  "status": 1,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

**Response Error** (401):
```json
{
  "status": 0,
  "message": "Invalid credentials"
}
```

**Implementation**:
```typescript
const response = await fetch(`${API_URL}/loginXcl`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();
```

### Logout
Invalidate current session token.

**Endpoint**: `POST /logoutXcl`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Response Success** (200):
```json
{
  "status": 1,
  "msg": "Logout successful"
}
```

**Response Error** (401):
```json
{
  "status": 0,
  "msg": "Invalid token"
}
```

**Implementation**:
```typescript
const response = await fetch(`${API_URL}/logoutXcl`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

## Mock Data Endpoints

The following endpoints are currently implemented using mock data with realistic response times and data structures.

### Get Venue Capacity
Retrieve current venue occupancy information.

**Mock Endpoint**: `ApiService.getVenueCapacity()`

**Response**:
```json
{
  "current": 375,
  "max": 500,
  "percentage": 75
}
```

**Data Model**:
```typescript
interface VenueCapacity {
  current: number;    // Current number of people in venue
  max: number;        // Maximum venue capacity
  percentage: number; // Occupancy percentage (0-100)
}
```

**Usage**:
```typescript
const capacity = await ApiService.getVenueCapacity();
console.log(`Venue is ${capacity.percentage}% full`);
```

### Get Checkers Summary
Retrieve performance summary for all checkers.

**Mock Endpoint**: `ApiService.getCheckersSummary()`

**Response**:
```json
[
  {
    "id": "1",
    "name": "Juan Pérez",
    "scanned": 87,
    "verified": 82,
    "rejected": 5
  },
  {
    "id": "2",
    "name": "Ana García",
    "scanned": 65,
    "verified": 63,
    "rejected": 2
  }
]
```

**Data Model**:
```typescript
interface CheckerData {
  id: string;
  name: string;
  scanned: number;    // Total QR codes scanned
  verified: number;   // Successfully verified wristbands
  rejected: number;   // Rejected/invalid scans
}
```

**Usage**:
```typescript
const checkers = await ApiService.getCheckersSummary();
const totalScanned = checkers.reduce((sum, checker) => sum + checker.scanned, 0);
```

### Get Wristbands
Retrieve list of all wristbands with their current status.

**Mock Endpoint**: `ApiService.getWristbands()`

**Response**:
```json
[
  {
    "id": "WB-123456",
    "name": "Invitado VIP",
    "status": "verified",
    "verifiedAt": "2024-01-15T10:30:00.000Z",
    "verifiedBy": "Juan Pérez"
  },
  {
    "id": "WB-234567",
    "name": "Entrada General",
    "status": "pending"
  },
  {
    "id": "WB-345678",
    "name": "Staff",
    "status": "rejected"
  }
]
```

**Data Model**:
```typescript
interface Wristband {
  id: string;                                    // Unique wristband identifier
  name: string;                                  // Wristband type/category
  status: 'verified' | 'pending' | 'rejected';  // Current status
  verifiedAt?: string;                           // ISO timestamp of verification
  verifiedBy?: string;                           // Name of verifying checker
}
```

**Status Values**:
- `verified`: Wristband has been successfully scanned and verified
- `pending`: Wristband has not been scanned yet
- `rejected`: Wristband was scanned but verification failed

**Usage**:
```typescript
const wristbands = await ApiService.getWristbands();
const verifiedCount = wristbands.filter(w => w.status === 'verified').length;
```

### Verify Wristband
Verify a wristband using its QR code.

**Mock Endpoint**: `ApiService.verifyWristband(qrCode: string)`

**Parameters**:
- `qrCode` (string): The QR code data scanned from the wristband

**Response Success**:
```json
{
  "valid": true,
  "message": "Brazalete verificado correctamente"
}
```

**Response Error**:
```json
{
  "valid": false,
  "message": "Brazalete no válido o ya escaneado"
}
```

**Data Model**:
```typescript
interface VerificationResult {
  valid: boolean;
  message: string;
}
```

**Validation Logic**:
```typescript
// Mock validation rules
const isValid = qrCode && !qrCode.includes('invalid');

// Real implementation would check:
// - QR code format
// - Database lookup
// - Duplicate scan prevention
// - Event validity
// - Time restrictions
```

**Usage**:
```typescript
const result = await ApiService.verifyWristband('WB-123456');
if (result.valid) {
  showSuccessMessage(result.message);
} else {
  showErrorMessage(result.message);
}
```

### Update Wristband Status
Update the status of a specific wristband.

**Mock Endpoint**: `ApiService.updateWristbandStatus(wristbandId: string, status: string)`

**Parameters**:
- `wristbandId` (string): Unique identifier of the wristband
- `status` (string): New status ('verified', 'pending', 'rejected')

**Response Success**:
```json
{
  "success": true
}
```

**Response Error**:
```json
{
  "success": false,
  "error": "Wristband not found"
}
```

**Usage**:
```typescript
const result = await ApiService.updateWristbandStatus('WB-123456', 'verified');
if (result.success) {
  refreshWristbandList();
}
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid parameters)
- `401`: Unauthorized (invalid or expired token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "The provided credentials are invalid",
    "details": "Email or password is incorrect"
  }
}
```

### Client-Side Error Handling
```typescript
const handleApiError = (error: Error): string => {
  if (error.message.includes('network')) {
    return 'Error de conexión. Verifique su internet.';
  } else if (error.message.includes('401')) {
    return 'Sesión expirada. Inicie sesión nuevamente.';
  } else if (error.message.includes('403')) {
    return 'No tiene permisos para realizar esta acción.';
  } else {
    return 'Error del servidor. Intente más tarde.';
  }
};
```

## Authentication Flow

### Token Management
```typescript
class AuthService {
  private static token: string | null = null;
  
  // Store token after successful login
  static async storeToken(token: string): Promise<void> {
    this.token = token;
    if (Platform.OS === 'web') {
      localStorage.setItem('auth_token', token);
    } else {
      await SecureStore.setItemAsync('auth_token', token);
    }
  }
  
  // Get token for API requests
  static async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    
    if (Platform.OS === 'web') {
      this.token = localStorage.getItem('auth_token');
    } else {
      this.token = await SecureStore.getItemAsync('auth_token');
    }
    
    return this.token;
  }
  
  // Clear token on logout
  static async clearToken(): Promise<void> {
    this.token = null;
    if (Platform.OS === 'web') {
      localStorage.removeItem('auth_token');
    } else {
      await SecureStore.deleteItemAsync('auth_token');
    }
  }
}
```

### Authenticated Requests
```typescript
static async authenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await AuthService.getToken();
  
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
}
```

## Rate Limiting

### Current Limits
- **Login attempts**: 5 per minute per IP
- **API requests**: 100 per minute per authenticated user
- **QR verification**: 30 per minute per user

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Handling Rate Limits
```typescript
const handleRateLimit = (response: Response) => {
  if (response.status === 429) {
    const resetTime = response.headers.get('X-RateLimit-Reset');
    const waitTime = resetTime ? parseInt(resetTime) - Date.now() / 1000 : 60;
    
    throw new Error(`Rate limit exceeded. Try again in ${waitTime} seconds.`);
  }
};
```

## Data Validation

### Input Validation
```typescript
// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// QR code validation
const validateQRCode = (code: string): boolean => {
  // Check format: WB-XXXXXX
  const qrRegex = /^WB-[A-Z0-9]{6}$/;
  return qrRegex.test(code);
};

// Password validation
const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};
```

### Request Sanitization
```typescript
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000);   // Limit length
};
```

## Mock Data Configuration

### Development Setup
```typescript
const MOCK_DATA = {
  capacity: {
    current: 375,
    max: 500,
    percentage: 75
  },
  checkers: [
    { id: '1', name: 'Juan Pérez', scanned: 87, verified: 82, rejected: 5 },
    { id: '2', name: 'Ana García', scanned: 65, verified: 63, rejected: 2 },
    { id: '3', name: 'Carlos López', scanned: 92, verified: 90, rejected: 2 },
    { id: '4', name: 'María Rodríguez', scanned: 105, verified: 99, rejected: 6 },
    { id: '5', name: 'Roberto Hernández', scanned: 38, verified: 36, rejected: 2 }
  ],
  wristbands: [
    { 
      id: 'WB-123456', 
      name: 'Invitado VIP', 
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Juan Pérez' 
    },
    // ... more wristbands
  ]
};
```

### Network Simulation
```typescript
private static async mockRequest<T>(data: T): Promise<T> {
  // Simulate network delay (300ms - 800ms)
  const delay = Math.random() * 500 + 300;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simulate occasional network errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Network error');
  }
  
  return data;
}
```

## Real API Integration

### Future Implementation
When integrating with real API endpoints, replace mock methods with actual HTTP requests:

```typescript
// Replace mock implementation
static async getVenueCapacity() {
  const response = await this.authenticatedRequest('/venue/capacity');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

static async verifyWristband(qrCode: string) {
  const response = await this.authenticatedRequest('/wristbands/verify', {
    method: 'POST',
    body: JSON.stringify({ qrCode })
  });
  
  if (!response.ok) {
    throw new Error(`Verification failed: ${response.statusText}`);
  }
  
  return response.json();
}
```

### Environment Configuration
```typescript
const API_CONFIG = {
  development: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 5000,
    retries: 3
  },
  staging: {
    baseUrl: 'https://staging-api.example.com/api',
    timeout: 10000,
    retries: 2
  },
  production: {
    baseUrl: 'https://api.xolotlcl.com/api',
    timeout: 15000,
    retries: 1
  }
};
```

This API documentation provides a complete reference for all endpoints, data structures, and integration patterns used in the QR Scanner Event Checker App.