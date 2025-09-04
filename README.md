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
    CREATE TABLE visitors (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
        public_ip TEXT,
        country TEXT,
        city TEXT,
        user_agent TEXT,
        device_os TEXT,
        os_version TEXT,
        page_visited TEXT
    );
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