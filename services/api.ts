import { AuthService } from './auth';
import { QRParserService } from './qrParser';

// Configuración de la API
const API_CONFIG = {
  baseURL: 'https://api.xolotlcl.com/api',
  timeout: 15000,
  retries: 3,
  retryDelay: 1000,
};

// Tipos de respuesta de la API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

interface VerificationResult {
  valid: boolean;
  message: string;
  data?: any;
  timestamp?: string;
}

interface VenueCapacity {
  current: number;
  max: number;
  percentage: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: string;
}

interface CheckerData {
  id: string;
  name: string;
  scanned: number;
  verified: number;
  rejected: number;
  efficiency: number;
  lastActivity: string;
}

interface Wristband {
  id: string;
  name: string;
  status: 'verified' | 'pending' | 'rejected';
  verifiedAt?: string;
  verifiedBy?: string;
  evento?: string;
  zona?: string;
}

// Datos simulados para desarrollo y pruebas
const MOCK_DATA = {
  capacity: {
    current: 375,
    max: 500,
    percentage: 75,
    status: 'warning' as const,
    lastUpdated: new Date().toISOString()
  },
  checkers: [
    { 
      id: '1', 
      name: 'Juan Pérez', 
      scanned: 87, 
      verified: 82, 
      rejected: 5,
      efficiency: 94.3,
      lastActivity: new Date(Date.now() - 300000).toISOString() // 5 min ago
    },
    { 
      id: '2', 
      name: 'Ana García', 
      scanned: 65, 
      verified: 63, 
      rejected: 2,
      efficiency: 96.9,
      lastActivity: new Date(Date.now() - 120000).toISOString() // 2 min ago
    },
    { 
      id: '3', 
      name: 'Carlos López', 
      scanned: 92, 
      verified: 90, 
      rejected: 2,
      efficiency: 97.8,
      lastActivity: new Date(Date.now() - 60000).toISOString() // 1 min ago
    },
    { 
      id: '4', 
      name: 'María Rodríguez', 
      scanned: 105, 
      verified: 99, 
      rejected: 6,
      efficiency: 94.3,
      lastActivity: new Date(Date.now() - 180000).toISOString() // 3 min ago
    },
    { 
      id: '5', 
      name: 'Roberto Hernández', 
      scanned: 38, 
      verified: 36, 
      rejected: 2,
      efficiency: 94.7,
      lastActivity: new Date(Date.now() - 900000).toISOString() // 15 min ago
    }
  ],
  wristbands: [
    { 
      id: 'WB-123456', 
      name: 'Invitado VIP', 
      status: 'verified' as const,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Juan Pérez',
      evento: '1234',
      zona: '01'
    },
    { 
      id: 'WB-234567', 
      name: 'Entrada General', 
      status: 'verified' as const,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Ana García',
      evento: '1234',
      zona: '02'
    },
    { 
      id: 'WB-345678', 
      name: 'Invitado VIP', 
      status: 'pending' as const,
      evento: '1234',
      zona: '01'
    },
    { 
      id: 'WB-456789', 
      name: 'Entrada General', 
      status: 'rejected' as const,
      evento: '1234',
      zona: '02'
    },
    { 
      id: 'WB-567890', 
      name: 'Staff', 
      status: 'verified' as const,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Carlos López',
      evento: '1234',
      zona: '03'
    }
  ]
};

/**
 * Servicio API para gestión de datos de eventos y verificación de brazaletes
 * Incluye manejo robusto de errores y reintentos automáticos
 */
export class ApiService {
  private static requestCount = 0;
  private static lastRequestTime = 0;

  /**
   * Realizar solicitud HTTP con manejo de errores y reintentos
   */
  private static async makeRequest<T>(
    url: string,
    options: RequestInit = {},
    retries = API_CONFIG.retries
  ): Promise<ApiResponse<T>> {
    this.requestCount++;
    const requestId = this.requestCount;
    
    console.log(`🌐 [${requestId}] Iniciando solicitud: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);
      
      console.log(`📡 [${requestId}] Respuesta recibida: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        data,
        status: response.status
      };

    } catch (error) {
      clearTimeout(timeoutId);
      
      console.error(`💥 [${requestId}] Error en solicitud:`, error);
      
      // Reintentar en caso de error de red
      if (retries > 0 && this.isRetryableError(error)) {
        console.log(`🔄 [${requestId}] Reintentando... (${API_CONFIG.retries - retries + 1}/${API_CONFIG.retries})`);
        await this.delay(API_CONFIG.retryDelay);
        return this.makeRequest(url, options, retries - 1);
      }
      
      return {
        success: false,
        error: this.getErrorMessage(error),
        status: error.name === 'AbortError' ? 408 : 500
      };
    }
  }

  /**
   * Verificar si un error es reintentable
   */
  private static isRetryableError(error: any): boolean {
    return (
      error.name === 'AbortError' ||
      error.name === 'TypeError' ||
      (error.message && error.message.includes('network')) ||
      (error.message && error.message.includes('fetch'))
    );
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
      return 'No autorizado. Inicie sesión nuevamente.';
    }
    if (error.message?.includes('403')) {
      return 'Acceso denegado. Contacte al administrador.';
    }
    if (error.message?.includes('404')) {
      return 'Recurso no encontrado.';
    }
    if (error.message?.includes('500')) {
      return 'Error del servidor. Intente más tarde.';
    }
    return error.message || 'Error de conexión. Intente nuevamente.';
  }

  /**
   * Retraso para reintentos
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Simular solicitud API con retraso realista
   */
  private static async mockRequest<T>(data: T, delay?: number): Promise<T> {
    // Simular retraso de red (entre 300ms y 800ms)
    const requestDelay = delay || (Math.random() * 500 + 300);
    await new Promise(resolve => setTimeout(resolve, requestDelay));
    
    // Simular errores de red ocasionales (2% de probabilidad)
    if (Math.random() < 0.02) {
      throw new Error('Error de red simulado');
    }
    
    return data;
  }

  /**
   * Obtener capacidad actual del venue
   */
  static async getVenueCapacity(): Promise<VenueCapacity> {
    try {
      console.log('📊 Obteniendo capacidad del venue...');
      
      // TODO: Descomentar cuando el endpoint esté listo
      /*
      const response = await this.makeRequest<VenueCapacity>(`${API_CONFIG.baseURL}/venue/capacity`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Error al obtener capacidad del venue');
      */
      
      // Usar datos simulados por ahora
      const data = await this.mockRequest(MOCK_DATA.capacity);
      console.log('✅ Capacidad del venue obtenida:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error al obtener capacidad del venue:', error);
      throw error;
    }
  }

  /**
   * Obtener resumen de brazaletes escaneados por cada verificador
   */
  static async getCheckersSummary(): Promise<CheckerData[]> {
    try {
      console.log('👥 Obteniendo resumen de verificadores...');
      
      // TODO: Descomentar cuando el endpoint esté listo
      /*
      const response = await this.makeRequest<CheckerData[]>(`${API_CONFIG.baseURL}/checkers/summary`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Error al obtener resumen de verificadores');
      */
      
      // Usar datos simulados por ahora
      const data = await this.mockRequest(MOCK_DATA.checkers);
      console.log('✅ Resumen de verificadores obtenido:', data.length, 'verificadores');
      return data;
      
    } catch (error) {
      console.error('❌ Error al obtener resumen de verificadores:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de todos los brazaletes
   */
  static async getWristbands(): Promise<Wristband[]> {
    try {
      console.log('🎫 Obteniendo lista de brazaletes...');
      
      // TODO: Descomentar cuando el endpoint esté listo
      /*
      const response = await this.makeRequest<Wristband[]>(`${API_CONFIG.baseURL}/wristbands`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Error al obtener lista de brazaletes');
      */
      
      // Usar datos simulados por ahora
      const data = await this.mockRequest(MOCK_DATA.wristbands);
      console.log('✅ Lista de brazaletes obtenida:', data.length, 'brazaletes');
      return data;
      
    } catch (error) {
      console.error('❌ Error al obtener lista de brazaletes:', error);
      throw error;
    }
  }

  /**
   * Verificar un brazalete mediante código QR
   */
  static async verifyWristband(qrCode: string): Promise<VerificationResult> {
    try {
      console.log('🔍 Iniciando verificación de brazalete...');
      console.log('📱 Código QR recibido:', qrCode);

      // Analizar el código QR primero
      const parseResult = QRParserService.parseQRCode(qrCode);
      
      if (!parseResult.success) {
        console.error('❌ Error al analizar QR:', parseResult.error);
        return {
          valid: false,
          message: parseResult.error || 'Error al procesar código QR',
          timestamp: new Date().toISOString()
        };
      }

      const qrData = parseResult.data!;
      
      // Validar los datos analizados
      const validation = QRParserService.validateQRData(qrData);
      if (!validation.valid) {
        console.error('❌ Datos QR inválidos:', validation.errors);
        return {
          valid: false,
          message: `Datos QR inválidos: ${validation.errors.join(', ')}`,
          timestamp: new Date().toISOString()
        };
      }

      // Mostrar advertencias si las hay
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Advertencias en datos QR:', validation.warnings);
      }

      // Registrar datos analizados en consola (para desarrollo)
      QRParserService.logParsedData(qrData);

      // Formatear datos para API
      const apiData = await QRParserService.formatForAPI(qrData);
      console.log('📤 Datos formateados para API:', apiData);

      // TODO: Descomentar cuando el endpoint esté listo
      /*
      try {
        const response = await AuthService.authenticatedRequest('/verify-wristband', {
          method: 'POST',
          body: JSON.stringify(apiData)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log('✅ Respuesta del servidor:', result);
        
        return {
          valid: result.success || result.valid,
          message: result.message || 'Brazalete verificado correctamente',
          data: result.data,
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        console.error('💥 Error al verificar brazalete en servidor:', error);
        return {
          valid: false,
          message: 'Error de conexión con el servidor',
          timestamp: new Date().toISOString()
        };
      }
      */

      // Simular verificación por ahora
      await this.mockRequest(null, 800); // Simular retraso de API

      // Lógica de verificación simulada basada en datos analizados
      const isValid = qrData.evento.length === 4 && 
                     qrData.ubicacion.length === 4 && 
                     qrData.zona.length === 2 && 
                     qrData.numeroBrazalete.length === 8;
      
      if (isValid) {
        // Actualizar datos simulados para simular cambios de estado
        const existingWristband = MOCK_DATA.wristbands.find(w => w.id === qrData.numeroBrazalete);
        const userEmail = await AuthService.getUserEmail();
        
        if (existingWristband) {
          existingWristband.status = 'verified';
          existingWristband.verifiedAt = new Date().toISOString();
          existingWristband.verifiedBy = userEmail || 'Usuario Actual';
          existingWristband.evento = qrData.evento;
          existingWristband.zona = qrData.zona;
        } else {
          // Agregar nuevo brazalete si no se encuentra
          MOCK_DATA.wristbands.push({
            id: qrData.numeroBrazalete,
            name: `Evento ${qrData.evento} - Zona ${qrData.zona}`,
            status: 'verified',
            verifiedAt: new Date().toISOString(),
            verifiedBy: userEmail || 'Usuario Actual',
            evento: qrData.evento,
            zona: qrData.zona
          });
        }

        // Actualizar capacidad simulada
        MOCK_DATA.capacity.current = Math.min(MOCK_DATA.capacity.current + 1, MOCK_DATA.capacity.max);
        MOCK_DATA.capacity.percentage = Math.round((MOCK_DATA.capacity.current / MOCK_DATA.capacity.max) * 100);
        MOCK_DATA.capacity.lastUpdated = new Date().toISOString();
        
        // Actualizar estado basado en porcentaje
        if (MOCK_DATA.capacity.percentage < 70) {
          MOCK_DATA.capacity.status = 'normal';
        } else if (MOCK_DATA.capacity.percentage < 90) {
          MOCK_DATA.capacity.status = 'warning';
        } else {
          MOCK_DATA.capacity.status = 'critical';
        }

        console.log('✅ Verificación exitosa simulada');
        return {
          valid: true,
          message: `Brazalete ${qrData.numeroBrazalete} verificado correctamente para evento ${qrData.evento}, zona ${qrData.zona}`,
          data: {
            brazalete: qrData.numeroBrazalete,
            evento: qrData.evento,
            zona: qrData.zona,
            fecha: qrData.fecha,
            hora: qrData.hora
          },
          timestamp: new Date().toISOString()
        };
      } else {
        console.log('❌ Verificación fallida: datos inválidos');
        return {
          valid: false,
          message: 'Datos del brazalete no válidos o incompletos',
          timestamp: new Date().toISOString()
        };
      }

    } catch (error) {
      console.error('💥 Error general en verificación:', error);
      return {
        valid: false,
        message: 'Error interno al verificar brazalete',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Actualizar estado de un brazalete
   */
  static async updateWristbandStatus(wristbandId: string, status: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`🔄 Actualizando estado de brazalete ${wristbandId} a ${status}...`);
      
      // TODO: Descomentar cuando el endpoint esté listo
      /*
      const response = await AuthService.authenticatedRequest('/wristbands/update-status', {
        method: 'PUT',
        body: JSON.stringify({ wristbandId, status })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: result.success };
      */

      // Simular actualización
      await this.mockRequest(null, 300);

      const wristband = MOCK_DATA.wristbands.find(w => w.id === wristbandId);
      if (wristband) {
        wristband.status = status as any;
        console.log('✅ Estado de brazalete actualizado');
        return { success: true };
      }

      console.log('❌ Brazalete no encontrado');
      return { success: false, error: 'Brazalete no encontrado' };
      
    } catch (error) {
      console.error('💥 Error al actualizar estado de brazalete:', error);
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  /**
   * Obtener estadísticas de la API
   */
  static getApiStats(): {
    requestCount: number;
    lastRequestTime: number;
    uptime: number;
  } {
    return {
      requestCount: this.requestCount,
      lastRequestTime: this.lastRequestTime,
      uptime: Date.now() - this.lastRequestTime
    };
  }

  /**
   * Verificar estado de salud de la API
   */
  static async checkApiHealth(): Promise<{ healthy: boolean; latency?: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      // TODO: Descomentar cuando el endpoint esté listo
      /*
      const response = await this.makeRequest(`${API_CONFIG.baseURL}/health`);
      const latency = Date.now() - startTime;
      
      return {
        healthy: response.success,
        latency,
        error: response.error
      };
      */
      
      // Simular verificación de salud
      await this.mockRequest(null, 100);
      const latency = Date.now() - startTime;
      
      return {
        healthy: true,
        latency
      };
      
    } catch (error) {
      return {
        healthy: false,
        error: this.getErrorMessage(error)
      };
    }
  }
}