// import React, { useState } from 'react';
// import { Send } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// const ChatWidget = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!newMessage.trim()) return;

//         setMessages([
//             ...messages,
//             { text: newMessage, sender: 'user', timestamp: new Date() }
//         ]);
//         setNewMessage('');

//         // Thêm tin nhắn tự động phản hồi
//         setTimeout(() => {
//             setMessages(prev => [
//                 ...prev,
//                 {
//                     text: 'Cảm ơn bạn đã gửi tin nhắn. Chúng tôi sẽ phản hồi sớm nhất có thể.',
//                     sender: 'admin',
//                     timestamp: new Date()
//                 }
//             ]);
//         }, 1000);
//     };

//     return (
//         <div className="fixed bottom-4 right-4 z-50">
//             {!isOpen ? (
//                 <Button
//                     onClick={() => setIsOpen(true)}
//                     className="rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 shadow-lg"
//                 >
//                     <Send className="h-6 w-6 text-white" />
//                 </Button>
//             ) : (
//                 <Card className="w-80 h-96 shadow-xl">
//                     <div className="bg-blue-500 p-4 text-white flex justify-between items-center rounded-t-lg">
//                         <h3 className="font-medium">Chat với chúng tôi</h3>
//                         <button
//                             onClick={() => setIsOpen(false)}
//                             className="text-white hover:text-gray-200"
//                         >
//                             ✕
//                         </button>
//                     </div>

//                     <CardContent className="p-4 h-full flex flex-col">
//                         <div className="flex-1 overflow-y-auto mb-4 space-y-4">
//                             {messages.map((message, index) => (
//                                 <div
//                                     key={index}
//                                     className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
//                                         }`}
//                                 >
//                                     <div
//                                         className={`max-w-[80%] rounded-lg p-2 ${message.sender === 'user'
//                                                 ? 'bg-blue-500 text-white'
//                                                 : 'bg-gray-100'
//                                             }`}
//                                     >
//                                         {message.text}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>

//                         <form onSubmit={handleSubmit} className="flex gap-2">
//                             <input
//                                 type="text"
//                                 value={newMessage}
//                                 onChange={(e) => setNewMessage(e.target.value)}
//                                 placeholder="Nhập tin nhắn..."
//                                 className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                             <Button type="submit" size="sm">
//                                 <Send className="h-4 w-4" />
//                             </Button>
//                         </form>
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     );
// };

// export default ChatWidget;