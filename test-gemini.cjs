const { GoogleGenerativeAI } = require('@google/generative-ai');
const ai = new GoogleGenerativeAI('AIzaSyAQDaZ1G9BX3IpdS-wz5tNkDhsH9JwvdsY');

async function run() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyAQDaZ1G9BX3IpdS-wz5tNkDhsH9JwvdsY`);
        const data = await response.json();
        console.log("AVAILABLE MODELS:", data.models.map(m => m.name));
    } catch (e) {
        console.error("ERROR generating:", e);
    }
}
run();
