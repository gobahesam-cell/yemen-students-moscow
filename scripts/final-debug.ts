const apiKey = "AIzaSyAsD5AC_sB6CslS-bDc0hG65E53PoD0SkE";

async function listAllModels() {
    console.log("Querying listModels...");
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error Details:", JSON.stringify(data.error, null, 2));
            return;
        }

        if (!data.models) {
            console.log("No models found in the response.");
            console.log("Full response:", JSON.stringify(data, null, 2));
            return;
        }

        console.log(`Successfully found ${data.models.length} models:`);
        const supportedModels = data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace("models/", ""));

        console.log("MODELS_LIST_START");
        console.log(supportedModels.join("\n"));
        console.log("MODELS_LIST_END");

    } catch (err) {
        console.error("Network/execution error:", err.message);
    }
}

listAllModels();
