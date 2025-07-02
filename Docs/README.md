# QR Scanner - Aplicación de Control de Acceso para Eventos

Una aplicación moderna y minimalista desarrollada en React Native con Expo para el control de acceso a eventos y verificación de brazaletes. Esta aplicación proporciona monitoreo en tiempo real de la capacidad del venue, escaneo de códigos QR para verificación de brazaletes y análisis completos del dashboard.

## 🚀 Características Principales

### Funcionalidad Central
- **Escáner QR**: Verificación de brazaletes en tiempo real usando la cámara del dispositivo
- **Dashboard Analítico**: Monitoreo en vivo de la capacidad del venue y métricas de rendimiento de verificadores
- **Gestión de Brazaletes**: Seguimiento completo de brazaletes verificados, pendientes y rechazados
- **Autenticación de Usuario**: Sistema de login seguro con autenticación basada en tokens
- **Gestión de Perfil**: Información de cuenta de usuario y configuraciones de la aplicación

### Características Destacadas
- **Actualizaciones en Tiempo Real**: Sincronización de datos en vivo cada 30 segundos
- **Preparado para Offline**: Manejo elegante de problemas de conectividad de red
- **UI/UX Moderno**: Diseño limpio y minimalista con estética profesional
- **Multiplataforma**: Funciona en iOS, Android y plataformas Web
- **Listo para Producción**: Manejo integral de errores y retroalimentación al usuario

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
Azul Primario: #021024    /* Encabezados, texto principal */
Azul Secundario: #052859  /* Botones, acentos */
Azul Claro: #7DA0CA      /* Texto secundario, iconos */
Fondo: #C1E8FF           /* Fondo principal */
Blanco: #FFFFFF          /* Tarjetas, overlays */
Éxito: #4CAF50           /* Estados verificados */
Error: #FF3B30           /* Estados de error */
Advertencia: #FFA726     /* Estados de advertencia */
```

### Tipografía
- **Encabezados**: Bold, 24-32px, Azul Primario
- **Texto del Cuerpo**: Regular, 16px, Azul Primario
- **Texto Secundario**: Medium, 14px, Azul Claro
- **Botones**: Bold, 16-18px, Blanco sobre Azul Primario

### Sistema de Espaciado
- **Unidad Base**: 8px
- **Pequeño**: 8px, 12px, 16px
- **Mediano**: 20px, 24px, 32px
- **Grande**: 40px, 60px, 80px

## 📱 Estructura de la Aplicación

### Arquitectura de Navegación
```
Layout Raíz (_layout.tsx)
├── Stack de Autenticación (auth)
│   └── Pantalla de Login
└── Pestañas Principales (tabs)
    ├── Dashboard (index)
    ├── Gestión de Brazaletes
    ├── Escáner QR
    └── Perfil (oculto de las pestañas)
```

### Descripción de Pantallas

#### 1. Pantalla de Login (`(auth)/login.tsx`)
- **Propósito**: Autenticación de usuario y punto de entrada a la aplicación
- **Características**: Login con email/contraseña, manejo de errores, estados de carga
- **Integración API**: Se conecta a `https://api.xolotlcl.com/api/loginXcl`

#### 2. Dashboard (`(tabs)/index.tsx`)
- **Propósito**: Monitoreo del venue en tiempo real y análisis
- **Componentes**: 
  - Medidor de capacidad del venue con indicadores de estado
  - Tabla resumen de rendimiento de verificadores
  - Funcionalidad de auto-actualización
- **Fuentes de Datos**: API simulada con datos realistas del venue

#### 3. Brazaletes (`(tabs)/wristbands.tsx`)
- **Propósito**: Inventario completo de brazaletes y seguimiento de estado
- **Características**: 
  - Funcionalidad de búsqueda y filtrado
  - Filtrado basado en estado (Todos, Verificados, Pendientes)
  - Detalles individuales de brazaletes con historial de verificación

#### 4. Escáner (`(tabs)/scanner.tsx`)
- **Propósito**: Escaneo de códigos QR y verificación en tiempo real
- **Características**:
  - Escaneo QR basado en cámara
  - Soporte para entrada manual de códigos
  - Retroalimentación instantánea de verificación
  - Diálogos modales de éxito/error
- **Integración de Cámara**: Usa `expo-camera` con permisos apropiados

#### 5. Perfil (`(tabs)/profile.tsx`)
- **Propósito**: Gestión de cuenta de usuario e información de la aplicación
- **Características**:
  - Visualización de información del usuario
  - Información de versión de la aplicación y soporte
  - Funcionalidad de logout seguro

## 🛠 Arquitectura Técnica

### Stack Tecnológico
- **Framework**: React Native con Expo SDK 52.0.30
- **Navegación**: Expo Router 4.0.17
- **Lenguaje**: TypeScript
- **Estilos**: StyleSheet (React Native)
- **Iconos**: Lucide React Native
- **Cámara**: Expo Camera
- **Gestión de Estado**: React Hooks (useState, useEffect)

### Estructura del Proyecto
```
├── app/                          # Páginas de Expo Router
│   ├── _layout.tsx              # Layout raíz con navegación
│   ├── (auth)/                  # Stack de autenticación
│   │   ├── _layout.tsx         # Layout de autenticación
│   │   └── login.tsx           # Pantalla de login
│   ├── (tabs)/                  # Navegación principal por pestañas
│   │   ├── _layout.tsx         # Layout de pestañas con encabezados
│   │   ├── index.tsx           # Pantalla del dashboard
│   │   ├── wristbands.tsx      # Gestión de brazaletes
│   │   ├── scanner.tsx         # Escáner QR
│   │   └── profile.tsx         # Perfil de usuario
│   └── +not-found.tsx          # Página de error 404
├── components/                   # Componentes reutilizables
│   ├── dashboard/               # Componentes específicos del dashboard
│   │   ├── VenueCapacity.tsx   # Componente medidor de capacidad
│   │   └── CheckerSummary.tsx  # Tabla de rendimiento de verificadores
│   └── wristbands/             # Componentes específicos de brazaletes
│       └── WristbandItem.tsx   # Tarjeta individual de brazalete
├── services/                    # API y lógica de negocio
│   ├── api.ts                  # Servicio API simulado
│   └── auth.ts                 # Servicio de autenticación
├── hooks/                       # Hooks personalizados de React
│   └── useFrameworkReady.ts    # Inicialización del framework
└── assets/                      # Recursos estáticos
    └── images/                 # Iconos e imágenes de la aplicación
```

### Servicios Clave

#### Servicio de Autenticación (`services/auth.ts`)
```typescript
class AuthService {
  static async login(email: string, password: string)
  static async logout()
  static async isAuthenticated(): Promise<boolean>
  static async getUserEmail(): Promise<string | null>
  static async getAuthHeaders(): Promise<HeadersInit>
}
```

#### Servicio API (`services/api.ts`)
```typescript
class ApiService {
  static async getVenueCapacity()
  static async getCheckersSummary()
  static async getWristbands()
  static async verifyWristband(qrCode: string)
  static async updateWristbandStatus(id: string, status: string)
}
```

## 🔧 Configuración de Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Expo CLI
- Simulador iOS (para desarrollo iOS)
- Android Studio (para desarrollo Android)

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd event-checker-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run start      # Iniciar servidor de desarrollo Expo
npm run dev        # Iniciar servidor de desarrollo web
npm run android    # Ejecutar en dispositivo/emulador Android
npm run ios        # Ejecutar en dispositivo/simulador iOS
npm run web        # Ejecutar en navegador web
npm run test       # Ejecutar suite de pruebas
npm run lint       # Ejecutar ESLint
```

### Configuración de Entorno
Crear un archivo `.env` en el directorio raíz:
```env
EXPO_PUBLIC_API_URL=https://api.xolotlcl.com/api
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## 📊 Modelos de Datos

### Autenticación de Usuario
```typescript
interface LoginResponse {
  status: number;
  access_token: string;
  message?: string;
}
```

### Capacidad del Venue
```typescript
interface VenueCapacity {
  current: number;    // Ocupación actual
  max: number;        // Capacidad máxima
  percentage: number; // Porcentaje de ocupación
}
```

### Rendimiento de Verificadores
```typescript
interface CheckerData {
  id: string;
  name: string;
  scanned: number;    // Total de escaneos realizados
  verified: number;   // Verificados exitosamente
  rejected: number;   // Escaneos rechazados
}
```

### Datos de Brazaletes
```typescript
interface Wristband {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: string;
}
```

### Respuesta de Verificación
```typescript
interface VerificationResult {
  valid: boolean;
  message: string;
}
```

## 🎯 Integración API

### Endpoints de Autenticación
```typescript
POST /loginXcl
Body: { email: string, password: string }
Response: { status: number, access_token: string }

POST /logoutXcl
Headers: { Authorization: "Bearer <token>" }
Response: { status: number, msg: string }
```

### Estructura de Datos Simulados
La aplicación actualmente usa datos simulados para desarrollo y pruebas:

```typescript
const MOCK_DATA = {
  capacity: { current: 375, max: 500, percentage: 75 },
  checkers: [
    { id: '1', name: 'Juan Pérez', scanned: 87, verified: 82, rejected: 5 },
    // ... más verificadores
  ],
  wristbands: [
    { 
      id: 'WB-123456', 
      name: 'Invitado VIP', 
      status: 'verified',
      verifiedAt: '2024-01-15T10:30:00Z',
      verifiedBy: 'Juan Pérez' 
    },
    // ... más brazaletes
  ]
};
```

## 🔒 Características de Seguridad

### Autenticación
- **Autenticación Basada en Tokens**: Tokens JWT para acceso seguro a la API
- **Almacenamiento Seguro**: Tokens almacenados en almacenamiento seguro apropiado para la plataforma
- **Auto-logout**: Limpieza automática de sesión al cerrar sesión
- **Manejo de Errores**: Manejo elegante de fallas de autenticación

### Protección de Datos
- **Validación de Entrada**: Todas las entradas de usuario validadas antes del procesamiento
- **Límites de Error**: Manejo integral de errores en toda la aplicación
- **Seguridad de Red**: Comunicaciones API solo HTTPS
- **Gestión de Permisos**: Manejo apropiado de permisos de cámara

## 📱 Compatibilidad de Plataformas

### Plataformas Soportadas
- **iOS**: iPhone e iPad (iOS 13+)
- **Android**: Dispositivos Android (API nivel 21+)
- **Web**: Navegadores modernos (Chrome, Firefox, Safari, Edge)

### Características Específicas de Plataforma
```typescript
import { Platform } from 'react-native';

// Ejemplo de implementación específica de plataforma
const getStorageMethod = () => {
  if (Platform.OS === 'web') {
    return localStorage;
  } else {
    return AsyncStorage; // Para plataformas móviles
  }
};
```

### Permisos de Cámara
```typescript
// Manejo de permisos de cámara
const [permission, requestPermission] = useCameraPermissions();

if (!permission?.granted) {
  // Mostrar UI de solicitud de permisos
  return <PermissionScreen onRequest={requestPermission} />;
}
```

## 🧪 Estrategia de Pruebas

### Pruebas de Componentes
- Pruebas unitarias para componentes individuales
- Pruebas de integración para interacciones de servicios
- Datos simulados para entornos de prueba consistentes

### Pruebas de Flujo de Usuario
1. **Flujo de Autenticación**: Login → Navegación al Dashboard
2. **Flujo del Escáner**: Acceso a cámara → Escaneo QR → Verificación
3. **Flujo de Datos**: Actualización del dashboard → Actualizaciones en tiempo real
4. **Flujo de Navegación**: Cambio de pestañas → Acceso al perfil

### Pruebas de Rendimiento
- **Pruebas de Carga**: Grandes conjuntos de datos en listas de brazaletes
- **Pruebas de Red**: Manejo de estados offline/online
- **Pruebas de Memoria**: Gestión del ciclo de vida del componente de cámara

## 🚀 Despliegue

### Configuración de Build
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

### Build de Producción
```bash
# Build para producción
npx expo build:web

# Build para plataformas móviles
npx expo build:ios
npx expo build:android
```

### Variables de Entorno
```bash
# Entorno de producción
EXPO_PUBLIC_API_URL=https://api.production.com/api
EXPO_PUBLIC_ENVIRONMENT=production
```

## 🔄 Gestión de Estado

### Patrones de Estado Local
```typescript
// Gestión de estado de componentes
const [data, setData] = useState(initialData);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Efecto para carga de datos
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

### Estado Global (Autenticación)
```typescript
// Estado de autenticación gestionado en AuthService
class AuthService {
  private static token: string | null = null;
  private static userEmail: string | null = null;
  
  // Persistencia de estado a través de sesiones de la aplicación
  static async getToken(): Promise<string | null> {
    if (this.token) return this.token;
    
    // Cargar desde almacenamiento
    if (Platform.OS === 'web') {
      this.token = localStorage.getItem(AUTH_TOKEN_KEY);
    }
    
    return this.token;
  }
}
```

## 🎨 Guías UI/UX

### Principios de Diseño
1. **Minimalismo**: Interfaces limpias y sin desorden
2. **Consistencia**: Espaciado, colores y tipografía uniformes
3. **Accesibilidad**: Altas relaciones de contraste y fuentes legibles
4. **Responsividad**: Layouts adaptativos para todos los tamaños de pantalla
5. **Retroalimentación**: Retroalimentación visual clara para todas las acciones del usuario

### Patrones de Componentes
```typescript
// Patrón consistente de componente de tarjeta
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

### Guías de Animación
- **Transiciones Sutiles**: Duración de 300ms para la mayoría de animaciones
- **Easing**: Usar `ease-in-out` para movimiento natural
- **Rendimiento**: Preferir `react-native-reanimated` para animaciones complejas
- **Accesibilidad**: Respetar las preferencias de movimiento del usuario

## 📈 Optimización de Rendimiento

### Mejores Prácticas
1. **Carga Perezosa**: Componentes cargados bajo demanda
2. **Optimización de Imágenes**: Dimensionado y caché apropiado de imágenes
3. **Virtualización de Listas**: Para grandes conjuntos de datos (listas de brazaletes)
4. **Gestión de Memoria**: Limpieza apropiada de recursos de cámara
5. **Optimización de Red**: Agrupación y caché de solicitudes

### División de Código
```typescript
// Carga perezosa para componentes pesados
const Scanner = lazy(() => import('./Scanner'));

// Uso con Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Scanner />
</Suspense>
```

### Gestión de Memoria
```typescript
// Limpieza apropiada en useEffect
useEffect(() => {
  const interval = setInterval(fetchData, 30000);
  
  return () => {
    clearInterval(interval); // Limpieza al desmontar
  };
}, []);
```

## 🐛 Solución de Problemas

### Problemas Comunes

#### Cámara No Funciona
```typescript
// Verificar permisos
const [permission, requestPermission] = useCameraPermissions();
if (!permission?.granted) {
  await requestPermission();
}

// Asegurar limpieza apropiada
useEffect(() => {
  return () => {
    // Lógica de limpieza de cámara
  };
}, []);
```

#### Problemas de Autenticación
```typescript
// Limpiar tokens almacenados
AuthService.logout(); // Limpia todos los datos de autenticación almacenados

// Verificar validez del token
const isValid = await AuthService.isAuthenticated();
if (!isValid) {
  router.replace('/(auth)/login');
}
```

#### Conectividad de Red
```typescript
// Manejar errores de red elegantemente
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

### Modo Debug
```typescript
// Habilitar logging de debug
const DEBUG = __DEV__ || process.env.EXPO_PUBLIC_DEBUG === 'true';

if (DEBUG) {
  console.log('Información de debug:', data);
}
```

## 📚 Recursos Adicionales

### Enlaces de Documentación
- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de React Native](https://reactnative.dev/docs/getting-started)
- [Documentación de Expo Router](https://expo.github.io/router/docs/)
- [Documentación de Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)

### Herramientas de Desarrollo
- [Expo Dev Tools](https://docs.expo.dev/workflow/debugging/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/) (para debugging avanzado)

### Recursos de la Comunidad
- [Discord de Expo](https://discord.gg/expo)
- [Comunidad de React Native](https://reactnative.dev/community/overview)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)

## 🤝 Contribuir

### Flujo de Trabajo de Desarrollo
1. Hacer fork del repositorio
2. Crear una rama de característica (`git checkout -b feature/caracteristica-increible`)
3. Hacer commit de los cambios (`git commit -m 'Agregar característica increíble'`)
4. Push a la rama (`git push origin feature/caracteristica-increible`)
5. Abrir un Pull Request

### Estándares de Código
- **TypeScript**: Verificación de tipos estricta habilitada
- **ESLint**: Seguir la configuración ESLint de Expo
- **Prettier**: Formateo de código con indentación de 2 espacios
- **Nomenclatura**: Usar nombres de variables descriptivos en camelCase
- **Comentarios**: Documentar lógica compleja e integraciones API

### Requisitos de Pruebas
- Pruebas unitarias para nuevos componentes
- Pruebas de integración para interacciones API
- Pruebas manuales en iOS, Android y Web
- Pruebas de rendimiento para operaciones de cámara

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email**: soporte@qrscanner.com
- **Teléfono**: +1 (555) 123-4567
- **Documentación**: [Wiki del Proyecto](link-to-wiki)
- **Issues**: [GitHub Issues](link-to-issues)

---

**Versión**: 1.0.0  
**Última Actualización**: Enero 2024  
**Expo SDK**: 52.0.30  
**React Native**: 0.76.5