import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from supabase import create_client, Client
from flask_cors import CORS, cross_origin

# Correctly loads environment variables from a .env file for local development
load_dotenv()

# Initializes the Flask app, robustly specifying the templates folder
app = Flask(__name__, template_folder='templates')

# Correctly initializes CORS for the entire app, allowing it to handle preflight requests
CORS(app)

# Securely gets Supabase credentials from environment variables
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Serves the main dashboard page
@app.route('/dashboard')
def dashboard():
    """Serves the dashboard HTML page."""
    return render_template('dashboard.html')

# Provides a JSON API endpoint for the frontend to fetch visitor data
@app.route('/api/visitors', methods=['GET'])
def get_visitors():
    """Provides visitor data from Supabase as JSON."""
    try:
        # Correctly fetches and orders all records from the 'visitors' table
        response = supabase.table('visitors').select('*').order('created_at', desc=True).execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# The webhook endpoint for receiving data from the tracker script
@app.route('/track', methods=['POST'])
@cross_origin() # This decorator is crucial and correctly placed to handle CORS for this specific route
def track():
    """Receives tracking data and stores it in Supabase."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    # Safely extracts data from the incoming JSON payload
    visitor_data = {
        "public_ip": data.get("publicIp"),
        "country": data.get("country"),
        "city": data.get("city"),
        "user_agent": data.get("userAgent"),
        "device_os": data.get("deviceOs"),
        "os_version": data.get("osVersion"),
        "page_visited": data.get("pageVisited")
    }

    try:
        # Correctly inserts the new record into the Supabase table
        supabase.table('visitors').insert(visitor_data).execute()
        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
