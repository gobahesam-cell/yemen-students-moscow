const apiKey = process.env.GOOGLE_AI_API_KEY || "AIzaSyCHMMUoejMsmtjckFckvv6oOEeKKgwTkaw";

async function listAllModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.log("FULL_ERROR_START");
            console.log(JSON.stringify(data.error, null, 2));
            console.log("FULL_ERROR_END");
            return;
        }

        if (data.models) {
            console.log("SUCCESS");
        }
    } catch (err) {
        console.error("Network Error:", err.message);
    }
}

listAllModels();
