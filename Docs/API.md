# Documentación de API

## Visión General

Este documento describe los endpoints de API y estructuras de datos utilizadas por la Aplicación QR Scanner Event Checker. La aplicación actualmente utiliza una combinación de endpoints de autenticación reales y datos simulados para propósitos de desarrollo.

## Configuración Base

### API de Producción
- **URL Base**: `https://api.xolotlcl.com/api`
- **Autenticación**: Bearer Token
- **Content-Type**: `application/json`

### Modo de Desarrollo
La aplicación utiliza datos simulados con retrasos de red simulados para desarrollo y pruebas.

## Endpoints de Autenticación

### Login
Autenticar usuario y recibir token de acceso.

**Endpoint**: `POST /loginXcl`

**Cuerpo de Solicitud**:
```json
{
  "email": "user@example.com",
  "password": "userpassword"
}
```

**Respuesta Exitosa** (200):
```json
{
  "status": 1,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login exitoso"
}
```

**Respuesta de Error** (401):
```json
{
  "status": 0,
  "message": "Credenciales inválidas"
}
```

**Implementación**:
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
Invalidar token de sesión actual.

**Endpoint**: `POST /logoutXcl`

**Encabezados**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Respuesta Exitosa** (200):
```json
{
  "status": 1,
  "msg": "Logout exitoso"
}
```

**Respuesta de Error** (401):
```json
{
  "status": 0,
  "msg": "Token inválido"
}
```

**Implementación**:
```typescript
const response = await fetch(`${API_URL}/logoutXcl`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
```

## Endpoints de Datos Simulados

Los siguientes endpoints están actualmente implementados usando datos simulados con tiempos de respuesta realistas y estructuras de datos.

### Obtener Capacidad del Venue
Recuperar información actual de ocupación del venue.

**Endpoint Simulado**: `ApiService.getVenueCapacity()`

**Respuesta**:
```json
{
  "current": 375,
  "max": 500,
  "percentage": 75
}
```

**Modelo de Datos**:
```typescript
interface VenueCapacity {
  current: number;    // Número actual de personas en el venue
  max: number;        // Capacidad máxima del venue
  percentage: number; // Porcentaje de ocupación (0-100)
}
```

**Uso**:
```typescript
const capacity = await ApiService.getVenueCapacity();
console.log(`El venue está ${capacity.percentage}% lleno`);
```

### Obtener Resumen de Verificadores
Recuperar resumen de rendimiento para todos los verificadores.

**Endpoint Simulado**: `ApiService.getCheckersSummary()`

**Respuesta**:
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

**Modelo de Datos**:
```typescript
interface CheckerData {
  id: string;
  name: string;
  scanned: number;    // Total de códigos QR escaneados
  verified: number;   // Brazaletes verificados exitosamente
  rejected: number;   // Escaneos rechazados/inválidos
}
```

**Uso**:
```typescript
const checkers = await ApiService.getCheckersSummary();
const totalScanned = checkers.reduce((sum, checker) => sum + checker.scanned, 0);
```

### Obtener Brazaletes
Recuperar lista de todos los brazaletes con su estado actual.

**Endpoint Simulado**: `ApiService.getWristbands()`

**Respuesta**:
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

**Modelo de Datos**:
```typescript
interface Wristband {
  id: string;                                    // Identificador único del brazalete
  name: string;                                  // Tipo/categoría del brazalete
  status: 'verified' | 'pending' | 'rejected';  // Estado actual
  verifiedAt?: string;                           // Timestamp ISO de verificación
  verifiedBy?: string;                           // Nombre del verificador
}
```

**Valores de Estado**:
- `verified`: El brazalete ha sido escaneado y verificado exitosamente
- `pending`: El brazalete aún no ha sido escaneado
- `rejected`: El brazalete fue escaneado pero la verificación falló

**Uso**:
```typescript
const wristbands = await ApiService.getWristbands();
const verifiedCount = wristbands.filter(w => w.status === 'verified').length;
```

### Verificar Brazalete
Verificar un brazalete usando su código QR.

**Endpoint Simulado**: `ApiService.verifyWristband(qrCode: string)`

**Parámetros**:
- `qrCode` (string): Los datos del código QR escaneados del brazalete

**Respuesta Exitosa**:
```json
{
  "valid": true,
  "message": "Brazalete verificado correctamente"
}
```

**Respuesta de Error**:
```json
{
  "valid": false,
  "message": "Brazalete no válido o ya escaneado"
}
```

**Modelo de Datos**:
```typescript
interface VerificationResult {
  valid: boolean;
  message: string;
}
```

**Lógica de Validación**:
```typescript
// Reglas de validación simuladas
const isValid = qrCode && !qrCode.includes('invalid');

// La implementación real verificaría:
// - Formato del código QR
// - Búsqueda en base de datos
// - Prevención de escaneos duplicados
// - Validez del evento
// - Restricciones de tiempo
```

**Uso**:
```typescript
const result = await ApiService.verifyWristband('WB-123456');
if (result.valid) {
  showSuccessMessage(result.message);
} else {
  showErrorMessage(result.message);
}
```

### Actualizar Estado de Brazalete
Actualizar el estado de un brazalete específico.

**Endpoint Simulado**: `ApiService.updateWristbandStatus(wristbandId: string, status: string)`

**Parámetros**:
- `wristbandId` (string): Identificador único del brazalete
- `status` (string): Nuevo estado ('verified', 'pending', 'rejected')

**Respuesta Exitosa**:
```json
{
  "success": true
}
```

**Respuesta de Error**:
```json
{
  "success": false,
  "error": "Brazalete no encontrado"
}
```

**Uso**:
```typescript
const result = await ApiService.updateWristbandStatus('WB-123456', 'verified');
if (result.success) {
  refreshWristbandList();
}
```

## Manejo de Errores

### Códigos de Estado HTTP
- `200`: Éxito
- `400`: Solicitud Incorrecta (parámetros inválidos)
- `401`: No Autorizado (token inválido o expirado)
- `403`: Prohibido (permisos insuficientes)
- `404`: No Encontrado (recurso no existe)
- `500`: Error Interno del Servidor

### Formato de Respuesta de Error
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Las credenciales proporcionadas son inválidas",
    "details": "El email o contraseña es incorrecto"
  }
}
```

### Manejo de Errores del Lado del Cliente
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

## Flujo de Autenticación

### Gestión de Tokens
```typescript
class AuthService {
  private static token: string | null = null;
  
  // Almacenar token después de login exitoso
  static async storeToken(token: string): Promise<void> {
    this.token = token;
    if (Platform.OS === 'web') {
      localStorage.setItem('auth_token', token);
    } else {
      await SecureStore.setItemAsync('auth_token', token);
    }
  }
  
  // Obtener token para solicitudes API
  static async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    
    if (Platform.OS === 'web') {
      this.token = localStorage.getItem('auth_token');
    } else {
      this.token = await SecureStore.getItemAsync('auth_token');
    }
    
    return this.token;
  }
  
  // Limpiar token al cerrar sesión
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

### Solicitudes Autenticadas
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

## Limitación de Velocidad

### Límites Actuales
- **Intentos de login**: 5 por minuto por IP
- **Solicitudes API**: 100 por minuto por usuario autenticado
- **Verificación QR**: 30 por minuto por usuario

### Encabezados de Límite de Velocidad
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Manejo de Límites de Velocidad
```typescript
const handleRateLimit = (response: Response) => {
  if (response.status === 429) {
    const resetTime = response.headers.get('X-RateLimit-Reset');
    const waitTime = resetTime ? parseInt(resetTime) - Date.now() / 1000 : 60;
    
    throw new Error(`Límite de velocidad excedido. Intente de nuevo en ${waitTime} segundos.`);
  }
};
```

## Validación de Datos

### Validación de Entrada
```typescript
// Validación de email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de código QR
const validateQRCode = (code: string): boolean => {
  // Verificar formato: WB-XXXXXX
  const qrRegex = /^WB-[A-Z0-9]{6}$/;
  return qrRegex.test(code);
};

// Validación de contraseña
const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};
```

### Sanitización de Solicitudes
```typescript
const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remover posibles etiquetas HTML
    .substring(0, 1000);   // Limitar longitud
};
```

## Configuración de Datos Simulados

### Configuración de Desarrollo
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
    // ... más brazaletes
  ]
};
```

### Simulación de Red
```typescript
private static async mockRequest<T>(data: T): Promise<T> {
  // Simular retraso de red (300ms - 800ms)
  const delay = Math.random() * 500 + 300;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Simular errores de red ocasionales (5% de probabilidad)
  if (Math.random() < 0.05) {
    throw new Error('Error de red');
  }
  
  return data;
}
```

## Integración API Real

### Implementación Futura
Cuando se integre con endpoints API reales, reemplazar métodos simulados con solicitudes HTTP reales:

```typescript
// Reemplazar implementación simulada
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
    throw new Error(`Verificación falló: ${response.statusText}`);
  }
  
  return response.json();
}
```

### Configuración de Entorno
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

Esta documentación de API proporciona una referencia completa para todos los endpoints, estructuras de datos y patrones de integración utilizados en la Aplicación QR Scanner Event Checker.