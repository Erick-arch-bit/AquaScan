import { Platform } from 'react-native';

// Storage key for auth token and user data
const AUTH_TOKEN_KEY = 'qrscanner_auth_token';
const USER_EMAIL_KEY = 'qrscanner_user_email';
const API_URL = 'https://api.xolotlcl.com/api';

/**
 * Authentication service for login and token management
 */
export class AuthService {
  private static token: string | null = null;
  private static userEmail: string | null = null;

  /**
   * Get headers with Bearer token
   */
  static async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  /**
   * Attempt to log in with email and password
   */
  static async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_URL}/loginXcl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.status === 1 && data.access_token) {
        await this.storeToken(data.access_token);
        await this.storeUserEmail(email);
        return {
          success: true,
          message: 'Inicio de sesión exitoso'
        };
      }
      
      return {
        success: false,
        message: 'Credenciales inválidas'
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  }

  /**
   * Store authentication token
   */
  private static async storeToken(token: string): Promise<void> {
    this.token = token;
    
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
      } catch (error) {
        console.error('Failed to store auth token:', error);
      }
    }
  }

  /**
   * Store user email
   */
  private static async storeUserEmail(email: string): Promise<void> {
    this.userEmail = email;
    
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(USER_EMAIL_KEY, email);
      } catch (error) {
        console.error('Failed to store user email:', error);
      }
    }
  }

  /**
   * Get the current authentication token
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
        console.error('Failed to get auth token:', error);
        return null;
      }
    }
    
    return null;
  }

  /**
   * Get the current user's email
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
        console.error('Failed to get user email:', error);
        return null;
      }
    }
    
    return null;
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  /**
   * Make an authenticated API request
   */
  static async authenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const headers = await this.getAuthHeaders();
    return fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });
  }

  /**
   * Log out the current user
   */
  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const token = await this.getToken();
      if (token) {
        const response = await fetch(`${API_URL}/logoutXcl`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        // Clear local data regardless of server response
        this.clearLocalData();

        if (!response.ok) {
          return {
            success: true, // Still consider it successful since we cleared local data
            message: 'Sesión cerrada localmente'
          };
        }

        const data = await response.json();
        return {
          success: data.status === 1,
          message: data.msg || 'Sesión finalizada'
        };
      }

      return {
        success: false,
        message: 'No hay sesión activa'
      };
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Clear local data even if the server request fails
      this.clearLocalData();

      return {
        success: true, // Still consider it successful since we cleared local data
        message: 'Sesión cerrada localmente'
      };
    }
  }

  /**
   * Clear all local authentication data
   */
  private static clearLocalData(): void {
    this.token = null;
    this.userEmail = null;
    if (Platform.OS === 'web') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(USER_EMAIL_KEY);
    }
  }
}