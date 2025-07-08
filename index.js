require("dotenv").config();
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ChatGroq } = require("@langchain/groq");
const { BufferMemory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");
const { PromptTemplate } = require("@langchain/core/prompts");
const readline = require("readline");

class GeminiChatbot {
  constructor() {
    this.availableModels = {
      1: {
        name: "Gemini 1.5 Pro",
        provider: "Google",
        model: "gemini-1.5-pro",
        apiKey: process.env.GOOGLE_API_KEY,
        class: ChatGoogleGenerativeAI,
      },
      2: {
        name: "Gemini 2.0 Flash",
        provider: "Google",
        model: "gemini-2.0-flash",
        apiKey: process.env.GOOGLE_API_KEY,
        class: ChatGoogleGenerativeAI,
      },
      3: {
        name: "Llama 3.1 70B",
        provider: "Groq",
        model: "llama-3.1-70b-versatile",
        apiKey: process.env.GROQ_API_KEY,
        class: ChatGroq,
      },
      4: {
        name: "Llama 3.1 8B",
        provider: "Groq",
        model: "llama-3.1-8b-instant",
        apiKey: process.env.GROQ_API_KEY,
        class: ChatGroq,
      },
      5: {
        name: "Mixtral 8x7B",
        provider: "Groq",
        model: "mixtral-8x7b-32768",
        apiKey: process.env.GROQ_API_KEY,
        class: ChatGroq,
      },
    };

    this.selectedModel = null;
    this.llm = null;
    this.memory = null;
    this.conversationChain = null;

    // Setup readline for user input
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  initializeModel(modelKey) {
    const modelConfig = this.availableModels[modelKey];

    if (!modelConfig) {
      throw new Error("Invalid model selection");
    }

    if (
      !modelConfig.apiKey ||
      modelConfig.apiKey.includes("your_") ||
      modelConfig.apiKey.includes("_key_here")
    ) {
      throw new Error(`${modelConfig.provider} API key not configured`);
    }

    // Initialize the selected model
    if (modelConfig.provider === "Google") {
      this.llm = new modelConfig.class({
        apiKey: modelConfig.apiKey,
        model: modelConfig.model,
        temperature: 0.7,
        maxOutputTokens: 2048,
      });
    } else if (modelConfig.provider === "Groq") {
      this.llm = new modelConfig.class({
        apiKey: modelConfig.apiKey,
        model: modelConfig.model,
        temperature: 0.7,
        maxTokens: 2048,
      });
    }

    // Initialize memory to maintain conversation context
    this.memory = new BufferMemory({
      memoryKey: "history",
      inputKey: "input",
      outputKey: "response",
    });

    // Create a custom prompt template
    this.prompt = PromptTemplate.fromTemplate(`
You are a helpful and friendly AI assistant. You have access to the conversation history and can maintain context throughout our chat.

Conversation History:
{history}

Current Human Message: {input}

AI Assistant Response:`);

    // Initialize conversation chain
    this.conversationChain = new ConversationChain({
      llm: this.llm,
      memory: this.memory,
      prompt: this.prompt,
      verbose: false,
    });

    this.selectedModel = modelConfig;
  }

  displayModelMenu() {
    console.log("\n🤖 Select AI Model:");
    console.log("=".repeat(50));

    for (const [key, model] of Object.entries(this.availableModels)) {
      const hasApiKey =
        model.apiKey &&
        !model.apiKey.includes("your_") &&
        !model.apiKey.includes("_key_here");
      const status = hasApiKey ? "✅" : "❌";
      console.log(`${key}. ${status} ${model.name} (${model.provider})`);
    }

    console.log("\n❌ = API key not configured");
    console.log("✅ = Ready to use");
    console.log("=".repeat(50));
  }

  async selectModel() {
    return new Promise((resolve) => {
      this.displayModelMenu();

      this.rl.question("\nEnter model number (1-5): ", (input) => {
        const modelKey = input.trim();

        if (!this.availableModels[modelKey]) {
          console.log("❌ Invalid selection. Please try again.");
          resolve(this.selectModel());
          return;
        }

        const model = this.availableModels[modelKey];
        const hasApiKey =
          model.apiKey &&
          !model.apiKey.includes("your_") &&
          !model.apiKey.includes("_key_here");

        if (!hasApiKey) {
          console.log(`❌ ${model.provider} API key not configured!`);
          if (model.provider === "Google") {
            console.log(
              "Get your API key from: https://aistudio.google.com/app/apikey"
            );
          } else if (model.provider === "Groq") {
            console.log("Get your API key from: https://console.groq.com/keys");
          }
          console.log("Add it to the .env file and restart the application.");
          resolve(this.selectModel());
          return;
        }

        try {
          this.initializeModel(modelKey);
          console.log(`\n✅ Selected: ${model.name} (${model.provider})`);
          resolve();
        } catch (error) {
          console.log(`❌ Error initializing ${model.name}: ${error.message}`);
          resolve(this.selectModel());
        }
      });
    });
  }

  async startChat() {
    console.log("🤖 Multi-Model Chatbot with Memory");
    console.log("=".repeat(50));
    console.log("Welcome! This chatbot supports multiple AI models:");
    console.log("• Google Gemini models");
    console.log("• Groq models (Llama, Mixtral)");
    console.log("• Conversation memory for context retention");
    console.log("=".repeat(50));

    await this.selectModel();

    console.log("\n🚀 Starting chat session...");
    console.log("Commands:");
    console.log("• Type your message to chat");
    console.log("• 'switch' - Change AI model");
    console.log("• 'clear' - Clear conversation memory");
    console.log("• 'quit', 'exit', or 'bye' - End conversation");
    console.log("=".repeat(50));

    this.chatLoop();
  }

  async chatLoop() {
    this.rl.question(
      `\n💬 You [${this.selectedModel.name}]: `,
      async (input) => {
        const trimmedInput = input.trim().toLowerCase();

        // Handle special commands
        if (["quit", "exit", "bye"].includes(trimmedInput)) {
          console.log("\n🤖 Goodbye! Thanks for chatting with me!");
          this.rl.close();
          return;
        }

        if (trimmedInput === "switch") {
          await this.selectModel();
          this.chatLoop();
          return;
        }

        if (trimmedInput === "clear") {
          await this.clearMemory();
          this.chatLoop();
          return;
        }

        if (trimmedInput === "models") {
          this.displayModelMenu();
          this.chatLoop();
          return;
        }

        if (input.trim() === "") {
          console.log(
            "Please enter a message or use commands: 'switch', 'clear', 'quit'"
          );
          this.chatLoop();
          return;
        }

        try {
          console.log(`\n🤔 ${this.selectedModel.name} is thinking...`);

          // Get response from the conversation chain
          const response = await this.conversationChain.invoke({
            input: input.trim(),
          });

          // Handle different response formats
          let responseText = "";
          if (typeof response === "string") {
            responseText = response;
          } else if (response.response) {
            responseText = response.response;
          } else if (response.text) {
            responseText = response.text;
          } else if (response.output) {
            responseText = response.output;
          } else {
            responseText = JSON.stringify(response);
          }

          console.log(`\n🤖 ${this.selectedModel.name}: ${responseText}`);

          // Show memory stats
          await this.showMemoryStats();
        } catch (error) {
          console.error("\n❌ Error:", error.message);

          if (
            error.message.includes("API key") ||
            error.message.includes("auth")
          ) {
            console.log(
              `Please check your ${this.selectedModel.provider} API key in the .env file`
            );
          }

          if (
            error.message.includes("quota") ||
            error.message.includes("limit")
          ) {
            console.log(
              "You may have reached your API quota limit. Try switching to another model."
            );
          }
        }

        this.chatLoop();
      }
    );
  }

  async clearMemory() {
    if (this.memory) {
      this.memory.clear();
      console.log("\n🧹 Memory cleared! Starting fresh conversation.");
    }
  }

  async showMemoryStats() {
    if (!this.memory) return;

    try {
      const memoryVariables = await this.memory.loadMemoryVariables({});

      let messageCount = 0;
      if (memoryVariables.history) {
        if (Array.isArray(memoryVariables.history)) {
          messageCount = memoryVariables.history.length;
        } else {
          messageCount = memoryVariables.history
            .split("\n")
            .filter((line) => line.trim()).length;
        }
      }
      console.log(
        `📊 Memory: ${messageCount} messages stored | Model: ${this.selectedModel.name}`
      );
    } catch (error) {
      console.log("📊 Memory stats unavailable");
    }
  }

  // Method to get conversation history
  async getConversationHistory() {
    if (!this.memory) return [];
    const memoryVariables = await this.memory.loadMemoryVariables({});
    return memoryVariables.history || [];
  }

  // Method to add a message to memory manually
  async addToMemory(input, output) {
    if (this.memory) {
      await this.memory.saveContext({ input }, { output });
    }
  }

  // Method to get available models info
  getAvailableModels() {
    return this.availableModels;
  }

  // Method to get current model info
  getCurrentModel() {
    return this.selectedModel;
  }
}

// Function to check API keys
function checkApiKeys() {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  const groqApiKey = process.env.GROQ_API_KEY;

  const hasGoogleKey =
    googleApiKey &&
    !googleApiKey.includes("your_") &&
    !googleApiKey.includes("_key_here");
  const hasGroqKey =
    groqApiKey &&
    !groqApiKey.includes("your_") &&
    !groqApiKey.includes("_key_here");

  if (!hasGoogleKey && !hasGroqKey) {
    console.log("⚠️  Warning: No API keys configured!");
    console.log("Please configure at least one API key:");
    console.log(
      "• Google Gemini: Get from https://aistudio.google.com/app/apikey"
    );
    console.log("• Groq: Get from https://console.groq.com/keys");
    console.log("Add them to the .env file and restart the application.");
    return false;
  }

  if (!hasGoogleKey) {
    console.log(
      "⚠️  Google Gemini API key not configured (Gemini models will be unavailable)"
    );
  }

  if (!hasGroqKey) {
    console.log(
      "⚠️  Groq API key not configured (Groq models will be unavailable)"
    );
  }

  return true;
}

// Main execution
async function main() {
  console.log("🚀 Starting Multi-Model Chatbot...");

  if (!checkApiKeys()) {
    process.exit(1);
  }

  try {
    const chatbot = new GeminiChatbot();
    await chatbot.startChat();
  } catch (error) {
    console.error("Failed to start chatbot:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n👋 Chatbot shutting down gracefully...");
  process.exit(0);
});

// Start the application
if (require.main === module) {
  main();
}

module.exports = { GeminiChatbot };
