# Visitor Analytics Dashboard

A simple, modern, and self-hosted web analytics dashboard. This project consists of a Flask backend that provides a REST API and serves a dashboard, and a lightweight JavaScript tracking script to collect visitor data. The data is stored in a [Supabase](https://supabase.com/) PostgreSQL database.

The dashboard is built with Tailwind CSS for a clean and responsive UI, and it features a dark mode. The project is fully configured for seamless deployment on [Vercel](https://vercel.com/).

![Dashboard Screenshot](https://i.imgur.com/your-screenshot.png) <!-- Replace with a real screenshot URL -->

## Features

- **Real-time Visitor Tracking**: Collects basic visitor information like IP, location, device, and page visited.
- **Modern Dashboard**: A clean, responsive dashboard built with Tailwind CSS to view analytics data.
- **Dark Mode**: Toggle between light and dark themes.
- **Embeddable Tracker**: A simple `embed.js` script that can be included on any website to start tracking.
- **Supabase Integration**: Uses Supabase for a reliable and scalable data backend.
- **Vercel Ready**: Pre-configured for quick and easy deployment via Vercel.
- **CORS Handled**: Correctly configured to accept cross-origin requests from the tracking script.

## Tech Stack

- **Backend**: Python, Flask, Flask-CORS
- **Database**: Supabase (PostgreSQL)
- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
.
├── app.py              # Main Flask application: API endpoints and dashboard route.
├── requirements.txt    # Python dependencies for pip.
├── vercel.json         # Vercel deployment configuration.
├── templates/
│   ├── dashboard.html  # The main analytics dashboard page.
│   └── embed.js        # The embeddable JS tracker script.
├── .gitignore          # Standard git ignore file.
└── README.md           # This file.
```

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing.

### Prerequisites

- Python 3.8+
- A Supabase account and a new project.
- `git` for cloning the repository.

### 1. Set up Supabase

1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  Once the project is created, navigate to the **SQL Editor**.
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

4.  Navigate to **Project Settings** > **API**. Find your **Project URL** and **anon (public) key**. You will need these next.

### 2. Local Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/js-flask-dashboard.git
    cd js-flask-dashboard
    ```

2.  **Create a virtual environment and activate it:**
    - On macOS/Linux:
      ```bash
      python3 -m venv .venv
      source .venv/bin/activate
      ```
    - On Windows:
      ```bash
      python -m venv .venv
      .\.venv\Scripts\activate
      ```

3.  **Install the required Python packages:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**
    Create a file named `.env` in the root of the project directory and add your Supabase credentials:
    ```
    SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

5.  **Run the Flask application:**
    ```bash
    flask run
    ```
    The application will be running at `http://127.0.0.1:5000`.

### 3. Using the Dashboard and Tracker

-   **View the Dashboard**: Navigate to `http://127.0.0.1:5000/dashboard` in your browser.
-   **Use the Tracking Script**:
    1.  The `embed.js` script needs to point to your backend. For local testing, you would change the `flaskEndpoint` URL inside `templates/embed.js` to your local or deployed backend's `/track` endpoint.
    2.  Add the script to any HTML page you want to track:
        ```html
        <script src="http://127.0.0.1:5000/static/embed.js"></script>
        ```
        *(Note: You will need to configure Flask to serve `embed.js` as a static file for this to work, or adjust the URL based on your deployment.)*

## Deployment to Vercel

This project is pre-configured for deployment on Vercel.

1.  **Sign up and Install CLI**:
    - Create an account at [vercel.com](https://vercel.com/).
    - Install the Vercel CLI globally: `npm install -g vercel`.

2.  **Update `embed.js`**:
    Before deploying, you **must** update the `flaskEndpoint` variable in `templates/embed.js` to the production URL that Vercel will assign to you.
    ```javascript
    // templates/embed.js
    const flaskEndpoint = 'https://your-project-name.vercel.app/track';
    ```

3.  **Deploy**:
    - Run the deployment command from the project's root directory:
      ```bash
      vercel
      ```
    - Follow the on-screen prompts. Vercel will automatically detect the `vercel.json` configuration and deploy the application. It will also ask you to set the `SUPABASE_URL` and `SUPABASE_KEY` environment variables during the setup process.

4.  **Using the Deployed Tracker**:
    Once deployed, you can embed the tracking script on any website using your Vercel app's URL:
    ```html
    <script src="https://your-project-name.vercel.app/templates/embed.js"></script>
    ```
    *(Note: The exact path might vary based on Vercel's serving configuration. You may need to adjust the path or the `vercel.json` rewrites.)*

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have suggestions or find a bug.

## License

This project is open-source and available under the [MIT License](LICENSE).
