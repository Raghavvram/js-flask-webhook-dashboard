(function() {
    // IMPORTANT: Change this URL to your deployed Flask app's tracking endpoint
    const flaskEndpoint = 'https://js-flask-webhook-dashboard-l8alubmuw-raghavvrams-projects.vercel.app/track';

    async function getVisitorData() {
        try {
            const response = await fetch('https://ip-api.com/json');
            const ipData = await response.json();
            const userAgent = navigator.userAgent;

            let os = 'Unknown';
            let osVersion = 'Unknown';

            if (userAgent.includes("Win")) os = "Windows";
            if (userAgent.includes("Mac")) os = "MacOS";
            if (userAgent.includes("Linux")) os = "Linux";
            if (userAgent.includes("Android")) {
                os = "Android";
                const v = userAgent.match(/Android (\d+(\.\d+)*)/);
                if (v) osVersion = v[1];
            }
            if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
                os = "iOS";
                const v = userAgent.match(/OS (\d+(_\d+)*)/);
                if (v) osVersion = v[1].replace(/_/g, '.');
            }

            return {
                publicIp: ipData.query,
                country: ipData.country,
                city: ipData.city,
                userAgent: userAgent,
                deviceOs: os,
                osVersion: osVersion,
                pageVisited: window.location.href
            };
        } catch (error) {
            console.error('Tracker error:', error);
            return null;
        }
    }

    async function sendData() {
        const data = await getVisitorData();
        if (data) {
            fetch(flaskEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                mode: 'cors' // This is crucial for cross-domain requests
            }).catch(console.error);
        }
    }

    sendData();
})();
