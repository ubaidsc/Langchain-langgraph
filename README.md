# Multi-Model Chatbot with LangChain Memory

A conversational AI chatbot that supports multiple AI models including Google Gemini and Groq (Llama, Mixtral) with LangChain's memory functionality for maintaining conversation context.

## Features

- 🤖 **Multiple AI Models**:
  - Google Gemini 1.5 Pro & Flash
  - Groq Llama 3.1 (70B & 8B)
  - Groq Mixtral 8x7B
- 🧠 **Memory Management**: Maintains conversation context throughout the chat session
- 🔄 **Model Switching**: Switch between different AI models during conversation
- 💬 **Interactive CLI**: User-friendly command-line interface
- 🔄 **Memory Control**: Commands to clear memory and view memory statistics
- ⚡ **Error Handling**: Robust error handling with helpful messages
- 🔑 **Multi-API Support**: Support for both Google and Groq APIs

## Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Get API Keys**:

   **Google Gemini API Key**:

   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create or sign in to your Google account
   - Generate a new API key

   **Groq API Key**:

   - Visit [Groq Console](https://console.groq.com/keys)
   - Create or sign in to your Groq account
   - Generate a new API key

3. **Configure Environment**:
   - Open the `.env` file
   - Add your API keys:
     ```
     GOOGLE_API_KEY=your_actual_google_api_key_here
     GROQ_API_KEY=your_actual_groq_api_key_here
     ```
   - You can configure one or both APIs (at least one is required)

## Usage

### Start the Chatbot

```bash
npm start
```

### Model Selection

When you start the chatbot, you'll see a model selection menu:

```
🤖 Select AI Model:
==================================================
1. ✅ Gemini 1.5 Pro (Google)
2. ✅ Gemini 1.5 Flash (Google)
3. ✅ Llama 3.1 70B (Groq)
4. ✅ Llama 3.1 8B (Groq)
5. ✅ Mixtral 8x7B (Groq)

❌ = API key not configured
✅ = Ready to use
==================================================
```

### Available Commands

- **Chat**: Simply type your message and press Enter
- **`switch`**: Change the AI model during conversation
- **`clear`**: Reset conversation memory
- **`models`**: Display available models
- **`quit`/`exit`/`bye`**: End the conversation

### Available Models

#### Google Models

- **Gemini 1.5 Pro**: Most capable model, best for complex reasoning
- **Gemini 1.5 Flash**: Faster responses, good for general conversations

#### Groq Models

- **Llama 3.1 70B**: Large model with excellent reasoning capabilities
- **Llama 3.1 8B**: Faster, smaller model for quick responses
- **Mixtral 8x7B**: Mixture of experts model, good balance of speed and quality

## Example Usage

```bash
npm start
```

```
🤖 Multi-Model Chatbot with Memory
==================================================
Welcome! This chatbot supports multiple AI models:
• Google Gemini models
• Groq models (Llama, Mixtral)
• Conversation memory for context retention
==================================================

🤖 Select AI Model:
==================================================
1. ✅ Gemini 1.5 Pro (Google)
2. ✅ Gemini 1.5 Flash (Google)
3. ✅ Llama 3.1 70B (Groq)
4. ✅ Llama 3.1 8B (Groq)
5. ✅ Mixtral 8x7B (Groq)
==================================================

Enter model number (1-5): 1

✅ Selected: Gemini 1.5 Pro (Google)

💬 You [Gemini 1.5 Pro]: Hello! Can you explain quantum computing?

🤔 Gemini 1.5 Pro is thinking...

🤖 Gemini 1.5 Pro: [Detailed explanation about quantum computing...]

📊 Memory: 2 messages stored | Model: Gemini 1.5 Pro

💬 You [Gemini 1.5 Pro]: switch

[Model selection menu appears again]

Enter model number (1-5): 3

✅ Selected: Llama 3.1 70B (Groq)

💬 You [Llama 3.1 70B]: Can you remember what I asked about before?

🤖 Llama 3.1 70B: Yes, you asked about quantum computing, and I provided an explanation...

📊 Memory: 4 messages stored | Model: Llama 3.1 70B
```

## Configuration

### Environment Variables

The `.env` file should contain:

```env
# Google Gemini API Key (get from https://aistudio.google.com/app/apikey)
GOOGLE_API_KEY=your_actual_google_api_key_here

# Groq API Key (get from https://console.groq.com/keys)
GROQ_API_KEY=your_actual_groq_api_key_here
```

### Model Parameters

You can customize model parameters in the code:

```javascript
// For Google models
{
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-1.5-pro",
  temperature: 0.7,        // Creativity level (0-1)
  maxOutputTokens: 2048,   // Maximum response length
}

// For Groq models
{
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-70b-versatile",
  temperature: 0.7,        // Creativity level (0-1)
  maxTokens: 2048,        // Maximum response length
}
```

## Troubleshooting

### Common Issues

1. **API Key Errors**:

   - Ensure your API keys are correctly set in the `.env` file
   - Verify the API keys are valid and active
   - Check that you haven't exceeded rate limits

2. **Model Selection Issues**:

   - Make sure at least one API key is configured
   - Restart the application after updating `.env`

3. **Memory Issues**:

   - Use the `clear` command if conversations become too long
   - Memory is preserved when switching models
   - Restart the application for a complete reset

4. **Network Issues**:
   - Check your internet connection
   - Verify firewall settings allow outbound HTTPS connections

### Dependencies

- `@langchain/google-genai`: Google Gemini integration
- `@langchain/groq`: Groq models integration
- `@langchain/core`: Core LangChain functionality
- `@langchain/community`: Community LangChain components
- `langchain`: Main LangChain library for memory and chains
- `dotenv`: Environment variable management

## Contributing

Feel free to contribute by:

- Adding new AI model providers
- Improving the user interface
- Enhancing error handling
- Adding more memory management options
- Creating different conversation modes

## License

This project is open source and available under the ISC License.
