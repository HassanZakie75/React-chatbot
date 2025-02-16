import { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: input,
      });

      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong... Maybe the apocalypse is near." },
      ]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-lg p-6 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-300 mb-4">💀 DepressoBot 💀</h2>

        <div className="h-96 overflow-y-auto p-3 space-y-3 bg-gray-700 rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 max-w-[75%] rounded-lg ${
                msg.sender === "user" ? "bg-blue-500 self-end ml-auto" : "bg-gray-600"
              }`}
            >
              <span className="block text-xs font-bold text-gray-300">
                {msg.sender === "user" ? "You" : "DepressoBot"}
              </span>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-1 p-2 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 transition-all rounded-lg font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
