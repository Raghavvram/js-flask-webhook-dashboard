# Flask and Supabase Dashboard

A simple and modern dashboard to display data from a Supabase database. This project consists of a Flask backend that provides a REST API and serves the dashboard.

The dashboard is built with Tailwind CSS for a clean and responsive UI, and it features a dark mode. The project is fully configured for seamless deployment on [Vercel](https://vercel.com/).

![Dashboard Screenshot](https://i.imgur.com/your-screenshot.png) <!-- Replace with a real screenshot URL -->

## Features

- **Modern Dashboard**: A clean, responsive dashboard built with Tailwind CSS to view data.
- **Dark Mode**: Toggle between light and dark themes.
- **Supabase Integration**: Uses Supabase as the data source.
- **Vercel Ready**: Pre-configured for quick and easy deployment via Vercel.

## Tech Stack

- **Backend**: Python, Flask
- **Database**: Supabase (PostgreSQL)
- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
.
├── app.py              # Main Flask application: API endpoint and dashboard route.
├── requirements.txt    # Python dependencies for pip.
├── vercel.json         # Vercel deployment configuration.
├── templates/
│   └── dashboard.html  # The main analytics dashboard page.
└── README.md           # This file.
```

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- Python 3.8+
- A Supabase account.
- `git` for cloning the repository.

### 1. Set up Supabase

1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  Navigate to the **SQL Editor**.
3.  Click **New query** and run the following SQL to create the `visitors` table:
    ```sql
    create table public.visitors (
      id bigint generated always as identity not null,
      created_at timestamp with time zone null default now(),
      public_ip text null,
      country text null,
      country_code text null,
      city text null,
      page_visited text null,
      user_agent text null,
      device_type text null,
      browser text null,
      operating_system text null,
      session_id uuid null,
      time_spent_seconds integer null,
      constraint visitors_pkey primary key (id),
      constraint visitors_session_id_key unique (session_id)
    ) TABLESPACE pg_default;
    ```
    ```sql
    CREATE OR REPLACE FUNCTION get_filtered_analytics_visual(
        country_filter TEXT DEFAULT NULL,
        start_date_filter TEXT DEFAULT NULL,
        end_date_filter TEXT DEFAULT NULL,
        visitor_type_filter TEXT DEFAULT NULL,
        device_filter TEXT DEFAULT NULL,
        url_filter TEXT DEFAULT NULL,
        browser_filter TEXT DEFAULT NULL,
        ip_filter TEXT DEFAULT NULL
    )
    RETURNS json AS $$
    DECLARE
        analytics_payload json;
    BEGIN
        WITH ip_counts AS (
            SELECT public_ip, COUNT(*) as visit_count
            FROM public.visitors GROUP BY public_ip
        ),
        filtered_visitors AS (
            SELECT v.*, ic.visit_count
            FROM public.visitors v
            JOIN ip_counts ic ON v.public_ip = ic.public_ip
            WHERE
                (country_filter IS NULL OR v.country = country_filter)
                -- CORRECTED a typo from 'timestptz' to 'timestamptz'
                AND (start_date_filter IS NULL OR v.created_at >= start_date_filter::timestamptz)
                AND (end_date_filter IS NULL OR v.created_at <= end_date_filter::timestamptz)
                AND (
                    visitor_type_filter IS NULL OR visitor_type_filter = 'all' OR
                    (visitor_type_filter = 'unique' AND ic.visit_count = 1) OR
                    (visitor_type_filter = 'repeated' AND ic.visit_count > 1)
                )
                AND (device_filter IS NULL OR v.device_type = device_filter)
                AND (url_filter IS NULL OR v.page_visited = url_filter)
                AND (browser_filter IS NULL OR v.browser = browser_filter)
                AND (ip_filter IS NULL OR v.public_ip = ip_filter)
        )
        SELECT
            json_build_object(
                'stats', json_build_object(
                    'total_visitors', (SELECT COUNT(*) FROM filtered_visitors),
                    'unique_visitors', (SELECT COUNT(DISTINCT public_ip) FROM filtered_visitors),
                    'avg_time_on_page', (SELECT ROUND(AVG(time_spent_seconds)) FROM filtered_visitors WHERE time_spent_seconds IS NOT NULL)
                ),
                'visitor_list', COALESCE((SELECT json_agg(v) FROM (SELECT * FROM filtered_visitors ORDER BY created_at DESC LIMIT 100) v), '[]'),
                'charts', json_build_object(
                    'by_country', COALESCE((SELECT json_agg(t) FROM (SELECT country_code as id, COUNT(*) as value FROM filtered_visitors WHERE country_code IS NOT NULL GROUP BY country_code ORDER BY value DESC) t), '[]'),
                    'by_date', COALESCE((SELECT json_agg(d) FROM (SELECT created_at::date AS date, COUNT(*) AS count FROM filtered_visitors GROUP BY date ORDER BY date ASC) d), '[]'),
                    'by_device', COALESCE((SELECT json_agg(t) FROM (SELECT device_type, COUNT(*) as count FROM filtered_visitors WHERE device_type IS NOT NULL GROUP BY device_type ORDER BY count DESC) t), '[]'),
                    'by_browser', COALESCE((SELECT json_agg(t) FROM (SELECT browser, COUNT(*) as count FROM filtered_visitors WHERE browser IS NOT NULL GROUP BY browser ORDER BY count DESC LIMIT 5) t), '[]')
                ),
                'meta', json_build_object(
                    'distinct_countries', COALESCE((SELECT json_agg(DISTINCT country) FROM public.visitors WHERE country IS NOT NULL), '[]'),
                    'distinct_devices', COALESCE((SELECT json_agg(DISTINCT device_type) FROM public.visitors WHERE device_type IS NOT NULL), '[]'),
                    'distinct_urls', COALESCE((SELECT json_agg(DISTINCT page_visited) FROM public.visitors WHERE page_visited IS NOT NULL), '[]'),
                    'distinct_browsers', COALESCE((SELECT json_agg(DISTINCT browser) FROM public.visitors WHERE browser IS NOT NULL), '[]'),
                    'distinct_ips', COALESCE((SELECT json_agg(DISTINCT public_ip) FROM public.visitors WHERE public_ip IS NOT NULL), '[]')
                )
            )
        INTO analytics_payload;
    
        RETURN analytics_payload;
    END;
    $$ LANGUAGE plpgsql;
    ```
    *Note: This project only displays data. You are responsible for populating this table.*

4.  Navigate to **Project Settings** > **API**. Find your **Project URL** and **anon (public) key**. You will need these for the next step.

### 2. Local Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Raghavvram/js-flask-webhook-dashboard.git
    cd js-flask-webhook-dashboard
    ```

2.  **Create a virtual environment and install dependencies:**
    ```bash
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project directory and add your Supabase credentials:
    ```
    SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

4.  **Run the Flask application:**
    ```bash
    flask run
    ```
    The application will be running at `http://127.0.0.1:5000`.

## Deployment to Vercel

This project is pre-configured for deployment on Vercel.

1.  **Sign up and Install CLI**:
    - Create an account at [vercel.com](https://vercel.com/).
    - Install the Vercel CLI globally: `npm install -g vercel`.

2.  **Deploy**:
    - Run the deployment command from the project's root directory:
      ```bash
      vercel
      ```
    - Follow the on-screen prompts. Vercel will automatically detect the `vercel.json` configuration and deploy the application. You will need to set the `SUPABASE_URL` and `SUPABASE_KEY` environment variables during the setup process.

## License

This project is open-source and available under the [MIT License](LICENSE).
