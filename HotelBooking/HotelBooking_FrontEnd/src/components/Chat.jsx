// import React, { useState, useEffect, useRef } from 'react';
// import ChatService from '../services/ChatService';

// const Chat = ({ currentUser, selectedRecipient }) => {
//     const [messages, setMessages] = useState([]);
//     const [messageText, setMessageText] = useState('');
//     const [connected, setConnected] = useState(false);
//     const messagesEndRef = useRef(null);

//     useEffect(() => {
//         // Kết nối WebSocket khi component mount
//         ChatService.connect(
//             currentUser.id,
//             () => setConnected(true),
//             error => console.error('Could not connect to WebSocket server:', error)
//         );

//         // Đăng ký handler nhận tin nhắn
//         const unsubscribe = ChatService.addMessageHandler(message => {
//             setMessages(prev => [...prev, message]);
//         });

//         // Cleanup khi component unmount
//         return () => {
//             unsubscribe();
//             ChatService.disconnect();
//         };
//     }, [currentUser.id]);

//     useEffect(() => {
//         // Cuộn xuống tin nhắn mới nhất
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [messages]);

//     const handleSend = (e) => {
//         e.preventDefault();
//         if (!messageText.trim() || !connected) return;

//         const message = {
//             senderId: currentUser.id,
//             recipientId: selectedRecipient.id,
//             content: messageText,
//             type: 'CHAT',
//             timestamp: new Date()
//         };

//         ChatService.sendMessage(message);
//         setMessageText('');
//     };

//     return (
//         <div className="flex flex-col h-full">
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                 {messages.map((message, index) => (
//                     <div
//                         key={index}
//                         className={`flex ${message.senderId === currentUser.id
//                                 ? 'justify-end'
//                                 : 'justify-start'
//                             }`}
//                     >
//                         <div
//                             className={`max-w-[70%] p-3 rounded-lg ${message.senderId === currentUser.id
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-gray-100'
//                                 }`}
//                         >
//                             <p>{message.content}</p>
//                             <span className="text-xs opacity-70">
//                                 {new Date(message.timestamp).toLocaleTimeString()}
//                             </span>
//                         </div>
//                     </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </div>

//             <form onSubmit={handleSend} className="p-4 border-t">
//                 <div className="flex space-x-2">
//                     <input
//                         type="text"
//                         value={messageText}
//                         onChange={(e) => setMessageText(e.target.value)}
//                         placeholder="Nhập tin nhắn..."
//                         className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-600"
//                     />
//                     <button
//                         type="submit"
//                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                         disabled={!connected}
//                     >
//                         Gửi
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default Chat;