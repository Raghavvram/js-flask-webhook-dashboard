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
    if not country_name or country_name.lower() == 'unknown':
        return None
    try:
        country = pycountry.countries.get(name=country_name)
        if country:
            return country.alpha_2
        fuzzy = pycountry.countries.search_fuzzy(country_name)
        if fuzzy:
            return fuzzy[0].alpha_2
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
            'country_filter':       request.args.get('country_filter'),
            'start_date_filter':    request.args.get('start_date_filter'),
            'end_date_filter':      request.args.get('end_date_filter'),
            'visitor_type_filter':  request.args.get('visitor_type_filter'),
            'device_filter':        request.args.get('device_filter'),
            'url_filter':           request.args.get('url_filter'),
            'browser_filter':       request.args.get('browser_filter'),
            'ip_filter':            request.args.get('ip_filter'),
            'isp_filter':           request.args.get('isp_filter'),
        }
        for k, v in params.items():
            if not v:
                params[k] = None

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
        app.logger.error(f"Error in /api/analytics: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/track', methods=['POST'])
def track():
    try:
        data = request.get_json(force=True)
        session_id = data.get("sessionId")
        if not session_id:
            return jsonify({"error": "Missing sessionId"}), 400

        def norm(val):
            return None if not val or str(val).lower() == 'unknown' else val

        ua_string = data.get("userAgent", "")
        ua = parse(ua_string)
        if ua.is_mobile:
            device_type = "Mobile"
        elif ua.is_tablet:
            device_type = "Tablet"
        else:
            device_type = "Desktop"

        country      = norm(data.get("country"))
        city         = norm(data.get("city"))
        isp          = norm(data.get("isp"))
        public_ip    = norm(data.get("publicIp"))
        country_code = data.get("countryCode") or get_country_code(country)
        first_seen   = data.get("timestamp")

        visitor_record = {
            "session_id":        session_id,
            "public_ip":         public_ip,
            "country":           country,
            "country_code":      country_code,
            "city":              city,
            "isp":               isp,
            "page_visited":      data.get("pageVisited"),
            "user_agent":        ua_string,
            "device_type":       device_type,
            "browser":           ua.browser.family,
            "operating_system":  ua.os.family,
            "first_seen":        first_seen,
            "time_spent_seconds": None,
        }

        if data.get("timeSpentSeconds") is not None:
            ts = int(data.get("timeSpentSeconds") or 0)
            ts = max(0, min(ts, 86400))
            visitor_record["time_spent_seconds"] = ts

        visitor_record = {k: v for k, v in visitor_record.items() if v is not None}

        supabase.table('visitors') \
            .upsert(visitor_record, on_conflict='session_id') \
            .execute()

        return jsonify({"success": True}), 201
    except Exception as e:
        app.logger.error(f"Error in /track: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

