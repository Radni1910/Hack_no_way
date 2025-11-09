import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { sendMessage, listenToMessages } from "../firebase";
import { auth } from "../firebase";

const ChatRoom = ({ chatRoomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  // 🔁 Listen for messages in real time
  useEffect(() => {
    const unsubscribe = listenToMessages(chatRoomId, (allMessages) => {
      setMessages(allMessages);
    });
    return () => unsubscribe && unsubscribe();
  }, [chatRoomId]);

  // ✉ Send a new message
  const handleSend = async (e) => {
    e.preventDefault();
    if (newMsg.trim() === "") return;

    const user = auth.currentUser;
    const senderEmail = user ? user.email : "Guest";

    const messageObj = {
      text: newMsg,
      timestamp: Date.now(),
      sender: senderEmail,
    };

    try {
      await sendMessage(chatRoomId, messageObj);
      setNewMsg("");

      // 🤖 Auto bot response after short delay
      setTimeout(async () => {
        const botMessage = generateBotReply(newMsg);
        await sendMessage(chatRoomId, {
          text: botMessage,
          timestamp: Date.now(),
          sender: "CampusVerse Bot 🤖",
        });
      }, 1000);
    } catch (error) {
      console.error("❌ Failed to send message:", error.message);
      alert("Failed to send message. Please check Firebase permissions.");
    }
  };

  // 🧩 Simple bot reply generator
  const generateBotReply = (userMsg) => {
    const msg = userMsg.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi"))
      return "👋 Hi there! How can I help you with your project or team today?";
    if (msg.includes("project"))
      return "🚀 That sounds exciting! Are you looking for collaborators or feedback?";
    if (msg.includes("help"))
      return "🧠 Sure! You can describe what you’re working on, and I’ll try to guide you.";
    if (msg.includes("thanks"))
      return "😊 You’re welcome! Happy building!";
    return "💬 Interesting! Tell me more about your idea or team.";
  };

  return (
    <div className="flex flex-col bg-gray-800 rounded-xl shadow-lg h-[500px]">
      {/* Header */}
      <div className="bg-indigo-700 text-white p-4 rounded-t-xl flex justify-between items-center">
        <h2 className="text-lg font-bold">Chat Room: {chatRoomId}</h2>
        <span className="text-xs text-gray-300">
          {messages.length} message{messages.length !== 1 && "s"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-900 rounded-b-xl scrollbar-thin scrollbar-thumb-gray-700">
        {messages.length > 0 ? (
          messages
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  auth.currentUser?.email === msg.sender
                    ? "items-end"
                    : msg.sender.includes("Bot")
                    ? "items-center"
                    : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                    msg.sender.includes("Bot")
                      ? "bg-gray-700 text-yellow-300 font-semibold"
                      : auth.currentUser?.email === msg.sender
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-700 text-gray-100"
                  }`}
                >
                  <p className="text-sm break-words">{msg.text}</p>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {msg.sender.split("@")[0]} •{" "}
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))
        ) : (
          <p className="text-gray-500 text-center mt-20">
            👋 No messages yet. Say hello!
          </p>
        )}
      </div>

      {/* Input Box */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-gray-700 flex items-center gap-3 bg-gray-800 rounded-b-xl"
      >
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 text-gray-100 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;