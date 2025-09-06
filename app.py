import os
import json
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from supabase import create_client, Client
from flask_cors import CORS
from user_agents import parse
import pycountry

load_dotenv()

app = Flask(__name__, template_folder='templates')
CORS(app)

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

def get_country_code(country_name):
    if not country_name or country_name == 'unknown':
        return None
    try:
        country = pycountry.countries.get(name=country_name)
        if country:
            return country.alpha_2
        country = pycountry.countries.search_fuzzy(country_name)
        if country:
            return country[0].alpha_2
    except Exception:
        return None
    return None

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    try:
        params = {
            'country_filter': request.args.get('country_filter') or None,
            'start_date_filter': request.args.get('start_date_filter') or None,
            'end_date_filter': request.args.get('end_date_filter') or None,
            'visitor_type_filter': request.args.get('visitor_type_filter') or None,
            'device_filter': request.args.get('device_filter') or None,
            'url_filter': request.args.get('url_filter') or None,
            'browser_filter': request.args.get('browser_filter') or None,
            'ip_filter': request.args.get('ip_filter') or None
        }
        response = supabase.rpc('get_filtered_analytics_visual', params).execute()
        data = response.data or {}
        if 'stats' in data:
            stats = data['stats']
            total = stats.get('total_visitors', 0)
            unique = stats.get('unique_visitors', 0)
            stats['repeated_visitors'] = max(0, total - unique)
            data['stats'] = stats
        return jsonify(data)
    except Exception as e:
        app.logger.error(f"AN ERROR OCCURRED IN /api/analytics: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/track', methods=['POST'])
def track():
    try:
        data = request.get_json(force=True)
        session_id = data.get("sessionId")
        if not session_id:
            return jsonify({"error": "Missing sessionId"}), 400

        ua_string = data.get("userAgent", "")
        ua = parse(ua_string)
        if ua.is_mobile:
            device_type = "Mobile"
        elif ua.is_tablet:
            device_type = "Tablet"
        else:
            device_type = "Desktop"

        country = data.get("country")
        if country == 'unknown':
            country = None
        city = data.get("city")
        if city == 'unknown':
            city = None
        region = data.get("region")
        if region == 'unknown':
            region = None
        isp = data.get("isp")
        if isp == 'unknown':
            isp = None
        public_ip = data.get("publicIp")
        if public_ip == 'unknown':
            public_ip = None

        country_code = data.get("countryCode") or get_country_code(country)
        first_seen = data.get("timestamp")  # JavaScript timestamp

        visitor_record = {
            "session_id": session_id,
            "public_ip": public_ip,
            "country": country,
            "country_code": country_code,
            "region": region,
            "city": city,
            "isp": isp,
            "page_visited": data.get("pageVisited"),
            "user_agent": ua_string,
            "device_type": device_type,
            "browser": ua.browser.family,
            "operating_system": ua.os.family,
            "first_seen": first_seen
        }
        # Remove None values
        visitor_record = {k: v for k, v in visitor_record.items() if v is not None}

        supabase.table('visitors') \
            .upsert(visitor_record, on_conflict='session_id') \
            .execute()

        return jsonify({"success": True}), 201
    except Exception as e:
        app.logger.error(f"AN ERROR OCCURRED IN /track: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/log/time', methods=['POST'])
def log_time():
    try:
        data = request.get_json(force=True)
        session_id = data.get('sessionId')
        time_spent = data.get('timeSpentSeconds')
        if not session_id or time_spent is None:
            return jsonify({"error": "Missing sessionId or timeSpentSeconds"}), 400

        # Validate time_spent
        if time_spent < 0:
            time_spent = 0
        elif time_spent > 86400:
            time_spent = 86400

        supabase.table('visitors') \
            .update({'time_spent_seconds': time_spent}) \
            .eq('session_id', session_id) \
            .execute()

        return jsonify({"success": True}), 200
    except Exception as e:
        app.logger.error(f"AN ERROR OCCURRED IN /log/time: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

