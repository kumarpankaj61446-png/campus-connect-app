
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Loader2, Sparkles, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ChatMessage = {
    role: 'user' | 'ai';
    content: string;
};

const mockResponses: Record<string, string> = {
    "how many schools are registered?": "There are currently 4 schools registered on the platform.",
    "what is the total monthly revenue?": "The total Monthly Recurring Revenue (MRR) across all schools is ₹2,082,500.",
    "which school has the most students?": "Delhi Public School has the most students with 2,500 enrolled.",
    "list all premium plan schools": "The schools on the Premium plan are: Greenwood High, Oakridge International, and Global Edge School.",
    "default": "I can help with questions about schools, users, and revenue. For example, try asking 'How many schools are registered?' or 'What is the total revenue?'"
};

export default function AdminAIChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        
        // Simulate AI response
        setTimeout(() => {
            const aiResponse: ChatMessage = {
                role: 'ai',
                content: mockResponses[input.trim().toLowerCase()] || mockResponses['default']
            };
            setMessages(prev => [...prev, aiResponse]);
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="space-y-6">
            <Card className="h-[calc(100vh-10rem)] flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot /> Admin AI Assistant</CardTitle>
                    <CardDescription>Ask me anything about your platform data. I can provide information on schools, users, revenue, and more.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <Sparkles className="w-12 h-12 mb-4"/>
                            <p className="font-semibold">Ready to assist!</p>
                            <p className="text-sm">Ask a question to get started.</p>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                {message.role === 'ai' && (
                                     <Avatar className="h-9 w-9 border">
                                        <div className="h-full w-full flex items-center justify-center bg-primary">
                                            <Bot className="h-5 w-5 text-primary-foreground"/>
                                        </div>
                                    </Avatar>
                                )}
                                <div className={`max-w-xl rounded-lg px-4 py-3 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                                    <p className="text-sm">{message.content}</p>
                                </div>
                                 {message.role === 'user' && (
                                     <Avatar className="h-9 w-9">
                                        <AvatarImage src="https://avatar.vercel.sh/Super%20Admin.png" />
                                        <AvatarFallback>SA</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))
                    )}
                     {loading && (
                        <div className="flex items-start gap-4">
                            <Avatar className="h-9 w-9 border">
                                <div className="h-full w-full flex items-center justify-center bg-primary">
                                    <Bot className="h-5 w-5 text-primary-foreground"/>
                                </div>
                            </Avatar>
                            <div className="max-w-xl rounded-lg px-4 py-3 bg-secondary flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin"/>
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                     )}
                </CardContent>
                <CardFooter className="border-t p-4">
                    <div className="relative w-full">
                        <Input 
                            placeholder="e.g., How many schools are registered?" 
                            className="pr-12"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={loading}
                        />
                        <Button 
                            size="icon" 
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={handleSendMessage}
                            disabled={loading || !input.trim()}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
