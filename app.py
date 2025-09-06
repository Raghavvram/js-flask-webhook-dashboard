import os
from datetime import datetime
from dateutil.parser import parse as date_parse
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from supabase import create_client, Client
from user_agents import parse
import pycountry

load_dotenv()

app = Flask(__name__, template_folder='templates')
CORS(app, origins="*", allow_headers=["Content-Type", "Authorization"], methods=["GET", "POST", "OPTIONS"])

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

@app.route('/api/analytics', methods=['GET', 'OPTIONS'])
def get_analytics():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        params = {
            'country_filter': request.args.get('country_filter'),
            'start_date_filter': request.args.get('start_date_filter'),
            'end_date_filter': request.args.get('end_date_filter'),
            'visitor_type_filter': request.args.get('visitor_type_filter'),
            'device_filter': request.args.get('device_filter'),
            'url_filter': request.args.get('url_filter'),
            'browser_filter': request.args.get('browser_filter'),
            'ip_filter': request.args.get('ip_filter'),
            'isp_filter': request.args.get('isp_filter'),
        }

        # Convert empty strings to None and parse dates to ISO8601 strings
        for k, v in params.items():
            if not v:
                params[k] = None
            else:
                if k in ('start_date_filter', 'end_date_filter') and v is not None:
                    try:
                        dt = date_parse(v)
                        params[k] = dt.isoformat()
                    except Exception:
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

@app.route('/track', methods=['POST', 'OPTIONS'])
def track():
    if request.method == 'OPTIONS':
        return '', 200

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

        country = norm(data.get("country"))
        city = norm(data.get("city"))
        isp = norm(data.get("isp"))
        public_ip = norm(data.get("publicIp"))
        country_code = data.get("countryCode") or get_country_code(country)

        # Parse timestamp safely: convert milliseconds timestamp to ISO8601 string if it looks like milliseconds
        first_seen_raw = data.get("timestamp")
        first_seen = None
        if first_seen_raw is not None:
            try:
                # If numeric and very large, treat as milliseconds
                if isinstance(first_seen_raw, (int, float)) or (isinstance(first_seen_raw, str) and first_seen_raw.isdigit()):
                    ts = int(first_seen_raw)
                    # If ts looks like ms timestamp, convert to seconds
                    if ts > 10**12:  # Likely microseconds, too large, divide
                        ts = ts // 1000
                    if ts > 10**10:  # Too large, divide by 1000 more
                        ts = ts // 1000
                    first_seen = datetime.utcfromtimestamp(ts / 1000 if ts > 10**9 else ts).isoformat()
                else:
                    # Try parsing ISO string
                    first_seen = date_parse(str(first_seen_raw)).isoformat()
            except Exception:
                first_seen = None

        visitor_record = {
            "session_id": session_id,
            "public_ip": public_ip,
            "country": country,
            "country_code": country_code,
            "city": city,
            "isp": isp,
            "page_visited": data.get("pageVisited"),
            "user_agent": ua_string,
            "device_type": device_type,
            "browser": ua.browser.family,
            "operating_system": ua.os.family,
            "first_seen": first_seen,
            "time_spent_seconds": None,
        }

        if data.get("timeSpentSeconds") is not None:
            ts = int(data.get("timeSpentSeconds") or 0)
            ts = max(0, min(ts, 86400))
            visitor_record["time_spent_seconds"] = ts

        # Remove keys with None to avoid sending null values
        visitor_record = {k: v for k, v in visitor_record.items() if v is not None}

        supabase.table('visitors') \
            .upsert(visitor_record, on_conflict='session_id') \
            .execute()

        return jsonify({"success": True}), 201

    except Exception as e:
        app.logger.error(f"Error in /track: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/log/time', methods=['POST', 'OPTIONS'])
def log_time():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json(force=True)
        session_id = data.get("sessionId")
        if not session_id:
            return jsonify({"error": "Missing sessionId"}), 400

        time_spent_seconds = data.get("timeSpentSeconds", 0)
        if time_spent_seconds is not None:
            time_spent_seconds = max(0, min(int(time_spent_seconds), 86400))

        # Update the visitor record with time spent
        update_data = {
            "time_spent_seconds": time_spent_seconds
        }

        supabase.table('visitors') \
            .update(update_data) \
            .eq('session_id', session_id) \
            .execute()

        return jsonify({"success": True, "time_logged": time_spent_seconds}), 200

    except Exception as e:
        app.logger.error(f"Error in /log/time: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))