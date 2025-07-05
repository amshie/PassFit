import { Alert } from 'react-native';

export interface QRScanResult {
  type: string;
  data: string;
  timestamp: Date;
}

export interface WorkoutQRData {
  equipmentId: string;
  equipmentName: string;
  workoutType: string;
  gymLocation?: string;
}

export class QRScannerService {
  /**
   * Process scanned QR code data
   */
  static async processQRCode(scanResult: QRScanResult): Promise<WorkoutQRData | null> {
    try {
      // Try to parse as JSON first (for structured workout QR codes)
      const parsedData = JSON.parse(scanResult.data);
      
      if (this.isWorkoutQRCode(parsedData)) {
        return {
          equipmentId: parsedData.equipmentId || parsedData.id,
          equipmentName: parsedData.equipmentName || parsedData.name || 'Unbekanntes Gerät',
          workoutType: parsedData.workoutType || parsedData.type || 'Standard',
          gymLocation: parsedData.gymLocation || parsedData.location,
        };
      }
      
      return null;
    } catch (error) {
      // If not JSON, try to extract equipment info from plain text
      return this.parseTextQRCode(scanResult.data);
    }
  }

  /**
   * Check if parsed data is a valid workout QR code
   */
  private static isWorkoutQRCode(data: any): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      (data.equipmentId || data.id) &&
      (data.equipmentName || data.name || data.workoutType || data.type)
    );
  }

  /**
   * Parse plain text QR codes for equipment information
   */
  private static parseTextQRCode(data: string): WorkoutQRData | null {
    // Look for common patterns in equipment QR codes
    const patterns = [
      /equipment[_-]?id[:\s]*([a-zA-Z0-9-]+)/i,
      /machine[_-]?id[:\s]*([a-zA-Z0-9-]+)/i,
      /device[_-]?id[:\s]*([a-zA-Z0-9-]+)/i,
      /^([A-Z0-9-]+)$/i, // Simple alphanumeric ID
    ];

    for (const pattern of patterns) {
      const match = data.match(pattern);
      if (match) {
        return {
          equipmentId: match[1] || data,
          equipmentName: `Gerät ${match[1] || data}`,
          workoutType: 'Standard',
        };
      }
    }

    // If no pattern matches, treat the entire string as equipment ID
    if (data.length > 0 && data.length < 50) {
      return {
        equipmentId: data,
        equipmentName: `Gerät ${data}`,
        workoutType: 'Standard',
      };
    }

    return null;
  }

  /**
   * Start workout session with scanned equipment
   */
  static async startWorkoutSession(workoutData: WorkoutQRData): Promise<boolean> {
    try {
      // Here you would typically:
      // 1. Validate equipment availability
      // 2. Create workout session in database
      // 3. Start tracking workout metrics
      
      console.log('Starting workout session:', workoutData);
      
      // For now, just show success message
      Alert.alert(
        'Workout gestartet!',
        `Gerät: ${workoutData.equipmentName}\nTyp: ${workoutData.workoutType}\nID: ${workoutData.equipmentId}`,
        [{ text: 'OK' }]
      );
      
      return true;
    } catch (error) {
      console.error('Error starting workout session:', error);
      Alert.alert(
        'Fehler',
        'Workout konnte nicht gestartet werden. Bitte versuchen Sie es erneut.',
        [{ text: 'OK' }]
      );
      return false;
    }
  }

  /**
   * Validate QR code format
   */
  static isValidQRCode(data: string): boolean {
    if (!data || data.trim().length === 0) {
      return false;
    }

    // Check for minimum and maximum length
    if (data.length < 3 || data.length > 500) {
      return false;
    }

    // Check for malicious content (basic security)
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
    ];

    return !maliciousPatterns.some(pattern => pattern.test(data));
  }

  /**
   * Get workout history for equipment
   */
  static async getEquipmentHistory(equipmentId: string): Promise<any[]> {
    // This would typically fetch from your backend/database
    // For now, return mock data
    return [
      {
        date: new Date().toISOString(),
        duration: 30,
        type: 'Cardio',
        calories: 250,
      },
    ];
  }
}
