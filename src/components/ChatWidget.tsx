import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send } from 'lucide-react';

interface ChatMessage {
    id: string;
    text: string;
    senderId: string;
    timestamp: number;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket);

        newSocket.on('chat_message', (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && socket) {
            const msg: ChatMessage = {
                id: Math.random().toString(36).substring(7),
                text: inputValue,
                senderId: socket.id || 'unknown',
                timestamp: Date.now(),
            };
            socket.emit('chat_message', msg);
            setInputValue('');
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 w-80 sm:w-96 rounded-2xl overflow-hidden border border-neon-cyan/30 bg-black/80 backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.15)] flex flex-col"
                        style={{ height: '450px' }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-black/50 border border-neon-cyan/50">
                                    <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_10px_rgba(0,243,255,0.8)]"></div>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold tracking-wider text-sm">NEXUS COMM</h3>
                                    <p className="text-[10px] text-neon-cyan/80 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        Encrypted Channel
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm">
                                    <MessageSquare className="w-8 h-8 opacity-20 mb-2" />
                                    <p className="italic">Initiating connection...</p>
                                    <p className="text-[10px] uppercase tracking-widest mt-1 opacity-50">Secure channel opened</p>
                                </div>
                            ) : (
                                messages.map((msg, index) => {
                                    const isMe = msg.senderId === socket?.id;
                                    const showSender = index === 0 || messages[index - 1].senderId !== msg.senderId;

                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                        >
                                            {!isMe && showSender && (
                                                <span className="text-[10px] text-neon-purple uppercase tracking-wider mb-1 ml-1 opacity-80">
                                                    User_{msg.senderId.substring(0, 4)}
                                                </span>
                                            )}

                                            <div
                                                className={`max-w-[85%] p-3 text-sm shadow-md ${isMe
                                                        ? 'bg-gradient-to-br from-neon-cyan/20 to-blue-500/20 border border-neon-cyan/30 text-white rounded-2xl rounded-br-none shadow-[0_4px_15px_rgba(0,243,255,0.1)]'
                                                        : 'bg-white/5 border border-white/10 text-gray-200 rounded-2xl rounded-bl-none'
                                                    }`}
                                            >
                                                {msg.text}
                                            </div>

                                            <span className="text-[10px] text-gray-500 mt-1 px-1">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-black/60 backdrop-blur-md">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Transmit message..."
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all font-light"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-1.5 w-8 h-8 flex items-center justify-center rounded-full bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/40 hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 disabled:hover:bg-neon-cyan/20 transition-all"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-black shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(157,0,255,0.6)] border border-white/20 transition-all duration-300 z-50 relative group"
            >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                {!isOpen && messages.length > 0 && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-black rounded-full animate-pulse"></span>
                )}
            </motion.button>
        </div>
    );
}
