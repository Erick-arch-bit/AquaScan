import { Platform } from 'react-native';

// Claves de almacenamiento (se mantienen igual)
const AUTH_TOKEN_KEY = 'qrscanner_auth_token';
const USER_EMAIL_KEY = 'qrscanner_user_email';

// Configuración actualizada con los nuevos endpoints
const API_CONFIG = {
  baseURL: 'https://api-taquilla.ftgo.com.mx/v1/api',
  timeout: 15000,
  retries: 3,
  retryDelay: 1000,
};

// Tipos de respuesta (actualizados para FTGO)
interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    name: string;
  };
  error?: {
    http_code: number;
  };
}

interface LogoutResponse {
  success: boolean;
  message: string;
}

interface AuthResult {
  success: boolean;
  message: string;
  data?: any;
}

export class AuthService {
  static getUserName() {
    throw new Error('Method not implemented.');
  }
  private static token: string | null = null;
  private static userEmail: string | null = null;

  /**
   * Obtener encabezados con token Bearer (igual que antes)
   */
  static async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
  }

  /**
   * Realizar solicitud HTTP con reintentos automáticos (igual que antes)
   */
  private static async makeRequest(
    url: string, 
    options: RequestInit = {}, 
    retries = API_CONFIG.retries
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (retries > 0 && this.isRetryableError(error)) {
        console.log(`🔄 Reintentando solicitud... (${API_CONFIG.retries - retries + 1}/${API_CONFIG.retries})`);
        await this.delay(API_CONFIG.retryDelay);
        return this.makeRequest(url, options, retries - 1);
      }
      
      throw error;
    }
  }

  /**
   * Verificar si un error es reintentable (igual que antes)
   */
  private static isRetryableError(error: any): boolean {
    return (
      error.name === 'AbortError' ||
      error.name === 'TypeError' ||
      (error.message && error.message.includes('network'))
    );
  }

  /**
   * Retraso para reintentos (igual que antes)
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Login adaptado al nuevo endpoint FTGO
   */
  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Validación de entrada (igual que antes)
      if (!email || !password) {
        return {
          success: false,
          message: 'Email y contraseña son requeridos'
        };
      }

      if (!this.validateEmail(email)) {
        return {
          success: false,
          message: 'Formato de email inválido'
        };
      }

      console.log('🔐 Iniciando proceso de autenticación...');
      
      // Endpoint actualizado
      const response = await this.makeRequest(`${API_CONFIG.baseURL}/login`, {
        method: 'POST',
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      const data: LoginResponse = await response.json();
      
      // Respuesta adaptada al formato FTGO
      if (response.ok && data.success && data.data?.access_token) {
        await this.storeToken(data.data.access_token);
        await this.storeUserEmail(email.trim().toLowerCase());
        
        console.log('✅ Autenticación exitosa');
        return {
          success: true,
          message: data.message || 'Inicio de sesión exitoso',
          data: { 
            token: data.data.access_token, 
            email,
            name: data.data.name || 'Usuario' 
          }
        };
      }
      
      // Manejo de errores específicos de FTGO
      if (data.error?.http_code === 404) {
        return {
          success: false,
          message: 'Usuario dado de baja'
        };
      }
      
      console.log('❌ Autenticación fallida:', data.message);
      return {
        success: false,
        message: data.message || 'Credenciales inválidas'
      };
    } catch (error) {
      console.error('💥 Error en login:', error);
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Validar formato de email (igual que antes)
   */
  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Obtener mensaje de error (igual que antes)
   */
  private static getErrorMessage(error: any): string {
    if (error.name === 'AbortError') {
      return 'Tiempo de espera agotado. Verifique su conexión a internet.';
    }
    if (error.name === 'TypeError' || error.message?.includes('network')) {
      return 'Error de conexión. Verifique su internet e intente nuevamente.';
    }
    if (error.message?.includes('401')) {
      return 'Credenciales inválidas. Verifique su email y contraseña.';
    }
    if (error.message?.includes('403')) {
      return 'Acceso denegado. Contacte al administrador.';
    }
    if (error.message?.includes('500')) {
      return 'Error del servidor. Intente más tarde.';
    }
    return 'Error de conexión. Intente nuevamente.';
  }

  /**
   * Almacenar token de autenticación (igual que antes)
   */
  private static async storeToken(token: string): Promise<void> {
    this.token = token;
    
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        console.log('🔒 Token almacenado en localStorage');
      } catch (error) {
        console.error('❌ Error al almacenar token:', error);
      }
    }
    // TODO: Implementar almacenamiento seguro para móviles con SecureStore
  }

  /**
   * Almacenar email del usuario (igual que antes)
   */
  private static async storeUserEmail(email: string): Promise<void> {
    this.userEmail = email;
    
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(USER_EMAIL_KEY, email);
        console.log('👤 Email de usuario almacenado');
      } catch (error) {
        console.error('❌ Error al almacenar email:', error);
      }
    }
  }

  /**
   * Obtener el token de autenticación actual (igual que antes)
   */
  static async getToken(): Promise<string | null> {
    if (this.token) {
      return this.token;
    }
    
    if (Platform.OS === 'web') {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          this.token = token;
        }
        return token;
      } catch (error) {
        console.error('❌ Error al obtener token:', error);
        return null;
      }
    }
    
    return null;
  }

  /**
   * Obtener el email del usuario actual (igual que antes)
   */
  static async getUserEmail(): Promise<string | null> {
    if (this.userEmail) {
      return this.userEmail;
    }
    
    if (Platform.OS === 'web') {
      try {
        const email = localStorage.getItem(USER_EMAIL_KEY);
        if (email) {
          this.userEmail = email;
        }
        return email;
      } catch (error) {
        console.error('❌ Error al obtener email:', error);
        return null;
      }
    }
    
    return null;
  }

  /**
   * Verificar si el usuario está autenticado (igual que antes)
   */
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Realizar solicitud autenticada a la API (igual que antes)
   */
  static async authenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = await this.getAuthHeaders();
    const url = endpoint.startsWith('http') ? endpoint : `${API_CONFIG.baseURL}${endpoint}`;
    
    return this.makeRequest(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
  }

  /**
   * Logout adaptado al nuevo endpoint FTGO
   */
  static async logout(): Promise<AuthResult> {
    try {
      const token = await this.getToken();
      
      if (token) {
        console.log('🚪 Cerrando sesión en el servidor...');
        
        try {
          // Endpoint actualizado a GET
          const response = await this.makeRequest(`${API_CONFIG.baseURL}/logout`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data: LogoutResponse = await response.json();
            console.log('✅ Logout exitoso en servidor:', data.message);
          }
        } catch (error) {
          console.warn('⚠️ Error al cerrar sesión en servidor (continuando con logout local):', error);
        }
      }

      // Limpiar datos locales (igual que antes)
      this.clearLocalData();
      console.log('🧹 Datos locales limpiados');

      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (error) {
      console.error('💥 Error en logout:', error);
      
      // Limpiar datos locales incluso si falla
      this.clearLocalData();

      return {
        success: true, // Consideramos exitoso porque limpiamos datos locales
        message: 'Sesión cerrada localmente'
      };
    }
  }

  /**
   * Limpiar todos los datos de autenticación locales (igual que antes)
   */
  private static clearLocalData(): void {
    this.token = null;
    this.userEmail = null;
    
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_EMAIL_KEY);
      } catch (error) {
        console.error('❌ Error al limpiar datos locales:', error);
      }
    }
  }

  /**
   * Verificar estado de conexión de red (igual que antes)
   */
  static async checkNetworkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/health`, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Obtener información del usuario autenticado (igual que antes)
   */
  static async getUserInfo(): Promise<{
    name: string | null; email: string | null; isAuthenticated: boolean 
}> {
    const email = await this.getUserEmail();
    const isAuthenticated = await this.isAuthenticated();
    
    return {
      email,
      isAuthenticated
    };
  }
}