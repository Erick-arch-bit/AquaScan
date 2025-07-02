
// Mock data for testing
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
    { 
      id: 'WB-234567', 
      name: 'Entrada General', 
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Ana García' 
    },
    { 
      id: 'WB-345678', 
      name: 'Invitado VIP', 
      status: 'pending'
    },
    { 
      id: 'WB-456789', 
      name: 'Entrada General', 
      status: 'rejected'
    },
    { 
      id: 'WB-567890', 
      name: 'Staff', 
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'Carlos López' 
    }
  ]
};

/**
 * Mock API service for development and testing
 */
export class ApiService {
  /**
   * Simulates an API request with a delay
   */
  private static async mockRequest<T>(data: T): Promise<T> {
    // Simulate network delay (between 300ms and 800ms)
    const delay = Math.random() * 500 + 300;
    await new Promise(resolve => setTimeout(resolve, delay));
    return data;
  }

  /**
   * Get current venue capacity
   */
  static async getVenueCapacity() {
    return this.mockRequest(MOCK_DATA.capacity);
  }

  /**
   * Get summary of wristbands scanned by each checker
   */
  static async getCheckersSummary() {
    return this.mockRequest(MOCK_DATA.checkers);
  }

  /**
   * Get list of all wristbands
   */
  static async getWristbands() {
    return this.mockRequest(MOCK_DATA.wristbands);
  }

  /**
   * Verify a wristband by QR code
   */
  static async verifyWristband(qrCode: string) {
    await this.mockRequest(null);

    // Simulate verification logic
    const isValid = qrCode && !qrCode.includes('invalid');
    
    if (isValid) {
      // Update mock data to simulate state changes
      const wristband = MOCK_DATA.wristbands.find(w => w.id === qrCode);
      if (wristband) {
        wristband.status = 'verified';
        wristband.verifiedAt = new Date().toISOString();
        wristband.verifiedBy = 'Current User';
      }
    }

    return {
      valid: isValid,
      message: isValid 
        ? 'Brazalete verificado correctamente' 
        : 'Brazalete no válido o ya escaneado'
    };
  }

  /**
   * Update a wristband's status
   */
  static async updateWristbandStatus(wristbandId: string, status: string) {
    await this.mockRequest(null);

    const wristband = MOCK_DATA.wristbands.find(w => w.id === wristbandId);
    if (wristband) {
      wristband.status = status;
      return { success: true };
    }

    return { success: false, error: 'Wristband not found' };
  }
}