# Guía de Despliegue

## Visión General

Esta guía cubre el proceso de despliegue para la Aplicación QR Scanner Event Checker a través de diferentes plataformas (iOS, Android y Web) utilizando las herramientas de construcción y despliegue de Expo.

## Prerrequisitos

### Entorno de Desarrollo
- **Node.js**: 18.x o superior
- **npm**: 8.x o superior
- **Expo CLI**: Última versión (`npm install -g @expo/cli`)
- **EAS CLI**: Última versión (`npm install -g eas-cli`)

### Cuentas Requeridas
- **Cuenta Expo**: Para servicios de construcción y despliegue
- **Cuenta de Desarrollador Apple**: Para despliegue en App Store de iOS
- **Google Play Console**: Para despliegue en Play Store de Android
- **Hosting Web**: Para despliegue web (Netlify, Vercel, etc.)

### Requisitos Específicos de Plataforma

#### Desarrollo iOS
- **macOS**: Requerido para construcciones y pruebas de iOS
- **Xcode**: Última versión desde Mac App Store
- **Simulador iOS**: Para pruebas
- **Programa de Desarrollador Apple**: $99/año para distribución en App Store

#### Desarrollo Android
- **Android Studio**: Para pruebas y depuración
- **Android SDK**: Instalado vía Android Studio
- **Java Development Kit (JDK)**: Versión 11 o superior

## Configuración del Proyecto

### 1. Configuración de la Aplicación (`app.json`)
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
      "bundleIdentifier": "com.tuempresa.eventchecker",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.tuempresa.eventchecker",
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

### 2. Configuración de Construcción EAS (`eas.json`)
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

### 3. Variables de Entorno

#### Desarrollo (`.env`)
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

#### Producción (`.env.production`)
```env
EXPO_PUBLIC_API_URL=https://api.xolotlcl.com/api
EXPO_PUBLIC_ENVIRONMENT=production
EXPO_PUBLIC_DEBUG=false
```

## Proceso de Construcción

### 1. Construcción de Desarrollo Local
```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npx expo start

# Ejecutar en plataformas específicas
npx expo start --ios
npx expo start --android
npx expo start --web
```

### 2. Construcción de Desarrollo (con EAS)
```bash
# Iniciar sesión en Expo
npx expo login

# Configurar EAS
eas build:configure

# Construir para desarrollo
eas build --platform ios --profile development
eas build --platform android --profile development
```

### 3. Construcción de Vista Previa
```bash
# Construir versiones de vista previa para pruebas
eas build --platform ios --profile preview
eas build --platform android --profile preview

# Instalar en dispositivo
eas build:run --platform ios
eas build:run --platform android
```

### 4. Construcción de Producción
```bash
# Construir para producción
eas build --platform ios --profile production
eas build --platform android --profile production
eas build --platform all --profile production
```

## Despliegue Específico de Plataforma

### Despliegue iOS

#### 1. Configuración de App Store Connect
1. **Crear Registro de App**:
   - Iniciar sesión en [App Store Connect](https://appstoreconnect.apple.com)
   - Crear nueva app con identificador de bundle: `com.tuempresa.eventchecker`
   - Completar información de la app, categorías y precios

2. **Información de la App**:
   ```
   Nombre: Event Checker App
   Subtítulo: Escáner QR para Control de Acceso a Eventos
   Categoría: Negocios
   Clasificación de Contenido: 4+
   ```

3. **Capturas de Pantalla del App Store**:
   - iPhone 6.7": 1290 x 2796 píxeles
   - iPhone 6.5": 1242 x 2688 píxeles
   - iPhone 5.5": 1242 x 2208 píxeles
   - iPad Pro 12.9": 2048 x 2732 píxeles

#### 2. Construir y Enviar
```bash
# Construir para App Store
eas build --platform ios --profile production

# Enviar a App Store
eas submit --platform ios
```

#### 3. Distribución TestFlight
```bash
# Construir para TestFlight
eas build --platform ios --profile preview

# Enviar a TestFlight
eas submit --platform ios --profile preview
```

### Despliegue Android

#### 1. Configuración de Google Play Console
1. **Crear App**:
   - Ir a [Google Play Console](https://play.google.com/console)
   - Crear nueva app con nombre de paquete: `com.tuempresa.eventchecker`
   - Completar detalles de la app y clasificación de contenido

2. **Información de la App**:
   ```
   Título: Event Checker App
   Descripción Corta: Escáner QR para Control de Acceso a Eventos
   Descripción Completa: Aplicación profesional de gestión de eventos para verificación de brazaletes y monitoreo de capacidad del venue.
   Categoría: Negocios
   Clasificación de Contenido: Para todos
   ```

3. **Recursos de Listado en Store**:
   - Icono de App: 512 x 512 píxeles
   - Gráfico Destacado: 1024 x 500 píxeles
   - Capturas de Pantalla: Varios tamaños para teléfonos y tablets

#### 2. Construir y Enviar
```bash
# Construir para Play Store
eas build --platform android --profile production

# Enviar a Play Store
eas submit --platform android
```

#### 3. Pruebas Internas
```bash
# Construir para pruebas internas
eas build --platform android --profile preview

# Distribuir vía track de pruebas internas
eas submit --platform android --track internal
```

### Despliegue Web

#### 1. Construir para Web
```bash
# Construir recursos web estáticos
npx expo export:web

# La salida estará en el directorio 'dist'
```

#### 2. Desplegar a Netlify
```bash
# Instalar CLI de Netlify
npm install -g netlify-cli

# Desplegar a Netlify
netlify deploy --dir=dist --prod
```

#### 3. Desplegar a Vercel
```bash
# Instalar CLI de Vercel
npm install -g vercel

# Desplegar a Vercel
vercel --prod
```

#### 4. Despliegue en Servidor Personalizado
```bash
# Construir para servidor personalizado
npx expo export:web

# Copiar carpeta dist a tu servidor web
scp -r dist/* usuario@tuservidor.com:/var/www/html/
```

## Pipeline CI/CD

### Flujo de Trabajo de GitHub Actions (`.github/workflows/build.yml`)
```yaml
name: Construir y Desplegar

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
    
    - name: Configurar Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Instalar dependencias
      run: npm ci
    
    - name: Ejecutar pruebas
      run: npm test
    
    - name: Configurar Expo
      uses: expo/expo-github-action@v8
      with:
        expo-version: latest
        token: ${{ secrets.EXPO_TOKEN }}
    
    - name: Construir para vista previa
      if: github.ref != 'refs/heads/main'
      run: eas build --platform all --profile preview --non-interactive
    
    - name: Construir para producción
      if: github.ref == 'refs/heads/main'
      run: eas build --platform all --profile production --non-interactive
    
    - name: Desplegar web
      if: github.ref == 'refs/heads/main'
      run: |
        npx expo export:web
        netlify deploy --dir=dist --prod --auth=${{ secrets.NETLIFY_AUTH_TOKEN }} --site=${{ secrets.NETLIFY_SITE_ID }}
```

### Secretos de Entorno
Configurar estos secretos en tu plataforma CI/CD:
```
EXPO_TOKEN=tu_token_de_acceso_expo
NETLIFY_AUTH_TOKEN=tu_token_netlify
NETLIFY_SITE_ID=tu_id_sitio_netlify
APPLE_ID=tu_apple_id
APPLE_APP_SPECIFIC_PASSWORD=tu_contraseña_app
GOOGLE_SERVICE_ACCOUNT_KEY=tu_clave_cuenta_servicio_json
```

## Gestión de Versiones

### Gestión de Versiones
```bash
# Actualizar versión en app.json
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

# Crear etiqueta git
git tag v1.1.0
git push origin v1.1.0
```

### Plantilla de Notas de Versión
```markdown
## Versión 1.1.0

### Nuevas Características
- Escáner QR mejorado con mayor precisión
- Actualizaciones de dashboard en tiempo real
- Soporte para modo offline

### Mejoras
- Tiempo de inicio de app más rápido
- Mejor manejo de errores
- Componentes UI actualizados

### Correcciones de Errores
- Corregidos problemas de permisos de cámara
- Resueltos problemas de timeout de login
- Corregidos errores de sincronización de datos

### Cambios Técnicos
- Actualizado a Expo SDK 52
- Mejorado manejo de errores API
- Medidas de seguridad mejoradas
```

## Monitoreo y Análisis

### 1. Análisis de Expo
```typescript
// Seguimiento de uso de app
import { Analytics } from 'expo-analytics';

const analytics = new Analytics('UA-XXXXXXXXX-X');

// Seguimiento de vistas de pantalla
analytics.screen('Dashboard');
analytics.screen('Scanner');

// Seguimiento de eventos
analytics.event('QR_Scan', {
  category: 'Acción de Usuario',
  label: 'Escaneo Exitoso'
});
```

### 2. Reporte de Errores
```typescript
// Configurar Sentry para reporte de errores
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'TU_SENTRY_DSN',
});

// Capturar errores
try {
  // Lógica de la app
} catch (error) {
  Sentry.captureException(error);
}
```

### 3. Monitoreo de Rendimiento
```typescript
// Monitorear rendimiento de la app
import { Performance } from 'expo-performance';

const startTime = Performance.now();
// Realizar operación
const endTime = Performance.now();
const duration = endTime - startTime;

if (duration > 1000) {
  console.warn(`Operación lenta: ${duration}ms`);
}
```

## Consideraciones de Seguridad

### 1. Ofuscación de Código
```bash
# Habilitar ofuscación de código para producción
# En eas.json
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

### 2. Seguridad API
```typescript
// Configuración API segura
const API_CONFIG = {
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Version': '1.0',
  },
};

// Certificate pinning para producción
if (process.env.EXPO_PUBLIC_ENVIRONMENT === 'production') {
  API_CONFIG.certificatePinning = {
    hostname: 'api.xolotlcl.com',
    publicKeyHash: 'TU_HASH_CLAVE_PUBLICA'
  };
}
```

### 3. Seguridad de Variables de Entorno
```bash
# Nunca hacer commit de datos sensibles
# Usar variables de entorno seguras de Expo
npx expo env:set EXPO_PUBLIC_API_URL https://api.xolotlcl.com/api
npx expo env:set --environment production API_SECRET tu_clave_secreta
```

## Solución de Problemas

### Problemas Comunes de Construcción

#### 1. Fallas de Construcción iOS
```bash
# Limpiar caché de Expo
npx expo r -c

# Actualizar dependencias iOS
cd ios && pod install && cd ..

# Verificar validez del certificado
eas credentials
```

#### 2. Fallas de Construcción Android
```bash
# Limpiar construcción Android
cd android && ./gradlew clean && cd ..

# Actualizar dependencias Android
npx expo install --fix

# Verificar configuración de keystore
eas credentials
```

#### 3. Problemas de Construcción Web
```bash
# Limpiar caché web
rm -rf .expo/web

# Reconstruir recursos web
npx expo export:web --clear
```

### Problemas de Rendimiento
```bash
# Analizar tamaño del bundle
npx expo export:web --analyze

# Verificar memory leaks
npx expo start --dev-client --clear

# Perfilar rendimiento de la app
npx expo start --profiling
```

### Fallas de Despliegue
```bash
# Verificar estado de construcción EAS
eas build:list

# Ver logs de construcción
eas build:view [BUILD_ID]

# Reintentar construcciones fallidas
eas build --platform ios --profile production --clear-cache
```

## Mantenimiento

### Actualizaciones Regulares
- **Mensual**: Actualizar Expo SDK y dependencias
- **Trimestral**: Revisar y actualizar configuraciones de seguridad
- **Semestral**: Auditar dependencias de terceros
- **Anual**: Revisar y actualizar certificados y claves

### Lista de Verificación de Monitoreo
- [ ] Reseñas y calificaciones de App Store/Play Store
- [ ] Reportes de errores y logs de error
- [ ] Métricas de rendimiento y tiempos de carga
- [ ] Análisis de usuario y engagement
- [ ] Escaneos de vulnerabilidades de seguridad
- [ ] Verificaciones de salud de endpoints API

Esta guía de despliegue proporciona instrucciones completas para construir, desplegar y mantener la Aplicación QR Scanner Event Checker a través de todas las plataformas soportadas.