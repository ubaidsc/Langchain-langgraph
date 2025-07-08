# Gemini Chatbot with LangChain Memory

A conversational AI chatbot powered by Google's Gemini API and LangChain's memory functionality for maintaining conversation context.

## Features

- 🤖 **Google Gemini Integration**: Uses Gemini 1.5 Pro model for intelligent responses
- 🧠 **Memory Management**: Maintains conversation context throughout the chat session
- 💬 **Interactive CLI**: User-friendly command-line interface
- 🔄 **Memory Control**: Commands to clear memory and view memory statistics
- ⚡ **Error Handling**: Robust error handling with helpful messages

## Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Get Google Gemini API Key**:

   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create or sign in to your Google account
   - Generate a new API key

3. **Configure Environment**:
   - Open the `.env` file
   - Replace `your_gemini_api_key_here` with your actual API key:
     ```
     GOOGLE_API_KEY=your_actual_api_key_here
     ```

## Usage

### Start the Chatbot

```bash
npm start
```

### Available Commands

- **Chat**: Simply type your message and press Enter
- **Clear Memory**: Type `clear` to reset conversation context
- **Exit**: Type `quit`, `exit`, or `bye` to end the conversation
- **Memory Stats**: Automatically shown after each response

### Example Conversation

```
🤖 Gemini Chatbot with Memory
========================================
Hi! I'm your AI assistant powered by Google Gemini.
I can remember our conversation and maintain context.
Type 'quit', 'exit', or 'bye' to end the conversation.
Type 'clear' to clear the conversation memory.
========================================

💬 You: Hello! What's your name?

🤖 Assistant: Hello! I'm your AI assistant powered by Google Gemini. I don't have a specific name, but you can call me whatever you'd like! I'm here to help you with questions, have conversations, and assist with various tasks. What would you like to talk about today?

📊 Memory: 2 messages stored

💬 You: Can you remember what I just asked?

🤖 Assistant: Yes, absolutely! You just asked me what my name was. I explained that I'm your AI assistant powered by Google Gemini and that while I don't have a specific name, you're welcome to call me whatever you'd like. This demonstrates that I'm maintaining our conversation context and can refer back to previous parts of our chat.

📊 Memory: 4 messages stored
```

## Code Structure

### Main Components

1. **GeminiChatbot Class**: Main chatbot implementation

   - `constructor()`: Initializes Gemini model, memory, and prompt template
   - `startChat()`: Begins the interactive chat session
   - `chatLoop()`: Handles user input and generates responses
   - `clearMemory()`: Resets conversation memory
   - `showMemoryStats()`: Displays current memory statistics

2. **Memory Management**: Uses LangChain's BufferMemory for context retention

3. **Error Handling**: Comprehensive error handling for API issues and user input

### Configuration Options

You can customize the chatbot by modifying these parameters in the constructor:

```javascript
this.model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  modelName: "gemini-1.5-pro", // Model version
  temperature: 0.7, // Response creativity (0-1)
  maxOutputTokens: 2048, // Maximum response length
});
```

## Troubleshooting

### Common Issues

1. **API Key Error**:

   - Ensure your API key is correctly set in the `.env` file
   - Verify the API key is valid and active

2. **Network Issues**:

   - Check your internet connection
   - Verify firewall settings allow outbound HTTPS connections

3. **Memory Issues**:
   - Use the `clear` command if conversations become too long
   - Restart the application for a fresh start

### Dependencies

- `@langchain/google-genai`: Google Gemini integration
- `@langchain/core`: Core LangChain functionality
- `@langchain/community`: Community LangChain components
- `langchain`: Main LangChain library
- `dotenv`: Environment variable management

## Contributing

Feel free to contribute by:

- Adding new features
- Improving error handling
- Enhancing the user interface
- Adding more memory management options

## License

This project is open source and available under the ISC License.
