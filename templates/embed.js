(function() {
    // The endpoint on your Flask server that receives the tracking data.
    const endpoint = 'https://js-flask-webhook-dashboard.vercel.app/track-pageview';

    /**
     * Retrieves an ID from browser storage or creates a new one if it doesn't exist.
     * Uses UUIDs for unique identification.
     * @param {Storage} storage - The storage object (localStorage or sessionStorage).
     * @param {string} key - The key for the ID.
     * @returns {string} The existing or newly created ID.
     */
    function getOrCreateId(storage, key) {
        let id = storage.getItem(key);
        if (!id) {
            id = self.crypto.randomUUID();
            storage.setItem(key, id);
        }
        return id;
    }

    // A persistent ID for the user across multiple sessions.
    const userId = getOrCreateId(localStorage, 'tracker_user_id');
    // An ID for the current browsing session, which resets when the tab is closed.
    const sessionId = getOrCreateId(sessionStorage, 'tracker_session_id');

    // --- Time & Activity Tracking ---
    let timeSpentOnPage = 0; // Total time in seconds
    let lastActivityTime = new Date(); // Tracks the last moment of activity

    /**
     * Calculates the time elapsed since the last activity check.
     * Only counts time when the tab is visible to the user.
     */
    function calculateElapsedTime() {
        if (document.visibilityState === 'visible') {
            const now = new Date();
            timeSpentOnPage += (now - lastActivityTime) / 1000;
            lastActivityTime = now;
        }
    }

    // Set up a recurring timer to update the time spent every second.
    const intervalId = setInterval(calculateElapsedTime, 1000);

    // Add an event listener to handle tab visibility changes.
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            // Capture the time right before the tab becomes hidden.
            calculateElapsedTime();
        } else {
            // When the tab becomes visible again, reset the activity timer.
            lastActivityTime = new Date();
        }
    });

    /**
     * Gathers all tracking data and sends it to the backend.
     * This function is triggered when the user navigates away from the page.
     */
    async function sendPageViewData() {
        // Perform a final time calculation and stop the timer.
        calculateElapsedTime();
        clearInterval(intervalId);

        let locationData = {};
        try {
            // Fetch the user's location data based on their IP address.
            const response = await fetch('https://ipinfo.io/json');
            const ipData = await response.json();
            locationData = {
                country: ipData.country,
                city: ipData.city,
                country_code: ipData.country, // ipinfo.io uses the 2-letter code for the country field.
            };
        } catch (error) {
            console.error('Tracker location error:', error);
            // The script will continue and send data without location if this fails.
        }

        const data = {
            user_id: userId,
            session_id: sessionId,
            page_visited: window.location.href,
            previous_page: document.referrer,
            time_spent_seconds: Math.round(timeSpentOnPage),
            user_agent: navigator.userAgent,
            ...locationData // Merge the location data into the main payload.
        };

        // Use navigator.sendBeacon() for reliable data transmission on page exit.
        // It sends the data as a Blob with the correct content type.
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(endpoint, blob);
    }

    // Add the event listener for the 'pagehide' event, which is more reliable than 'beforeunload'.
    window.addEventListener('pagehide', sendPageViewData);

})();
