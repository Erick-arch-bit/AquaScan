import { Platform } from 'react-native';

// Claves de almacenamiento para token de autenticación y datos de usuario
const AUTH_TOKEN_KEY = 'qrscanner_auth_token';
const USER_EMAIL_KEY = 'qrscanner_user_email';

// Configuración de la API
const API_CONFIG = {
  baseURL: 'https://api.xolotlcl.com/api',
  timeout: 15000,
  retries: 3,
  retryDelay: 1000,
};

// Tipos de respuesta de la API
interface LoginResponse {
  status: number;
  access_token: string;
  message?: string;
}

interface LogoutResponse {
  status: number;
  msg: string;
}

interface AuthResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Servicio de autenticación para login y gestión de tokens
 * Maneja autenticación segura con la API externa
 */
export class AuthService {
  private static token: string | null = null;
  private static userEmail: string | null = null;

  /**
   * Obtener encabezados con token Bearer
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
   * Realizar solicitud HTTP con reintentos automáticos
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
      
      // Reintentar en caso de error de red
      if (retries > 0 && this.isRetryableError(error)) {
        console.log(`🔄 Reintentando solicitud... (${API_CONFIG.retries - retries + 1}/${API_CONFIG.retries})`);
        await this.delay(API_CONFIG.retryDelay);
        return this.makeRequest(url, options, retries - 1);
      }
      
      throw error;
    }
  }

  /**
   * Verificar si un error es reintentable
   */
  private static isRetryableError(error: any): boolean {
    return (
      error.name === 'AbortError' ||
      error.name === 'TypeError' ||
      (error.message && error.message.includes('network'))
    );
  }

  /**
   * Retraso para reintentos
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Intentar iniciar sesión con email y contraseña
   */
  static async login(email: string, password: string): Promise<AuthResult> {
    try {
      // Validar entrada
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
      
      const response = await this.makeRequest(`${API_CONFIG.baseURL}/loginXcl`, {
        method: 'POST',
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(), 
          password 
        }),
      });

      const data: LoginResponse = await response.json();
      
      if (response.ok && data.status === 1 && data.access_token) {
        await this.storeToken(data.access_token);
        await this.storeUserEmail(email.trim().toLowerCase());
        
        console.log('✅ Autenticación exitosa');
        return {
          success: true,
          message: data.message || 'Inicio de sesión exitoso',
          data: { token: data.access_token, email }
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
   * Validar formato de email
   */
  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Obtener mensaje de error amigable
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
   * Almacenar token de autenticación de forma segura
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
   * Almacenar email del usuario
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
   * Obtener el token de autenticación actual
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
   * Obtener el email del usuario actual
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
   * Verificar si el usuario está autenticado
   */
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Realizar solicitud autenticada a la API
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
   * Cerrar sesión del usuario actual
   */
  static async logout(): Promise<AuthResult> {
    try {
      const token = await this.getToken();
      
      if (token) {
        console.log('🚪 Cerrando sesión en el servidor...');
        
        try {
          const response = await this.makeRequest(`${API_CONFIG.baseURL}/logoutXcl`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data: LogoutResponse = await response.json();
            console.log('✅ Logout exitoso en servidor:', data.msg);
          }
        } catch (error) {
          console.warn('⚠️ Error al cerrar sesión en servidor (continuando con logout local):', error);
        }
      }

      // Limpiar datos locales siempre
      this.clearLocalData();
      console.log('🧹 Datos locales limpiados');

      return {
        success: true,
        message: 'Sesión cerrada exitosamente'
      };
    } catch (error) {
      console.error('💥 Error en logout:', error);
      
      // Limpiar datos locales incluso si falla la solicitud al servidor
      this.clearLocalData();

      return {
        success: true, // Consideramos exitoso porque limpiamos datos locales
        message: 'Sesión cerrada localmente'
      };
    }
  }

  /**
   * Limpiar todos los datos de autenticación locales
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
   * Verificar estado de conexión de red
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
   * Obtener información del usuario autenticado
   */
  static async getUserInfo(): Promise<{ email: string | null; isAuthenticated: boolean }> {
    const email = await this.getUserEmail();
    const isAuthenticated = await this.isAuthenticated();
    
    return {
      email,
      isAuthenticated
    };
  }
}