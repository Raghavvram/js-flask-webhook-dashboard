(function() {
    // IMPORTANT: This URL should be correct.
    const flaskEndpoint = 'https://js-flask-webhook-dashboard-l8alubmuw-raghavvrams-projects.vercel.app/track';

    async function getVisitorData() {
        try {
            // FIXED: Switched to a more reliable IP info service.
            const response = await fetch('https://ipinfo.io/json');
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
                // FIXED: ipinfo.io returns 'ip' instead of 'query'.
                publicIp: ipData.ip,
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
                mode: 'cors'
            }).catch(console.error);
        }
    }

    sendData();
})();
