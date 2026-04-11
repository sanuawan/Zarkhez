// src/services/motorRuntimeService.ts
import firestore from '@react-native-firebase/firestore';

export interface MotorRuntimeData {
  totalHours: number;
  lastUpdated: number;
  lastReset: number;
  serviceLimit: number;
}

// 🛡️ Safe helper function to avoid ".toMillis is not a function" errors
const getSafeMillis = (timestamp: any, fallback: 'zero' | 'now' = 'now') => {
  if (!timestamp) return fallback === 'zero' ? 0 : Date.now();
  if (typeof timestamp.toMillis === 'function') return timestamp.toMillis();
  if (timestamp.seconds) return timestamp.seconds * 1000;
  return fallback === 'zero' ? 0 : Date.now();
};

class MotorRuntimeService {
  private listeners: ((data: MotorRuntimeData) => void)[] = [];

  // Get current runtime data
  async getRuntimeData(): Promise<MotorRuntimeData> {
    try {
      const doc = await firestore().collection('motor_stats').doc('runtime').get();
      const settingsDoc = await firestore().collection('settings').doc('safety_config').get();
      
      const serviceLimit = settingsDoc.data()?.serviceLimit || 500;
      
      if (doc.exists()) {
        const data = doc.data();
        return {
          totalHours: data?.totalHours || 0,
          lastUpdated: getSafeMillis(data?.lastUpdated, 'now'),
          lastReset: getSafeMillis(data?.lastReset, 'zero'), // Using 0 as fallback if never reset
          serviceLimit: serviceLimit,
        };
      } else {
        // Create document if not exists
        await firestore().collection('motor_stats').doc('runtime').set({
          totalHours: 0,
          lastReset: firestore.FieldValue.serverTimestamp(),
          lastUpdated: firestore.FieldValue.serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('Error getting runtime:', error);
    }
    
    return {
      totalHours: 0,
      lastUpdated: Date.now(),
      lastReset: 0,
      serviceLimit: 500,
    };
  }

async syncMotorHoursFromBilling(): Promise<void> {
  try {
    const currentData = await this.getRuntimeData();
    
    // AGAR lastReset zero hai aur totalHours bhi zero hai, 
    // iska matlab user ne abhi tak koi kaam shuru nahi kiya reset ke baad.
    if (currentData.lastReset === 0 && currentData.totalHours === 0) {
      console.log("No reset timestamp found, keeping hours at 0");
      return;
    }

    const billingSnapshot = await firestore().collection('billing_history').get();
    let totalMinutes = 0;
    
    billingSnapshot.forEach(doc => {
      const data = doc.data();
      const ts = data.timestamp || data.createdAt || data.date;
      const docTime = getSafeMillis(ts, 'zero');
      
      // Strict Check: Sirf wo records jo Reset ke baad ke hain
      if (docTime > currentData.lastReset) {
        totalMinutes += parseFloat(data.duration || 0);
      }
    });
    
    // Minutes ko Hours mein convert kar ke round karein
    const totalHours = Math.round((totalMinutes / 60) * 100000) / 100000;
    
    // Database update tabhi karein jab waqai koi tabdeeli ho
    if (Math.abs(totalHours - currentData.totalHours) > 0.001) {
       await firestore().collection('motor_stats').doc('runtime').update({
         totalHours: totalHours,
         lastUpdated: firestore.FieldValue.serverTimestamp(),
       });
       this.notifyListeners({ ...currentData, totalHours: totalHours });
    }
  } catch (error) {
    console.error('Error syncing motor hours:', error);
  }
}

  async getServiceLimit(): Promise<number> {
    try {
      const settingsDoc = await firestore().collection('settings').doc('safety_config').get();
      return settingsDoc.data()?.serviceLimit || 500;
    } catch (error) {
      return 500;
    }
  }

  // Reset service counter properly
  async resetServiceCounter(): Promise<void> {
    try {
      // Reset totalHours to 0 and update lastReset time
      await firestore().collection('motor_stats').doc('runtime').set({
        totalHours: 0,
        lastReset: firestore.FieldValue.serverTimestamp(),
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      
      console.log('✅ Service counter reset to 0');
      
      // Get updated data
      const currentData = await this.getRuntimeData();
      this.notifyListeners({ ...currentData, totalHours: 0 });
      
      // Save reset notification
      await firestore().collection('notifications').add({
        message: `Service counter has been reset to 0 hours.`,
        read: false,
        timestamp: firestore.FieldValue.serverTimestamp(),
        title: "✓ SERVICE RESET",
        type: "service"
      });
      
    } catch (error) {
      console.error('Error resetting service:', error);
      throw error;
    }
  }

  // Force refresh from billing
  async forceRefreshFromBilling(): Promise<void> {
    console.log('🔄 Force refreshing motor hours from billing...');
    await this.syncMotorHoursFromBilling();
  }

  private async triggerServiceNotification(hours: number, limit: number) {
    try {
      await firestore().collection('notifications').add({
        message: `Motor has exceeded ${limit} hours of operation. Current runtime: ${hours.toFixed(1)} hours. Service is required!`,
        read: false,
        timestamp: firestore.FieldValue.serverTimestamp(),
        title: "⚠️ SERVICE REQUIRED",
        type: "service"
      });
    } catch (error) {
      console.error('Error triggering notification:', error);
    }
  }

  subscribe(callback: (data: MotorRuntimeData) => void) {
    this.listeners.push(callback);
    
    const unsubscribe = firestore()
      .collection('motor_stats')
      .doc('runtime')
      .onSnapshot(async (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const serviceLimit = await this.getServiceLimit();
          
          const runtimeData: MotorRuntimeData = {
            totalHours: data?.totalHours || 0,
            lastUpdated: getSafeMillis(data?.lastUpdated, 'now'),
            lastReset: getSafeMillis(data?.lastReset, 'zero'),
            serviceLimit: serviceLimit,
          };
          
          this.notifyListeners(runtimeData);
        }
      });
    
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) this.listeners.splice(index, 1);
      unsubscribe();
    };
  }

  startAutoSync() {
    firestore()
      .collection('billing_history')
      .onSnapshot(() => {
        console.log('🔄 Billing history changed, syncing motor hours...');
        this.syncMotorHoursFromBilling();
      });
  }

  private notifyListeners(data: MotorRuntimeData) {
    this.listeners.forEach(callback => callback(data));
  }
}

export default new MotorRuntimeService();