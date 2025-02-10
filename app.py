from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

# Replace with your actual API key
api_key = "AIzaSyDxct3SOet7hOTiUPx8e3fnP_rdhpu-uJ4"

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-pro")
chat = model.start_chat(history=[])

app = Flask(__name__)

# Custom prompt for emotional and simple responses
def generate_emotion_response(user_input):
    # A special prompt that requests emotional and conversational responses
    prompt = f"Respond with emotions and feelings, as if you're having a simple conversation. Reply in a tone like you are speaking directly to someone. {user_input}"
    response = chat.send_message(prompt)
    return response.text

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat_response():
    user_input = request.get_json()['message']
    response_text = generate_emotion_response(user_input)
    return jsonify({'response': response_text})

if __name__ == '__main__':
    app.run(debug=True)
