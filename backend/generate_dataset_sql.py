import pandas as pd
import numpy as np
import sqlite3
import random
from datetime import datetime, timedelta

# Pakistan districts with coordinates
pakistan_districts = {
    "Lahore": (31.5204, 74.3587),
    "Faisalabad": (31.4504, 73.1350),
    "Karachi": (24.8607, 67.0011),
    "Islamabad": (33.6844, 73.0479),
    "Rawalpindi": (33.5651, 73.0169),
    "Multan": (30.1575, 71.5249),
    "Gujranwala": (32.1877, 74.1945),
    "Peshawar": (34.0151, 71.5249),
    "Quetta": (30.1798, 66.9750),
    "Sargodha": (32.0836, 72.6711),
    "Sialkot": (32.4922, 74.5311),
    "Bahawalpur": (29.3956, 71.6836),
    "Sukkur": (27.7132, 68.8482),
    "Jhang": (31.2682, 72.3184),
    "Sheikhupura": (31.7131, 73.9783),
    "Rahim Yar Khan": (28.4209, 70.2952),
    "Gujrat": (32.5742, 74.0754),
    "Kasur": (31.1155, 74.4466),
    "Okara": (30.8103, 73.4513),
    "Sahiwal": (30.6705, 73.1063)
}

# ---------------------------------------
# Motor power types (2HP to 50HP)
motor_powers = {
    "Very Small": {"hp": 2, "flow_rate_lpm": 40, "price_range": (12000, 18000)},
    "Small": {"hp": 3, "flow_rate_lpm": 60, "price_range": (15000, 25000)},
    "Medium": {"hp": 5, "flow_rate_lpm": 120, "price_range": (30000, 45000)},
    "Upper Medium": {"hp": 7, "flow_rate_lpm": 200, "price_range": (45000, 65000)},
    "Large": {"hp": 10, "flow_rate_lpm": 300, "price_range": (70000, 100000)},
    "Heavy": {"hp": 20, "flow_rate_lpm": 600, "price_range": (100000, 150000)},
    "Extra Heavy": {"hp": 30, "flow_rate_lpm": 900, "price_range": (150000, 220000)},
    "Mega": {"hp": 40, "flow_rate_lpm": 1200, "price_range": (220000, 300000)},
    "Ultra": {"hp": 50, "flow_rate_lpm": 1500, "price_range": (300000, 400000)}
}

# ---------------------------------------
# Crop information
crops_data = {
    "wheat": {"season":"Rabi","temp_range":(15,25),"rainfall_range":(200,400),"soil_preference":["loam","clay loam","silty loam"],"yield_range":(3.0,4.5)},
    "rice": {"season":"Kharif","temp_range":(25,35),"rainfall_range":(500,800),"soil_preference":["clay","clay loam"],"yield_range":(3.5,5.0)},
    "cotton": {"season":"Kharif","temp_range":(25,35),"rainfall_range":(150,350),"soil_preference":["sandy loam","loam"],"yield_range":(1.5,3.0)},
    "maize": {"season":"Kharif","temp_range":(20,30),"rainfall_range":(250,500),"soil_preference":["loam","sandy loam"],"yield_range":(3.0,4.5)},
    "sugarcane": {"season":"Kharif","temp_range":(25,35),"rainfall_range":(400,600),"soil_preference":["clay loam","loam"],"yield_range":(50,70)},
    "potato": {"season":"Rabi","temp_range":(15,25),"rainfall_range":(200,350),"soil_preference":["sandy loam","loam"],"yield_range":(2.0,3.5)},
    "gram": {"season":"Rabi","temp_range":(15,25),"rainfall_range":(100,250),"soil_preference":["loamy sand","sandy loam"],"yield_range":(1.5,2.5)}
}

soil_types = ["loam","clay","sandy","sandy loam","clay loam"]
fertilizers = ["Urea","DAP","NPK","FYM","None"]

# Data generation
def generate_realistic_data(num_rows=1000):
    data = []
    for i in range(1, num_rows+1):
        district = random.choice(list(pakistan_districts.keys()))
        lat, lon = pakistan_districts[district]
        crop = random.choice(list(crops_data.keys()))
        crop_info = crops_data[crop]

        soil = random.choice(crop_info["soil_preference"])
        area = round(random.uniform(0.5,50.0),2)

        temp_min, temp_max = crop_info["temp_range"]
        temperature = round(random.uniform(temp_min,temp_max),1)

        rain_min, rain_max = crop_info["rainfall_range"]
        rainfall = round(random.uniform(rain_min,rain_max),1)

        # Motor selection
        if area <= 1:
            motor_type = "Very Small"
        elif area <= 3:
            motor_type = "Small"
        elif area <= 5:
            motor_type = "Medium"
        elif area <= 7:
            motor_type = "Upper Medium"
        elif area <= 10:
            motor_type = "Large"
        elif area <= 15:
            motor_type = "Heavy"
        elif area <= 25:
            motor_type = "Extra Heavy"
        elif area <= 40:
            motor_type = "Mega"
        else:
            motor_type = "Ultra"

        motor_info = motor_powers[motor_type]

        fertilizer = random.choice(fertilizers)

        yield_min, yield_max = crop_info["yield_range"]
        crop_yield = round(random.uniform(yield_min,yield_max),1)

        row = {
            "id": i,
            "district": district,
            "latitude": lat,
            "longitude": lon,
            "crop_type": crop,
            "soil_type": soil,
            "field_area_ha": area,
            "season": crop_info["season"],
            "avg_temp_c": temperature,
            "total_rainfall_mm": rainfall,
            "fertilizer_type": fertilizer,
            "motor_type": motor_type,
            "motor_power_hp": motor_info["hp"],
            "flow_rate_lpm": motor_info["flow_rate_lpm"],
            "yield_ton_per_ha": crop_yield
        }

        data.append(row)
        if i % 100 == 0:
            print(f"✅ Generated {i} rows...")

    return pd.DataFrame(data)

# ---------------------------------------
# Calculations
def add_calculated_columns(df):
    crop_water_needs = {
        'wheat':4.5, 'rice':6.8, 'cotton':5.2, 'maize':4.8,
        'sugarcane':7.5, 'potato':4.0, 'gram':3.5
    }

    water_reqs = []
    hours_list = []

    for _, row in df.iterrows():
        base = crop_water_needs.get(row['crop_type'],4.0)
        water_mm = base * 1.0
        water_liters = water_mm * 10 * 10000 * row['field_area_ha']
        flow = row['flow_rate_lpm']
        hours = water_liters / (flow * 60)

        water_reqs.append(round(water_liters))
        hours_list.append(round(hours,1))

    df["water_requirement_liters"] = water_reqs
    df["irrigation_hours"] = hours_list
    return df

# ---------------------------------------
# Save to database
def save_to_sqlite(df, db_name="agriculture_data.db"):
    conn = sqlite3.connect(db_name)
    df.to_sql("agriculture_data", conn, if_exists="replace", index=False)

    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS motor_recommendations (
        id INTEGER PRIMARY KEY,
        area_range TEXT,
        recommended_hp INTEGER,
        motor_type TEXT,
        flow_rate_lpm INTEGER,
        power_consumption_kwh FLOAT,
        price_range TEXT
    )
    ''')

    motor_recs = [
        ("0-1 ha", 2, "Very Small", 40, 1.5, "12,000-18,000 PKR"),
        ("1-3 ha", 3, "Small", 60, 2.2, "15,000-25,000 PKR"),
        ("3-5 ha", 5, "Medium", 120, 3.7, "30,000-45,000 PKR"),
        ("5-7 ha", 7, "Upper Medium", 200, 5.1, "45,000-65,000 PKR"),
        ("7-10 ha", 10, "Large", 300, 7.5, "70,000-100,000 PKR"),
        ("10-15 ha", 20, "Heavy", 600, 12.0, "100,000-150,000 PKR"),
        ("15-25 ha", 30, "Extra Heavy", 900, 18.5, "150,000-220,000 PKR"),
        ("25-40 ha", 40, "Mega", 1200, 24.0, "220,000-300,000 PKR"),
        ("40+ ha", 50, "Ultra", 1500, 30.0, "300,000-400,000 PKR")
    ]

    cursor.executemany("INSERT INTO motor_recommendations VALUES (?,?,?,?,?,?,?)",
                       [(i+1, *rec) for i, rec in enumerate(motor_recs)])
    conn.commit()
    conn.close()
    print("✅ Data saved to SQLite")

# ---------------------------------------
# Main
if __name__ == "__main__":
    print("🌾 Generating Agriculture Dataset...")
    df = generate_realistic_data(1000)
    df = add_calculated_columns(df)

    df.to_csv("pakistan_agriculture_dataset_with_motor.csv", index=False)
    print("✅ CSV saved")

    save_to_sqlite(df)

    print("\n📋 Sample data:")
    print(df[["district","crop_type","field_area_ha","motor_type","motor_power_hp","water_requirement_liters","irrigation_hours"]].head())
