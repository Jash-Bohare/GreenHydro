import pandas as pd
import joblib
import re
import fitz  # PyMuPDF
from sklearn.ensemble import RandomForestRegressor
from tkinter import Tk, filedialog
import os

# Fixed CSV path
CSV_PATH = r"V:\hydrogen_mock_1000.csv"
MODEL_PATH = "rf_model.pkl"
FEATURES_PATH = "features.pkl"

# -----------------------
# 1. Train Model (only if not saved)
# -----------------------
def train_and_save_model(csv_path=CSV_PATH):
    print("📂 Loading dataset:", csv_path)
    df = pd.read_csv(csv_path)
    print("✅ Dataset loaded. Shape:", df.shape)

    # One-hot encode Location
    df = pd.get_dummies(df, columns=["Location"], drop_first=True)
    print("🔠 Encoded columns:", df.columns.tolist())

    # Features & target
    X = df.drop("Plant_Capacity_kg_day", axis=1)
    y = df["Plant_Capacity_kg_day"]

    rf = RandomForestRegressor(n_estimators=100, random_state=42)
    rf.fit(X, y)
    print("✅ Model trained.")

    # Save model + features
    joblib.dump(rf, MODEL_PATH)
    joblib.dump(list(X.columns), FEATURES_PATH)
    print(f"💾 Model + features saved as {MODEL_PATH} and {FEATURES_PATH}")


# -----------------------
# 2. Extract multiple records from PDF
# -----------------------
def extract_data_from_pdf(pdf_path):
    print("📂 Opening PDF:", pdf_path)
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()

    # Split text into blocks for each day
    blocks = re.split(r"\n\s*\n", text.strip())  # split by empty lines
    records = []

    for block in blocks:
        data = {
            "Solar_Irradiance_kWh_m2": None,
            "Temperature_C": None,
            "Wind_Speed_m_s": None,
            "Cloud_Cover_pct": None,
            "Energy_Input_kW": None,
            "Plant_Capacity_kg_day": None,
            "Location": None,
        }

        def safe_extract(pattern, cast=float):
            match = re.search(pattern, block, re.IGNORECASE)
            return cast(match.group(1)) if match else None

        data["Solar_Irradiance_kWh_m2"] = safe_extract(r"Solar Irradiance[:\s]*([\d.]+)")
        data["Temperature_C"] = safe_extract(r"Temperature[:\s]*([\d.]+)")
        data["Wind_Speed_m_s"] = safe_extract(r"Wind Speed[:\s]*([\d.]+)")
        data["Cloud_Cover_pct"] = safe_extract(r"Cloud Cover[:\s]*([\d.]+)", int)
        data["Energy_Input_kW"] = safe_extract(r"Energy Input[:\s]*([\d.]+)", int)
        data["Plant_Capacity_kg_day"] = safe_extract(r"Plant Capacity[:\s]*([\d.]+)", int)

        loc_match = re.search(r"Location[:\s]*([A-Za-z ]+)", block)
        data["Location"] = loc_match.group(1).strip() if loc_match else "Unknown"

        if any(value is not None for value in data.values()):
            records.append(data)

    df = pd.DataFrame(records)
    print(f"📊 Extracted {len(df)} records from PDF.")
    return df


# -----------------------
# 3. Predict + Suspicious Check
# -----------------------
def check_pdf(pdf_path, model_path=MODEL_PATH, features_path=FEATURES_PATH, tolerance=0.2):
    print("⚡ Checking PDF against model...")

    # Train model if not saved yet
    if not os.path.exists(model_path) or not os.path.exists(features_path):
        print("⚠ Model or features not found. Training model...")
        train_and_save_model()

    # Load model + features
    rf = joblib.load(model_path)
    features = joblib.load(features_path)
    print("✅ Model + features loaded.")

    # Extract data from PDF
    df = extract_data_from_pdf(pdf_path)
    results = []

    for idx, row in df.iterrows():
        reported = row["Plant_Capacity_kg_day"]

        # ✅ Irradiance validation (2 - 7 kWh/m² is typical viable range)
        irradiance = row["Solar_Irradiance_kWh_m2"]
        if irradiance is not None and (irradiance < 2 or irradiance > 7):
            results.append({
                "Location": row["Location"],
                "Reported_Capacity": reported,
                "Predicted_Capacity": None,
                "Status": "Error: Irradiance Out of Range"
            })
            continue

        temp_df = pd.DataFrame([row])
        temp_df = pd.get_dummies(temp_df, columns=["Location"], drop_first=True)

        # Align with training features
        for col in features:
            if col not in temp_df.columns:
                temp_df[col] = 0
        temp_df = temp_df[features]

        predicted = rf.predict(temp_df)[0]

        # ✅ Extra condition: if reported < predicted, don’t automatically mark suspicious
        if reported < predicted * 0.7:  # reported is less than 70% of predicted
            status = "Reported Lower (Possible Loss/Underproduction)"
        elif abs(predicted - reported) > tolerance * reported:
            status = "Suspicious"
        else:
            status = "Normal"

        results.append({
            "Location": row["Location"],
            "Reported_Capacity": reported,
            "Predicted_Capacity": round(predicted, 2),
            "Status": status
        })

    results_df = pd.DataFrame(results)
    return results_df


# -----------------------
# 4. GUI: File Picker for PDF only
# -----------------------
def main():
    # Hide main Tkinter window
    root = Tk()
    root.withdraw()

    # Select PDF to check
    pdf_path = filedialog.askopenfilename(title="Select PDF to check", filetypes=[("PDF files", "*.pdf")])
    if not pdf_path:
        print("❌ No PDF selected. Exiting.")
        return

    # Run check
    results_df = check_pdf(pdf_path)
    print("\n🎯 Final Results:\n", results_df)

    # Save results
    results_df.to_csv("pdf_check_results.csv", index=False)
    print("💾 Results saved to pdf_check_results.csv")


if __name__ == "__main__":
    main()