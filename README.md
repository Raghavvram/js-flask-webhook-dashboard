# T.R.A.C (TRAC Real-time Analytics Conduit)

A simple and modern dashboard to display data from a Supabase database. This project consists of a Flask backend that provides a REST API and a Next.js frontend.

The dashboard is built with Tailwind CSS for a clean and responsive UI, and it features a dark mode. The project is fully configured for seamless deployment on [Vercel](https://vercel.com/).

## Features

- **Modern Dashboard**: A clean, responsive dashboard built with Next.js and Tailwind CSS to view data.
- **Dark Mode**: Toggle between light and dark themes.
- **Supabase Integration**: Uses Supabase as the data source.
- **Vercel Ready**: Pre-configured for quick and easy deployment via Vercel.
- **Advanced Filtering**: Filter data by country, device, browser, visitor type, and date range.
- **Multiple Chart Types**: View data as a timeline, a world map, a doughnut chart, and bar charts.
- **Sortable Table**: Sort the recent visitor activity table by any column.

## Tech Stack

- **Backend**: Python, Flask
- **Database**: Supabase (PostgreSQL)
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Chart.js, AmCharts
- **Deployment**: Vercel

## Project Structure

```
.
├── backend/             # Flask backend
├── frontend/            # Next.js frontend
├── supabase_analytics_function.sql # Supabase SQL function
├── vercel.json          # Vercel deployment configuration
└── README.md            # This file.
```

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- Python 3.8+
- Node.js 18+
- A Supabase account.
- `git` for cloning the repository.

### 1. Set up Supabase

1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  Navigate to the **SQL Editor**.
3.  Click **New query** and run the SQL from the `supabase_analytics_function.sql` file to create the `visitors` table and the `get_filtered_analytics_visual` function.
4.  Navigate to **Project Settings** > **API**. Find your **Project URL** and **anon (public) key**. You will need these for the next step.

### 2. Local Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Raghavvram/js-flask-webhook-dashboard.git
    cd js-flask-webhook-dashboard
    ```

2.  **Set up environment variables:**
    Create a file named `.env` in the root of the project directory and add your Supabase credentials:
    ```
    SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
    SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

3.  **Install backend dependencies and run the backend:**
    ```bash
    cd backend
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    flask run
    ```

4.  **Install frontend dependencies and run the frontend:**
    In a new terminal, navigate to the `frontend` directory:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

    The application will be running at `http://localhost:3000`.

## Javascript 

For the website to work, we need to embed the following script tag in the body of the html page (put it at the last)

```html
<script src="https://embed-js-script.pages.dev/tracker.js"></script>
```

This JS function fecthes the necessary functions and sends it to the webhook ( if you want to use your own deployment, copy the JS code and change the webhook to your custom URL )

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
