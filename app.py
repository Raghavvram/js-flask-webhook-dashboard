import os
import json
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from supabase import create_client, Client
from flask_cors import CORS

load_dotenv()

app = Flask(__name__, template_folder='templates')
CORS(app)

# Initialize Supabase client
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

## ----------------- Frontend Serving Route ----------------- ##

@app.route('/dashboard')
def dashboard():
    """Serves the main dashboard.html file."""
    return render_template('dashboard.html')

## ----------------- API Endpoints for Dashboard ----------------- ##

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """
    Serves aggregated data for the top charts (map, trends).
    This has been updated to read from the new 'page_views' table.
    """
    try:
        params = {
            'country_filter': request.args.get('country') or None,
            'start_date_filter': request.args.get('start_date') or None,
            'end_date_filter': request.args.get('end_date') or None,
            'visitor_type_filter': request.args.get('visitor_type') or None,
        }
        # Calls the updated RPC function that now queries the page_views table
        response = supabase.rpc('get_filtered_analytics_visual', params).execute()
        data = response.data

        # Calculate repeated visitors (total views - unique users)
        if data and 'stats' in data:
            total = data['stats'].get('total_visitors', 0)
            unique = data['stats'].get('unique_visitors', 0)
            data['stats']['repeated_visitors'] = total - unique

        return jsonify(data)
    except Exception as e:
        print(f"AN ERROR OCCURRED IN /api/analytics: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    """
    NEW: Serves the detailed session data for the user journey section.
    """
    try:
        # Calls the new RPC function to get aggregated session journeys
        response = supabase.rpc('get_session_analytics').execute()
        return jsonify(response.data)
    except Exception as e:
        print(f"AN ERROR OCCURRED IN /api/sessions: {e}")
        return jsonify({"error": str(e)}), 500

## ----------------- Data Tracking Endpoint ----------------- ##

@app.route('/track-pageview', methods=['POST'])
def track_pageview():
    """
    UPDATED: Receives all page view data from the new tracker,
    including session IDs, time spent, and location.
    """
    data = None
    try:
        # Handles data sent via navigator.sendBeacon()
        data = json.loads(request.get_data(as_text=True))
    except (json.JSONDecodeError, TypeError):
        return jsonify({"error": "Invalid data format"}), 400

    if not data:
        return jsonify({"error": "No data received"}), 400

    # Prepare the data object for insertion into the 'page_views' table
    page_view_data = {
        "user_id": data.get("user_id"),
        "session_id": data.get("session_id"),
        "page_visited": data.get("page_visited"),
        "previous_page": data.get("previous_page"),
        "time_spent_seconds": data.get("time_spent_seconds"),
        "user_agent": data.get("user_agent"),
        "country": data.get("country"),
        "city": data.get("city"),
        "country_code": data.get("country_code"),
    }

    # Validate essential fields
    if not all([page_view_data["user_id"], page_view_data["session_id"]]):
        return jsonify({"error": "Missing required fields: user_id or session_id"}), 400

    try:
        # Insert the validated data into the Supabase table
        supabase.table('page_views').insert(page_view_data).execute()
        return jsonify({"success": True}), 200
    except Exception as e:
        print(f"AN ERROR OCCURRED IN /track-pageview: {e}")
        return jsonify({"error": str(e)}), 500
