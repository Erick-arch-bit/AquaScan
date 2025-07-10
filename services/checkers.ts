/**
 * Controlador para gestión de checadores y aforo del venue
 * Maneja la comunicación con el endpoint de checadores de la API
 */

import { AuthService } from './auth';

// Configuración específica del controlador
const CHECKERS_CONFIG = {
  endpoint: '/checkers',
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
};

// Tipos específicos para checadores
export interface CheckerData {
  id: number;
  user_id: string;
  scan: string;
  verified: string;
  rejected: string;
  created_at: string;
  updated_at: string;
}

export interface VenueCapacityData {
  ocupacion: number;
  actual: number;
  capacidad: number;
  aforo: string;
}

export interface CheckersResponse {
  success: boolean;
  message: string;
  data: {
    ocupacion: number;
    actual: number;
    capacidad: number;
    aforo: string;
    checkers: CheckerData[];
  };
}

export interface ProcessedCheckerData {
  id: string;
  user_id: string;
  name: string;
  scanned: number;
  verified: number;
  rejected: number;
  lastActivity: string;
  created_at: string;
  updated_at: string;
}

export interface ProcessedVenueCapacity {
  current: number;
  max: number;
  percentage: number;
  status: 'normal' | 'warning' | 'critical';
  statusText: string;
  lastUpdated: string;
}

/**
 * Controlador para operaciones relacionadas con checadores
 */
export class CheckersController {
  private static requestCount = 0;

  /**
   * Realizar solicitud HTTP con manejo de errores y reintentos
   */
  private static async makeRequest<T>(
    retries = CHECKERS_CONFIG.retries
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    this.requestCount++;
    const requestId = this.requestCount;
    
    console.log(`🔍 [Checkers-${requestId}] Iniciando solicitud a endpoint de checadores`);
    
    try {
      const response = await AuthService.authenticatedRequest(
        CHECKERS_CONFIG.endpoint,
        {
          method: 'GET',
          signal: AbortSignal.timeout(CHECKERS_CONFIG.timeout)
        }
      );

      console.log(`📡 [Checkers-${requestId}] Respuesta recibida: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: T = await response.json();
      console.log(`✅ [Checkers-${requestId}] Datos procesados exitosamente`);
      
      return {
        success: true,
        data
      };

    } catch (error) {
      console.error(`💥 [Checkers-${requestId}] Error en solicitud:`, error);
      
      // Reintentar en caso de error de red
      if (retries > 0 && this.isRetryableError(error)) {
        console.log(`🔄 [Checkers-${requestId}] Reintentando... (${CHECKERS_CONFIG.retries - retries + 1}/${CHECKERS_CONFIG.retries})`);
        await this.delay(CHECKERS_CONFIG.retryDelay);
        return this.makeRequest(retries - 1);
      }
      
      return {
        success: false,
        error: this.getErrorMessage(error)
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
      error.name === 'TimeoutError' ||
      (error.message && error.message.includes('network')) ||
      (error.message && error.message.includes('fetch'))
    );
  }

  /**
   * Obtener mensaje de error amigable
   */
  private static getErrorMessage(error: any): string {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
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
      return 'Endpoint no encontrado.';
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
   * Obtener datos de checadores y aforo del venue
   */
  static async getCheckersData(): Promise<{
    success: boolean;
    venueCapacity?: ProcessedVenueCapacity;
    checkers?: ProcessedCheckerData[];
    error?: string;
  }> {
    try {
      console.log('📊 Obteniendo datos de checadores y aforo...');
      
      const result = await this.makeRequest<CheckersResponse>();
      
      if (!result.success || !result.data) {
        return {
          success: false,
          error: result.error || 'No se pudieron obtener los datos'
        };
      }

      const response = result.data;
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.message || 'Respuesta inválida del servidor'
        };
      }

      // Procesar datos de capacidad del venue
      const venueCapacity = this.processVenueCapacity(response.data);
      
      // Procesar datos de checadores
      const checkers = this.processCheckersData(response.data.checkers);

      console.log('✅ Datos de checadores procesados exitosamente');
      console.log(`📈 Aforo: ${venueCapacity.current}/${venueCapacity.max} (${venueCapacity.percentage}%)`);
      console.log(`👥 Checadores: ${checkers.length} activos`);

      return {
        success: true,
        venueCapacity,
        checkers
      };

    } catch (error) {
      console.error('❌ Error al obtener datos de checadores:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Procesar datos de capacidad del venue
   */
  private static processVenueCapacity(data: VenueCapacityData & { checkers: CheckerData[] }): ProcessedVenueCapacity {
    const percentage = Math.round((data.actual / data.capacidad) * 100);
    
    let status: 'normal' | 'warning' | 'critical' = 'normal';
    let statusText = 'Normal';
    
    if (percentage >= 90) {
      status = 'critical';
      statusText = 'Crítico';
    } else if (percentage >= 70) {
      status = 'warning';
      statusText = 'Atención';
    }

    return {
      current: data.actual,
      max: data.capacidad,
      percentage,
      status,
      statusText: data.aforo || statusText,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Procesar datos de checadores
   */
  private static processCheckersData(checkers: CheckerData[]): ProcessedCheckerData[] {
    return checkers.map(checker => ({
      id: checker.id.toString(),
      user_id: checker.user_id,
      name: `Verificador ${checker.user_id}`, // Se puede mejorar con datos reales del usuario
      scanned: parseInt(checker.scan) || 0,
      verified: parseInt(checker.verified) || 0,
      rejected: parseInt(checker.rejected) || 0,
      lastActivity: checker.updated_at,
      created_at: checker.created_at,
      updated_at: checker.updated_at
    }));
  }

  /**
   * Obtener solo la capacidad del venue
   */
  static async getVenueCapacity(): Promise<{
    success: boolean;
    data?: ProcessedVenueCapacity;
    error?: string;
  }> {
    const result = await this.getCheckersData();
    
    if (!result.success) {
      return {
        success: false,
        error: result.error
      };
    }

    return {
      success: true,
      data: result.venueCapacity
    };
  }

  /**
   * Obtener solo los datos de checadores
   */
  static async getCheckersSummary(): Promise<{
    success: boolean;
    data?: ProcessedCheckerData[];
    error?: string;
  }> {
    const result = await this.getCheckersData();
    
    if (!result.success) {
      return {
        success: false,
        error: result.error
      };
    }

    return {
      success: true,
      data: result.checkers
    };
  }

  /**
   * Obtener estadísticas generales
   */
  static async getStatistics(): Promise<{
    success: boolean;
    data?: {
      totalCheckers: number;
      totalScanned: number;
      totalVerified: number;
      totalRejected: number;
      averagePerformance: number;
    };
    error?: string;
  }> {
    const result = await this.getCheckersData();
    
    if (!result.success || !result.checkers) {
      return {
        success: false,
        error: result.error
      };
    }

    const checkers = result.checkers;
    const totalScanned = checkers.reduce((sum, checker) => sum + checker.scanned, 0);
    const totalVerified = checkers.reduce((sum, checker) => sum + checker.verified, 0);
    const totalRejected = checkers.reduce((sum, checker) => sum + checker.rejected, 0);
    const averagePerformance = totalScanned > 0 ? Math.round((totalVerified / totalScanned) * 100) : 0;

    return {
      success: true,
      data: {
        totalCheckers: checkers.length,
        totalScanned,
        totalVerified,
        totalRejected,
        averagePerformance
      }
    };
  }

  /**
   * Verificar salud del endpoint
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const result = await this.makeRequest<CheckersResponse>();
      return result.success;
    } catch {
      return false;
    }
  }
}