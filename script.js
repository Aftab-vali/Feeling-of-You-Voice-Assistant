// Initialize SpeechRecognition API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

// Initialize SpeechSynthesis API
const synth = window.speechSynthesis;
let speaking = false; // Track speaking state

// Function to Start Voice Recognition
function startRecognition() {
    if (speaking) {
        synth.cancel(); // Stop current response if button is pressed again
        speaking = false;
    }
    recognition.start();
}

// Handling Voice Input
recognition.onresult = async (event) => {
    const userMessage = event.results[0][0].transcript;
    document.getElementById('message-box').value = userMessage;

    // Send message to Flask server
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    const botResponse = data.response;
    document.getElementById('response-box').innerText = botResponse;

    // Speak the response
    speak(botResponse);
};

// Stop speech on button press
recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
};

// Function to Speak Response with Interruption Feature
function speak(text) {
    if (speaking) {
        synth.cancel(); // Stop current speech before starting new one
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speaking = true;

    utterance.onend = () => {
        speaking = false; // Reset speaking state when speech ends
    };

    synth.speak(utterance);
}
