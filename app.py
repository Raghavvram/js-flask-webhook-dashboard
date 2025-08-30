import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from supabase import create_client, Client
from flask_cors import CORS, cross_origin

load_dotenv()

app = Flask(__name__)
CORS(app) # Enable CORS for the entire app

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

@app.route('/dashboard')
def dashboard():
    """Serves the dashboard HTML page."""
    return render_template('dashboard.html')

@app.route('/api/visitors', methods=['GET'])
def get_visitors():
    """Provides visitor data from Supabase as JSON."""
    try:
        response = supabase.table('visitors').select('*').order('created_at', desc=True).execute()
        return jsonify(response.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/track', methods=['POST'])
@cross_origin() # Specifically allow cross-origin requests for this endpoint
def track():
    """Receives tracking data and stores it in Supabase."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

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
        supabase.table('visitors').insert(visitor_data).execute()
        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
