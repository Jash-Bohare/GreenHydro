from flask import Flask, request, jsonify
import os
import joblib
import pandas as pd
import tempfile
from final import check_pdf, train_and_save_model, MODEL_PATH, FEATURES_PATH, CSV_PATH

app = Flask(__name__)

# Ensure model is trained and saved
try:
    if not os.path.exists(MODEL_PATH) or not os.path.exists(FEATURES_PATH):
        print("⚠ Model or features not found. Training model...")
        train_and_save_model(CSV_PATH)
    else:
        print("✅ Model and features already exist.")
except Exception as e:
    print(f"Error during model setup: {e}")
    raise

# API route to receive PDF and return model results
@app.route("/upload_pdf", methods=["POST"])
def upload_pdf():
    if "pdf_file" not in request.files:
        return jsonify({"error": "No PDF file uploaded"}), 400

    pdf_file = request.files["pdf_file"]

    if pdf_file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not pdf_file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Invalid file type. Please upload a PDF"}), 400

    # Use a temporary file safely
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        temp_pdf_path = tmp_file.name
        pdf_file.save(temp_pdf_path)

    try:
        # Run your existing model on the PDF
        results_df = check_pdf(temp_pdf_path, model_path=MODEL_PATH, features_path=FEATURES_PATH)
        results_json = results_df.to_dict(orient="records")
    except Exception as e:
        return jsonify({"error": f"Error processing PDF: {str(e)}"}), 500
    finally:
        # Clean up temporary PDF
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)

    return jsonify(results_json)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
