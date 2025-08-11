import { useChat } from "@/context";
import React from "react";

const ChatDefaultTemplate = () => {
  const DefaultItems = [
    {
      id: 1,
      category: "Productivity",
      question: "Give me 5 tips to stay focused while working from home.",
    },
    {
      id: 2,
      category: "Learning",
      question: "Explain JavaScript closures with an example.",
    },
    {
      id: 3,
      category: "Creative",
      question: "Write a short story about a robot who learns to dream.",
    },
    {
      id: 4,
      category: "Tech Help",
      question: "How can I improve the performance of a React application?",
    },
  ];
  const { sendMessage } = useChat();
  const handleOnClick = (question) => {
    sendMessage(question);
  };
  return (
    <ul className="w-full grid grid-cols-2 gap-4 p-4">
      {DefaultItems.map((item) => (
        <li
          key={item.id}
          className="p-6 border rounded-md shadow-sm bg-neutral-800 border-neutral-600 hover:bg-neutral-700 cursor-pointer transition "
          onClick={() => handleOnClick(item.question)}
        >
          <span className="text-white font-medium">{item.category}</span>
          <p className="text-gray-300">{item.question}</p>
        </li>
      ))}
    </ul>
  );
};

export default ChatDefaultTemplate;
