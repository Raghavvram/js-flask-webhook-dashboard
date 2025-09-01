import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from supabase import create_client, Client
from flask_cors import CORS
from user_agents import parse

load_dotenv()

app = Flask(__name__, template_folder='templates')
CORS(app)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# A simple map to convert full country names to the 2-letter codes needed by the map chart
COUNTRY_CODE_MAP = {
    "United States": "US", "India": "IN", "Germany": "DE", "United Kingdom": "GB",
    "Canada": "CA", "Australia": "AU", "France": "FR", "Brazil": "BR", "Japan": "JP",
    "China": "CN", "Russia": "RU", "Netherlands": "NL", "Switzerland": "CH", "Spain": "ES"
}

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        params = {
            'country_filter': request.args.get('country') or None,
            'start_date_filter': request.args.get('start_date') or None,
            'end_date_filter': request.args.get('end_date') or None,
            'visitor_type_filter': request.args.get('visitor_type') or None,
        }
        response = supabase.rpc('get_filtered_analytics_visual', params).execute()
        data = response.data

        if data and 'stats' in data:
            total = data['stats'].get('total_visitors', 0)
            unique = data['stats'].get('unique_visitors', 0)
            data['stats']['repeated_visitors'] = total - unique

        return jsonify(data)
    except Exception as e:
        print(f"AN ERROR OCCURRED IN /api/analytics: {e}") 
        return jsonify({"error": str(e)}), 500

@app.route('/track', methods=['POST'])
def track():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400
    
    user_agent_string = data.get("userAgent", "")
    user_agent = parse(user_agent_string)
    
    device_type = "Desktop"
    if user_agent.is_mobile:
        device_type = "Mobile"
    elif user_agent.is_tablet:
        device_type = "Tablet"

    country_name = data.get("country")

    # This dictionary now perfectly matches our new table schema
    visitor_data = {
        "public_ip": data.get("publicIp"),
        "country": country_name,
        "country_code": COUNTRY_CODE_MAP.get(country_name), 
        "city": data.get("city"),
        "page_visited": data.get("pageVisited"),
        "user_agent": user_agent_string,
        "device_type": device_type,
        "browser": user_agent.browser.family,
        "operating_system": user_agent.os.family
    }

    try:
        supabase.table('visitors').insert(visitor_data).execute()
        return jsonify({"success": True}), 201
    except Exception as e:
        print(f"AN ERROR OCCURRED IN /track: {e}") 
        return jsonify({"error": str(e)}), 500
