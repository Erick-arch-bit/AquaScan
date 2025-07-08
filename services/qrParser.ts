import { AuthService } from './auth';

/**
 * Servicio de análisis de códigos QR
 * Maneja el análisis y validación de cadenas de códigos QR
 * Formato: Evento/Ubicación/Zona/Fecha/Hora/No.brazalete
 */

export interface QRData {
  evento: string;           // 4 dígitos - Código del evento
  ubicacion: string;        // 4 dígitos - Código de ubicación
  zona: string;            // 2 dígitos - Código de zona
  fecha: string;           // Fecha del evento
  hora: string;            // Hora del evento
  numeroBrazalete: string; // 8 dígitos - Número único del brazalete
  raw: string;             // Cadena original completa
}

export interface QRParseResult {
  success: boolean;
  data?: QRData;
  error?: string;
  errorCode?: string;
}

export interface QRValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface APISubmissionData {
  evento: string;
  ubicacion: string;
  zona: string;
  fecha: string;
  hora: string;
  numero_brazalete: string;
  cadena_original: string;
  timestamp_procesamiento: string;
  usuario_verificador?: string;
}

/**
 * Códigos de error para diferentes tipos de fallos
 */
export enum QRErrorCodes {
  EMPTY_STRING = 'EMPTY_STRING',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_FIELD_COUNT = 'INVALID_FIELD_COUNT',
  INVALID_EVENTO = 'INVALID_EVENTO',
  INVALID_UBICACION = 'INVALID_UBICACION',
  INVALID_ZONA = 'INVALID_ZONA',
  INVALID_FECHA = 'INVALID_FECHA',
  INVALID_HORA = 'INVALID_HORA',
  INVALID_BRAZALETE = 'INVALID_BRAZALETE',
  PARSING_ERROR = 'PARSING_ERROR'
}

export class QRParserService {
  private static readonly EXPECTED_PARTS = 6;
  private static readonly SEPARATOR = '/';
  
  // Expresiones regulares para validación
  private static readonly REGEX_PATTERNS = {
    evento: /^\d{4}$/,           // Exactamente 4 dígitos
    ubicacion: /^\d{4}$/,        // Exactamente 4 dígitos
    zona: /^\d{2}$/,             // Exactamente 2 dígitos
    numeroBrazalete: /^\d{8}$/,  // Exactamente 8 dígitos
    fecha: /^\d{4}-\d{2}-\d{2}$/, // Formato YYYY-MM-DD
    hora: /^\d{2}:\d{2}$/        // Formato HH:MM
  };

  /**
   * Analizar cadena de código QR en datos estructurados
   * Formato esperado: Evento/Ubicación/Zona/Fecha/Hora/No.brazalete
   * 
   * Especificaciones:
   * - Evento: 4 dígitos
   * - Ubicación: 4 dígitos
   * - Zona: 2 dígitos
   * - Fecha: Formato YYYY-MM-DD
   * - Hora: Formato HH:MM
   * - No.brazalete: 8 dígitos
   */
  static parseQRCode(qrString: string): QRParseResult {
    try {
      console.log('🔍 Iniciando análisis de código QR...');
      console.log('📱 Cadena recibida:', qrString);

      // Validación inicial
      const cleanString = qrString?.trim();
      
      if (!cleanString) {
        return {
          success: false,
          error: 'Cadena QR vacía o nula',
          errorCode: QRErrorCodes.EMPTY_STRING
        };
      }

      // Dividir por el separador
      const parts = cleanString.split(this.SEPARATOR);
      
      // Validar número de partes
      if (parts.length !== this.EXPECTED_PARTS) {
        return {
          success: false,
          error: `Formato QR inválido. Se esperaban ${this.EXPECTED_PARTS} partes separadas por '${this.SEPARATOR}', se encontraron ${parts.length}. Formato esperado: Evento/Ubicación/Zona/Fecha/Hora/No.brazalete`,
          errorCode: QRErrorCodes.INVALID_FIELD_COUNT
        };
      }

      // Extraer y limpiar cada parte
      const [
        evento,
        ubicacion,
        zona,
        fecha,
        hora,
        numeroBrazalete
      ] = parts.map(part => part.trim());

      console.log('📊 Partes extraídas:', { evento, ubicacion, zona, fecha, hora, numeroBrazalete });

      // Validar cada campo
      const validationResult = this.validateFields({
        evento,
        ubicacion,
        zona,
        fecha,
        hora,
        numeroBrazalete
      });

      if (!validationResult.valid) {
        return {
          success: false,
          error: validationResult.errors.join(', '),
          errorCode: this.getErrorCodeFromValidation(validationResult.errors[0])
        };
      }

      // Crear objeto de datos estructurados
      const qrData: QRData = {
        evento,
        ubicacion,
        zona,
        fecha,
        hora,
        numeroBrazalete,
        raw: cleanString
      };

      console.log('✅ Análisis de QR exitoso');
      return {
        success: true,
        data: qrData
      };

    } catch (error) {
      console.error('💥 Error al procesar QR:', error);
      return {
        success: false,
        error: `Error al procesar QR: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        errorCode: QRErrorCodes.PARSING_ERROR
      };
    }
  }

  /**
   * Validar campos individuales según especificaciones
   */
  private static validateFields(fields: {
    evento: string;
    ubicacion: string;
    zona: string;
    fecha: string;
    hora: string;
    numeroBrazalete: string;
  }): QRValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar evento (4 dígitos)
    if (!fields.evento) {
      errors.push('Campo Evento vacío (posición 1)');
    } else if (!this.REGEX_PATTERNS.evento.test(fields.evento)) {
      errors.push(`Campo Evento debe tener exactamente 4 dígitos, recibido: "${fields.evento}" (${fields.evento.length} caracteres)`);
    }

    // Validar ubicación (4 dígitos)
    if (!fields.ubicacion) {
      errors.push('Campo Ubicación vacío (posición 2)');
    } else if (!this.REGEX_PATTERNS.ubicacion.test(fields.ubicacion)) {
      errors.push(`Campo Ubicación debe tener exactamente 4 dígitos, recibido: "${fields.ubicacion}" (${fields.ubicacion.length} caracteres)`);
    }

    // Validar zona (2 dígitos)
    if (!fields.zona) {
      errors.push('Campo Zona vacío (posición 3)');
    } else if (!this.REGEX_PATTERNS.zona.test(fields.zona)) {
      errors.push(`Campo Zona debe tener exactamente 2 dígitos, recibido: "${fields.zona}" (${fields.zona.length} caracteres)`);
    }

    // Validar fecha
    if (!fields.fecha) {
      errors.push('Campo Fecha vacío (posición 4)');
    } else {
      if (!this.REGEX_PATTERNS.fecha.test(fields.fecha)) {
        warnings.push(`Formato de fecha no estándar: "${fields.fecha}" (se esperaba YYYY-MM-DD)`);
      }
      
      // Validar que la fecha sea válida
      const dateObj = new Date(fields.fecha);
      if (isNaN(dateObj.getTime())) {
        errors.push(`Fecha inválida: "${fields.fecha}"`);
      }
    }

    // Validar hora
    if (!fields.hora) {
      errors.push('Campo Hora vacío (posición 5)');
    } else {
      if (!this.REGEX_PATTERNS.hora.test(fields.hora)) {
        warnings.push(`Formato de hora no estándar: "${fields.hora}" (se esperaba HH:MM)`);
      }
      
      // Validar que la hora sea válida (0-23:0-59)
      const [hours, minutes] = fields.hora.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        errors.push(`Hora inválida: "${fields.hora}"`);
      }
    }

    // Validar número de brazalete (8 dígitos)
    if (!fields.numeroBrazalete) {
      errors.push('Número de brazalete vacío (posición 6)');
    } else if (!this.REGEX_PATTERNS.numeroBrazalete.test(fields.numeroBrazalete)) {
      errors.push(`Número de brazalete debe tener exactamente 8 dígitos, recibido: "${fields.numeroBrazalete}" (${fields.numeroBrazalete.length} caracteres)`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Obtener código de error basado en el mensaje de validación
   */
  private static getErrorCodeFromValidation(errorMessage: string): string {
    if (errorMessage.includes('Evento')) return QRErrorCodes.INVALID_EVENTO;
    if (errorMessage.includes('Ubicación')) return QRErrorCodes.INVALID_UBICACION;
    if (errorMessage.includes('Zona')) return QRErrorCodes.INVALID_ZONA;
    if (errorMessage.includes('Fecha')) return QRErrorCodes.INVALID_FECHA;
    if (errorMessage.includes('Hora')) return QRErrorCodes.INVALID_HORA;
    if (errorMessage.includes('brazalete')) return QRErrorCodes.INVALID_BRAZALETE;
    return QRErrorCodes.INVALID_FORMAT;
  }

  /**
   * Validar datos QR analizados
   */
  static validateQRData(data: QRData): QRValidationResult {
    return this.validateFields({
      evento: data.evento,
      ubicacion: data.ubicacion,
      zona: data.zona,
      fecha: data.fecha,
      hora: data.hora,
      numeroBrazalete: data.numeroBrazalete
    });
  }

  /**
   * Formatear datos QR para envío a la API
   */
  static async formatForAPI(data: QRData): Promise<APISubmissionData> {
    const userEmail = await AuthService.getUserEmail();
    
    return {
      evento: data.evento,
      ubicacion: data.ubicacion,
      zona: data.zona,
      fecha: data.fecha,
      hora: data.hora,
      numero_brazalete: data.numeroBrazalete,
      cadena_original: data.raw,
      timestamp_procesamiento: new Date().toISOString(),
      usuario_verificador: userEmail || 'usuario_desconocido'
    };
  }

  /**
   * Registrar datos analizados en consola con información detallada de campos
   */
  static logParsedData(data: QRData): void {
    console.log('🔍 === DATOS QR DESCOMPUESTOS ===');
    console.log('📱 Cadena Original:', data.raw);
    console.log('🎪 Evento (4 dígitos):', data.evento);
    console.log('📍 Ubicación (4 dígitos):', data.ubicacion);
    console.log('🏷️ Zona (2 dígitos):', data.zona);
    console.log('📅 Fecha:', data.fecha);
    console.log('⏰ Hora:', data.hora);
    console.log('🎫 N. Brazalete (8 dígitos):', data.numeroBrazalete);
    console.log('⏰ Procesado:', new Date().toLocaleString());
    console.log('================================');
    
    // Registro adicional para depuración
    const validation = this.validateQRData(data);
    console.log('🔧 === VALIDACIÓN DE FORMATO ===');
    console.log('📊 Total de campos:', this.EXPECTED_PARTS);
    console.log('✅ Estado de validación:', validation.valid ? 'VÁLIDO' : 'INVÁLIDO');
    
    if (validation.errors.length > 0) {
      console.log('❌ Errores:', validation.errors);
    }
    
    if (validation.warnings.length > 0) {
      console.log('⚠️ Advertencias:', validation.warnings);
    }
    
    console.log('✅ Validaciones:', [
      this.REGEX_PATTERNS.evento.test(data.evento) ? '✓ Evento (4 dígitos)' : `✗ Evento (${data.evento.length} chars)`,
      this.REGEX_PATTERNS.ubicacion.test(data.ubicacion) ? '✓ Ubicación (4 dígitos)' : `✗ Ubicación (${data.ubicacion.length} chars)`,
      this.REGEX_PATTERNS.zona.test(data.zona) ? '✓ Zona (2 dígitos)' : `✗ Zona (${data.zona.length} chars)`,
      this.REGEX_PATTERNS.fecha.test(data.fecha) ? '✓ Fecha (YYYY-MM-DD)' : '⚠ Fecha (formato no estándar)',
      this.REGEX_PATTERNS.hora.test(data.hora) ? '✓ Hora (HH:MM)' : '⚠ Hora (formato no estándar)',
      this.REGEX_PATTERNS.numeroBrazalete.test(data.numeroBrazalete) ? '✓ N.Brazalete (8 dígitos)' : `✗ N.Brazalete (${data.numeroBrazalete.length} chars)`
    ].join(', '));
    console.log('===================================');
  }

  /**
   * Obtener descripciones de campos para depuración
   */
  static getFieldDescriptions(): Record<string, string> {
    return {
      evento: 'Código del evento (4 dígitos numéricos)',
      ubicacion: 'Código de ubicación (4 dígitos numéricos)', 
      zona: 'Código de zona (2 dígitos numéricos)',
      fecha: 'Fecha del evento (formato YYYY-MM-DD)',
      hora: 'Hora del evento (formato HH:MM)',
      numeroBrazalete: 'Número único del brazalete (8 dígitos numéricos)'
    };
  }

  /**
   * Probar analizador QR con datos de muestra
   */
  static testParser(): void {
    console.log('🧪 === PRUEBA DEL ANALIZADOR QR ===');
    
    const testCases = [
      // Casos válidos
      '1234/5678/01/2024-01-15/10:30/12345678',
      '9876/5432/99/2024-01-16/14:00/87654321',
      '0001/0002/03/2024-01-17/20:15/11111111',
      
      // Casos inválidos para probar validación
      '123/5678/01/2024-01-15/10:30/12345678',  // Evento: 3 dígitos
      '1234/567/01/2024-01-15/10:30/12345678',  // Ubicación: 3 dígitos
      '1234/5678/1/2024-01-15/10:30/12345678',  // Zona: 1 dígito
      '1234/5678/01/2024-01-15/10:30/1234567',  // Brazalete: 7 dígitos
      '1234/5678/01/fecha/10:30/12345678',      // Fecha inválida
      '1234/5678/01/2024-01-15/25:30/12345678', // Hora inválida
    ];

    testCases.forEach((testCase, index) => {
      console.log(`\n📝 Caso de prueba ${index + 1}:`);
      console.log('Entrada:', testCase);
      
      const result = this.parseQRCode(testCase);
      if (result.success && result.data) {
        console.log('✅ Análisis exitoso');
        this.logParsedData(result.data);
      } else {
        console.log('❌ Error:', result.error);
        console.log('🔧 Código de error:', result.errorCode);
      }
    });
    
    console.log('===============================');
  }

  /**
   * Generar código QR de muestra para pruebas
   */
  static generateSampleQR(): string {
    const evento = Math.floor(1000 + Math.random() * 9000).toString(); // 4 dígitos
    const ubicacion = Math.floor(1000 + Math.random() * 9000).toString(); // 4 dígitos
    const zona = Math.floor(10 + Math.random() * 90).toString(); // 2 dígitos
    const fecha = '2024-01-15';
    const hora = '10:30';
    const numeroBrazalete = Math.floor(10000000 + Math.random() * 90000000).toString(); // 8 dígitos
    
    return `${evento}/${ubicacion}/${zona}/${fecha}/${hora}/${numeroBrazalete}`;
  }

  /**
   * Obtener estadísticas de análisis
   */
  static getParsingStats(results: QRParseResult[]): {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
    errorBreakdown: Record<string, number>;
  } {
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) * 100 : 0;
    
    const errorBreakdown: Record<string, number> = {};
    results.filter(r => !r.success).forEach(r => {
      const errorCode = r.errorCode || 'UNKNOWN';
      errorBreakdown[errorCode] = (errorBreakdown[errorCode] || 0) + 1;
    });

    return {
      total,
      successful,
      failed,
      successRate,
      errorBreakdown
    };
  }
}