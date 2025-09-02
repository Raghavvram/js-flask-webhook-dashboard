import os
import json
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from supabase import create_client, Client
from flask_cors import CORS
from user_agents import parse
import pycountry

load_dotenv()

app = Flask(__name__, template_folder='templates')
CORS(app, resources={r"/api/*": {"origins": "*"}})

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def get_country_name(code):
    try:
        return pycountry.countries.get(alpha_2=code).name
    except:
        return code

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    """ This is now the main endpoint for the dashboard, handling filters. """
    try:
        params = {
            'country_filter': request.args.get('country') or None,
            'start_date_filter': request.args.get('start_date') or None,
            'end_date_filter': request.args.get('end_date') or None,
        }
        # Calls the new master RPC function with filter parameters
        response = supabase.rpc('get_merged_analytics', params).execute()
        return jsonify(response.data)
    except Exception as e:
        print(f"AN ERROR in /api/analytics: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/event', methods=['POST'])
def handle_event():
    """ This endpoint handles all incoming events (no changes from before). """
    data = request.get_json()
    if not data: return jsonify({"error": "Invalid JSON"}), 400

    session_id = data.get('sessionId')
    user_id = data.get('userId')
    event_type = data.get('eventType')
    payload = data.get('payload', {})
    
    if not all([session_id, user_id, event_type]):
        return jsonify({"error": "Missing required fields"}), 400
        
    try:
        if event_type == 'pageview':
            # This logic now also fetches country code from ipinfo via another api for accuracy.
            # For simplicity in this example, we assume it's sent from client or derived elsewhere.
            # A robust implementation would have a microservice or direct call here.
            user_agent = parse(payload.get('user_agent', ''))
            session_data = {
                "session_id": session_id, "user_id": user_id,
                "start_time": datetime.utcnow().isoformat(), "end_time": datetime.utcnow().isoformat(),
                "initial_referrer": payload.get('referrer'), "initial_page": payload.get('page'),
                "utm_source": payload.get('utm_source'), "utm_medium": payload.get('utm_medium'),
                "utm_campaign": payload.get('utm_campaign'),
                "device_type": "Desktop" if not user_agent.is_mobile and not user_agent.is_tablet else ("Mobile" if user_agent.is_mobile else "Tablet"),
                "browser": user_agent.browser.family, "operating_system": user_agent.os.family
            }
            supabase.table('sessions').upsert(session_data, on_conflict='session_id').execute()
        else:
            supabase.table('sessions').update({"end_time": datetime.utcnow().isoformat()}).eq('session_id', session_id).execute()

        event_data = {
            "session_id": session_id, "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type, "payload": payload
        }
        supabase.table('events').insert(event_data).execute()
        return jsonify({"success": True}), 200

    except Exception as e:
        print(f"AN ERROR in /api/event: {e}")
        return jsonify({"error": str(e)}), 500
