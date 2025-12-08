// src/database/index.ts
import SQLite from 'react-native-sqlite-storage';

class DatabaseService {
  private db: any = null;

  // Database initialize karein
  async initializeDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase(
        { name: 'agriculture.db', location: 'default' },
        () => console.log('✅ Database opened'),
        (error: any) => console.error('❌ Database error:', error)
      );

      await this.createTables();
    } catch (error) {
      console.error('❌ Database initialization error:', error);
    }
  }

  // Tables create karein
  private async createTables(): Promise<void> {
    const queries = [
      // User recommendations table
      `CREATE TABLE IF NOT EXISTS user_recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district TEXT NOT NULL,
        crop_type TEXT NOT NULL,
        soil_type TEXT NOT NULL,
        area REAL NOT NULL,
        water_needed INTEGER,
        irrigation_method TEXT,
        duration_hours REAL,
        efficiency_score INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Weather cache table
      `CREATE TABLE IF NOT EXISTS weather_cache (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district TEXT UNIQUE NOT NULL,
        temperature REAL,
        humidity INTEGER,
        rainfall REAL,
        weather_desc TEXT,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // User history table
      `CREATE TABLE IF NOT EXISTS irrigation_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        district TEXT,
        crop_type TEXT,
        water_used INTEGER,
        duration_hours REAL,
        date DATE,
        notes TEXT
      )`
    ];

    for (const query of queries) {
      await this.executeQuery(query);
    }
  }

  // Query execute karein
  private executeQuery(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.transaction((tx: any) => {
        tx.executeSql(
          query,
          params,
          (tx: any, results: any) => resolve(results),
          (tx: any, error: any) => {
            console.error('Query error:', error);
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // Save recommendation
  async saveRecommendation(data: any): Promise<number> {
    const query = `
      INSERT INTO user_recommendations 
      (district, crop_type, soil_type, area, water_needed, irrigation_method, duration_hours, efficiency_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      data.district,
      data.crop_type,
      data.soil_type,
      data.area,
      data.water_needed,
      data.irrigation_method,
      data.duration_hours,
      data.efficiency_score || 7
    ];

    const result = await this.executeQuery(query, params);
    return result.insertId;
  }

  // Get recommendations history
  async getRecommendationsHistory(): Promise<any[]> {
    const query = `
      SELECT * FROM user_recommendations 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
    
    const result = await this.executeQuery(query);
    const rows = [];
    
    for (let i = 0; i < result.rows.length; i++) {
      rows.push(result.rows.item(i));
    }
    
    return rows;
  }
}

export default new DatabaseService();