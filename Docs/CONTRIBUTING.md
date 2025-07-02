# Guía de Contribución

## ¡Bienvenidos Contribuidores!

Gracias por tu interés en contribuir a la Aplicación QR Scanner Event Checker. Esta guía te ayudará a entender nuestro proceso de desarrollo, estándares de código y cómo enviar contribuciones de manera efectiva.

## Tabla de Contenidos

1. [Primeros Pasos](#primeros-pasos)
2. [Configuración de Desarrollo](#configuración-de-desarrollo)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Estándares de Código](#estándares-de-código)
5. [Flujo de Trabajo de Desarrollo](#flujo-de-trabajo-de-desarrollo)
6. [Guías de Pruebas](#guías-de-pruebas)
7. [Envío de Cambios](#envío-de-cambios)
8. [Proceso de Revisión de Código](#proceso-de-revisión-de-código)
9. [Reporte de Issues](#reporte-de-issues)
10. [Guías de Comunidad](#guías-de-comunidad)

## Primeros Pasos

### Prerrequisitos

Antes de contribuir, asegúrate de tener:

- **Node.js** 18.x o superior
- **npm** 8.x o superior
- **Git** para control de versiones
- **Expo CLI** (`npm install -g @expo/cli`)
- **Editor de Código** (VS Code recomendado)

### Extensiones Recomendadas de VS Code

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "expo.vscode-expo-tools",
    "ms-vscode.vscode-react-native"
  ]
}
```

## Configuración de Desarrollo

### 1. Fork y Clonar

```bash
# Hacer fork del repositorio en GitHub
# Luego clonar tu fork
git clone https://github.com/TU_USUARIO/event-checker-app.git
cd event-checker-app

# Agregar remote upstream
git remote add upstream https://github.com/PROPIETARIO_ORIGINAL/event-checker-app.git
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias del proyecto
npm install

# Verificar instalación
npx expo doctor
```

### 3. Configuración de Entorno

```bash
# Copiar plantilla de entorno
cp .env.example .env

# Configurar tu entorno local
# Editar .env con tus configuraciones locales
```

### 4. Iniciar Servidor de Desarrollo

```bash
# Iniciar servidor de desarrollo Expo
npm run dev

# O iniciar con plataforma específica
npm run ios
npm run android
npm run web
```

## Estructura del Proyecto

Entender la estructura del proyecto es crucial para contribuciones efectivas:

```
event-checker-app/
├── app/                          # Páginas de Expo Router
│   ├── _layout.tsx              # Layout raíz
│   ├── (auth)/                  # Stack de autenticación
│   │   ├── _layout.tsx         # Layout de autenticación
│   │   └── login.tsx           # Pantalla de login
│   └── (tabs)/                  # Navegación principal por pestañas
│       ├── _layout.tsx         # Layout de pestañas
│       ├── index.tsx           # Dashboard
│       ├── wristbands.tsx      # Gestión de brazaletes
│       ├── scanner.tsx         # Escáner QR
│       └── profile.tsx         # Perfil de usuario
├── components/                   # Componentes reutilizables
│   ├── dashboard/               # Componentes del dashboard
│   └── wristbands/             # Componentes de brazaletes
├── services/                    # Lógica de negocio
│   ├── api.ts                  # Servicio API
│   └── auth.ts                 # Servicio de autenticación
├── hooks/                       # Hooks personalizados de React
├── types/                       # Definiciones de tipos TypeScript
├── assets/                      # Recursos estáticos
├── __tests__/                   # Archivos de prueba
└── docs/                        # Documentación
```

### Convenciones de Nomenclatura de Archivos

- **Componentes**: PascalCase (`VenueCapacity.tsx`)
- **Pantallas**: PascalCase (`LoginScreen.tsx`)
- **Servicios**: camelCase (`authService.ts`)
- **Hooks**: camelCase con prefijo `use` (`useFrameworkReady.ts`)
- **Tipos**: PascalCase (`UserTypes.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_CONSTANTS.ts`)

## Estándares de Código

### Guías de TypeScript

#### 1. Definiciones de Tipos
```typescript
// Siempre definir interfaces para estructuras de datos
interface WristbandData {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: string;
}

// Usar tipos union para valores específicos
type Theme = 'light' | 'dark' | 'auto';

// Usar genéricos para componentes reutilizables
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

#### 2. Props de Componentes
```typescript
// Siempre tipar props de componentes
interface VenueCapacityProps {
  current: number;
  max: number;
  percentage: number;
  isLoading: boolean;
  onRefresh?: () => void;
}

export function VenueCapacity({ 
  current, 
  max, 
  percentage, 
  isLoading,
  onRefresh 
}: VenueCapacityProps) {
  // Implementación del componente
}
```

#### 3. Funciones Asíncronas
```typescript
// Siempre tipar retornos de funciones asíncronas
const fetchUserData = async (userId: string): Promise<UserData> => {
  try {
    const response = await ApiService.getUser(userId);
    return response.data;
  } catch (error) {
    throw new Error(`Falló al obtener usuario: ${error.message}`);
  }
};
```

### Estilos de React Native

#### 1. Uso de StyleSheet
```typescript
// Siempre usar StyleSheet.create
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C1E8FF',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#021024',
    marginBottom: 16,
  },
});
```

#### 2. Sistema de Colores
```typescript
// Usar paleta de colores consistente
const Colors = {
  primary: '#021024',
  secondary: '#052859',
  accent: '#7DA0CA',
  background: '#C1E8FF',
  white: '#FFFFFF',
  success: '#4CAF50',
  error: '#FF3B30',
  warning: '#FFA726',
} as const;

// Uso en estilos
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
  },
});
```

#### 3. Diseño Responsivo
```typescript
// Usar Dimensions para layouts responsivos
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: width > 768 ? '50%' : '100%',
    maxWidth: 400,
  },
});
```

### Guías de Componentes

#### 1. Estructura de Componentes
```typescript
// Estructura estándar de componentes
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ComponentProps {
  // Interfaz de props
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Declaraciones de estado
  const [state, setState] = useState(initialValue);
  
  // Hooks de efecto
  useEffect(() => {
    // Lógica de efecto
  }, [dependencies]);
  
  // Manejadores de eventos
  const handleEvent = () => {
    // Lógica del manejador
  };
  
  // Renderizado
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Contenido</Text>
    </View>
  );
}

// Estilos al final
const styles = StyleSheet.create({
  // Estilos
});
```

#### 2. Manejo de Errores
```typescript
// Implementar límites de error apropiados
const ComponentWithErrorHandling = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleAsyncOperation = async () => {
    try {
      setLoading(true);
      setError(null);
      await someAsyncOperation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };
  
  if (error) {
    return <ErrorDisplay message={error} onRetry={handleAsyncOperation} />;
  }
  
  return <MainContent loading={loading} />;
};
```

#### 3. Optimización de Rendimiento
```typescript
// Usar React.memo para componentes costosos
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <ComplexRender data={data} />;
});

// Usar useCallback para manejadores de eventos
const handlePress = useCallback((id: string) => {
  onItemPress(id);
}, [onItemPress]);

// Usar useMemo para cálculos costosos
const processedData = useMemo(() => {
  return data.map(item => expensiveTransform(item));
}, [data]);
```

## Flujo de Trabajo de Desarrollo

### 1. Estrategia de Ramas

Usamos el modelo de ramificación Git Flow:

```bash
# Ramas principales
main        # Código listo para producción
develop     # Rama de integración para características

# Ramas de soporte
feature/*   # Nuevas características
bugfix/*    # Correcciones de errores
hotfix/*    # Correcciones críticas de producción
release/*   # Preparación de versiones
```

### 2. Desarrollo de Características

```bash
# Iniciar nueva característica
git checkout develop
git pull upstream develop
git checkout -b feature/nueva-caracteristica-escaner

# Hacer cambios y commit
git add .
git commit -m "feat: agregar escáner QR mejorado con validación"

# Push a tu fork
git push origin feature/nueva-caracteristica-escaner

# Crear pull request a rama develop
```

### 3. Convención de Mensajes de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato
<tipo>[ámbito opcional]: <descripción>

[cuerpo opcional]

[pie(s) opcional(es)]

# Tipos
feat:     # Nueva característica
fix:      # Corrección de error
docs:     # Cambios en documentación
style:    # Cambios de estilo de código (formato, etc.)
refactor: # Refactorización de código
test:     # Agregar o actualizar pruebas
chore:    # Tareas de mantenimiento

# Ejemplos
feat(scanner): agregar validación de código QR
fix(auth): resolver problema de timeout de login
docs: actualizar documentación de API
style: formatear código con prettier
refactor(components): extraer componente de botón común
test(api): agregar pruebas unitarias para servicio de auth
chore: actualizar dependencias
```

### 4. Verificaciones de Calidad de Código

Antes de hacer commit, asegurar que tu código pase todas las verificaciones:

```bash
# Ejecutar linting
npm run lint

# Ejecutar verificación de tipos
npm run type-check

# Ejecutar pruebas
npm run test

# Ejecutar todas las verificaciones
npm run validate
```

## Guías de Pruebas

### 1. Estructura de Pruebas

```typescript
// Ejemplo de prueba de componente
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';

describe('LoginScreen', () => {
  it('debería manejar login exitoso', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: true });
    
    const { getByPlaceholderText, getByText } = render(
      <LoginScreen onLogin={mockLogin} />
    );
    
    // Organizar
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Contraseña');
    const loginButton = getByText('Iniciar Sesión');
    
    // Actuar
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    // Afirmar
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
```

### 2. Pruebas de Servicios

```typescript
// Ejemplo de prueba de servicio
import { ApiService } from '../ApiService';

describe('ApiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('debería verificar brazalete exitosamente', async () => {
    // Organizar
    const mockQRCode = 'WB-123456';
    
    // Actuar
    const result = await ApiService.verifyWristband(mockQRCode);
    
    // Afirmar
    expect(result.valid).toBe(true);
    expect(result.message).toContain('verificado');
  });
  
  it('debería manejar brazalete inválido', async () => {
    // Organizar
    const mockQRCode = 'codigo-invalido';
    
    // Actuar
    const result = await ApiService.verifyWristband(mockQRCode);
    
    // Afirmar
    expect(result.valid).toBe(false);
    expect(result.message).toContain('no válido');
  });
});
```

### 3. Pruebas de Integración

```typescript
// Ejemplo de prueba de integración
describe('Flujo de Autenticación', () => {
  it('debería completar flujo de login a dashboard', async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<App />);
    
    // Iniciar en pantalla de login
    expect(getByText('Iniciar Sesión')).toBeTruthy();
    
    // Ingresar credenciales
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password');
    fireEvent.press(getByText('Iniciar Sesión'));
    
    // Debería navegar al dashboard
    await waitFor(() => {
      expect(queryByText('Dashboard')).toBeTruthy();
    });
  });
});
```

### 4. Cobertura de Pruebas

Mantener cobertura mínima de pruebas:
- **Componentes**: 80% de cobertura
- **Servicios**: 90% de cobertura
- **Utilidades**: 95% de cobertura

```bash
# Ejecutar pruebas con cobertura
npm run test:coverage

# Ver reporte de cobertura
open coverage/lcov-report/index.html
```

## Envío de Cambios

### 1. Lista de Verificación Pre-envío

Antes de enviar un pull request:

- [ ] El código sigue las guías de estilo del proyecto
- [ ] Todas las pruebas pasan
- [ ] Las nuevas características incluyen pruebas
- [ ] La documentación está actualizada
- [ ] Los mensajes de commit siguen la convención
- [ ] No hay declaraciones console.log en código de producción
- [ ] Los tipos TypeScript están apropiadamente definidos
- [ ] Se considera el impacto en el rendimiento

### 2. Plantilla de Pull Request

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de Cambio
- [ ] Corrección de error (cambio que no rompe funcionalidad y corrige un issue)
- [ ] Nueva característica (cambio que no rompe funcionalidad y agrega funcionalidad)
- [ ] Cambio que rompe funcionalidad (corrección o característica que causaría que funcionalidad existente no funcione como se esperaba)
- [ ] Actualización de documentación

## Pruebas
- [ ] Pruebas unitarias agregadas/actualizadas
- [ ] Pruebas de integración agregadas/actualizadas
- [ ] Pruebas manuales completadas

## Capturas de Pantalla (si aplica)
Agregar capturas de pantalla para ayudar a explicar tus cambios.

## Lista de Verificación
- [ ] Mi código sigue las guías de estilo de este proyecto
- [ ] He realizado una auto-revisión de mi propio código
- [ ] He comentado mi código, particularmente en áreas difíciles de entender
- [ ] He hecho cambios correspondientes a la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado pruebas que demuestran que mi corrección es efectiva o que mi característica funciona
- [ ] Las pruebas unitarias nuevas y existentes pasan localmente con mis cambios
```

### 3. Proceso de Pull Request

1. **Crear Pull Request**: Enviar PR a rama `develop`
2. **Verificaciones Automatizadas**: Asegurar que el pipeline CI/CD pase
3. **Revisión de Código**: Abordar retroalimentación del revisor
4. **Pruebas**: Verificar que los cambios funcionen como se esperaba
5. **Merge**: El mantenedor hace merge después de aprobación

## Proceso de Revisión de Código

### 1. Criterios de Revisión

Los revisores verificarán:

- **Funcionalidad**: ¿El código funciona como se pretende?
- **Calidad de Código**: ¿El código es limpio y mantenible?
- **Rendimiento**: ¿Hay implicaciones de rendimiento?
- **Seguridad**: ¿Hay preocupaciones de seguridad?
- **Pruebas**: ¿Las pruebas son adecuadas y pasan?
- **Documentación**: ¿La documentación está actualizada?

### 2. Guías de Revisión

#### Para Autores
- Proporcionar descripción clara del PR
- Responder a retroalimentación prontamente
- Hacer cambios solicitados
- Mantener PRs enfocados y pequeños

#### Para Revisores
- Ser constructivo y respetuoso
- Explicar razonamiento para sugerencias
- Aprobar cuando esté satisfecho
- Solicitar cambios si es necesario

### 3. Lista de Verificación de Revisión

```markdown
## Lista de Verificación de Revisión de Código

### Funcionalidad
- [ ] El código funciona como se describe
- [ ] Los casos extremos están manejados
- [ ] El manejo de errores es apropiado

### Calidad de Código
- [ ] El código es legible y bien estructurado
- [ ] Se siguen las convenciones de nomenclatura
- [ ] No hay duplicación de código
- [ ] Los comentarios explican lógica compleja

### Rendimiento
- [ ] No hay re-renderizados innecesarios
- [ ] Se usan algoritmos eficientes
- [ ] Se previenen memory leaks

### Seguridad
- [ ] Validación de entrada implementada
- [ ] No se exponen datos sensibles
- [ ] Autenticación/autorización correcta

### Pruebas
- [ ] Las pruebas cubren nueva funcionalidad
- [ ] Las pruebas son significativas
- [ ] Todas las pruebas pasan

### Documentación
- [ ] README actualizado si es necesario
- [ ] Documentación de API actualizada
- [ ] Comentarios agregados para código complejo
```

## Reporte de Issues

### 1. Reportes de Errores

Usar esta plantilla para reportes de errores:

```markdown
## Descripción del Error
Una descripción clara y concisa de qué es el error.

## Pasos para Reproducir
1. Ir a '...'
2. Hacer clic en '....'
3. Desplazarse hacia abajo a '....'
4. Ver error

## Comportamiento Esperado
Una descripción clara y concisa de lo que esperabas que pasara.

## Comportamiento Actual
Una descripción clara y concisa de lo que realmente pasó.

## Capturas de Pantalla
Si aplica, agregar capturas de pantalla para ayudar a explicar tu problema.

## Entorno
- Dispositivo: [ej. iPhone 12, Samsung Galaxy S21]
- OS: [ej. iOS 15.0, Android 11]
- Versión de App: [ej. 1.0.0]
- Versión de Expo SDK: [ej. 52.0.30]

## Contexto Adicional
Agregar cualquier otro contexto sobre el problema aquí.
```

### 2. Solicitudes de Características

Usar esta plantilla para solicitudes de características:

```markdown
## Descripción de la Característica
Una descripción clara y concisa de lo que quieres que pase.

## Declaración del Problema
¿Tu solicitud de característica está relacionada con un problema? Por favor describe.

## Solución Propuesta
Describe la solución que te gustaría.

## Alternativas Consideradas
Describe cualquier solución alternativa o características que hayas considerado.

## Contexto Adicional
Agregar cualquier otro contexto o capturas de pantalla sobre la solicitud de característica aquí.

## Notas de Implementación
Cualquier consideración técnica o detalles de implementación.
```

### 3. Etiquetas de Issues

Usamos estas etiquetas para categorizar issues:

- `bug`: Algo no está funcionando
- `enhancement`: Nueva característica o solicitud
- `documentation`: Mejoras o adiciones a documentación
- `good first issue`: Bueno para recién llegados
- `help wanted`: Se necesita atención extra
- `question`: Se solicita más información
- `wontfix`: Esto no se trabajará
- `duplicate`: Este issue o pull request ya existe
- `priority:high`: Issue de alta prioridad
- `priority:medium`: Issue de prioridad media
- `priority:low`: Issue de baja prioridad

## Guías de Comunidad

### 1. Código de Conducta

Estamos comprometidos a proporcionar una comunidad acogedora e inspiradora para todos. Por favor lee y sigue nuestro [Código de Conducta](CODE_OF_CONDUCT.md).

### 2. Comunicación

- **Sé Respetuoso**: Trata a todos con respeto y amabilidad
- **Sé Constructivo**: Proporciona retroalimentación útil y sugerencias
- **Sé Paciente**: Recuerda que todos tienen diferentes niveles de experiencia
- **Sé Inclusivo**: Da la bienvenida a recién llegados y ayúdalos a comenzar

### 3. Obtener Ayuda

Si necesitas ayuda:

1. **Documentación**: Revisa la documentación existente primero
2. **Issues**: Busca issues existentes para problemas similares
3. **Discusiones**: Usa GitHub Discussions para preguntas
4. **Discord**: Únete a nuestro servidor Discord de la comunidad
5. **Email**: Contacta a los mantenedores directamente para issues sensibles

### 4. Reconocimiento

¡Apreciamos todas las contribuciones! Los contribuidores serán:

- Listados en el archivo CONTRIBUTORS.md
- Mencionados en notas de versión para contribuciones significativas
- Invitados a unirse al equipo central para contribuciones destacadas

## Recursos de Desarrollo

### 1. Enlaces Útiles

- [Documentación de Expo](https://docs.expo.dev/)
- [Documentación de React Native](https://reactnative.dev/)
- [Manual de TypeScript](https://www.typescriptlang.org/docs/)
- [Documentación de Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)

### 2. Herramientas de Desarrollo

- **Expo Dev Tools**: Herramientas de depuración integradas
- **React Native Debugger**: Depuración avanzada
- **Flipper**: Depurador de aplicaciones móviles
- **Extensiones de VS Code**: Experiencia de desarrollo mejorada

### 3. Recursos de Aprendizaje

- [Tutorial de React Native](https://reactnative.dev/docs/tutorial)
- [Tutorial de Expo](https://docs.expo.dev/tutorial/introduction/)
- [Tutorial de TypeScript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Tutorial de Testing](https://testing-library.com/docs/react-native-testing-library/example-intro/)

¡Gracias por contribuir a la Aplicación QR Scanner Event Checker! Tus contribuciones ayudan a hacer este proyecto mejor para todos.