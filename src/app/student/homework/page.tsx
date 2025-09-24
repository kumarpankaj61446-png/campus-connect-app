

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FileDown, CalendarClock, Users, Bot, MoreVertical, Send, Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

const mockHomework = [
  { id: 1, subject: "Mathematics", task: "Complete Algebra exercise 5.2", teacher: "Mr. Ramesh K.", dueDate: "2024-08-10", status: "Pending" },
  { id: 2, subject: "Science", task: "Prepare a presentation on Photosynthesis", teacher: "Mrs. Sunita G.", dueDate: "2024-08-12", status: "Pending" },
  { id: 3, subject: "History", task: "Read chapter 3 of Modern India", teacher: "Mr. Verma", dueDate: "2024-08-15", status: "Pending" },
  { id: 4, subject: "English", task: "Essay on 'My Summer Vacation'", teacher: "Mrs. Das", dueDate: "2024-08-05", status: "Submitted" },
  { id: 5, subject: "Physics", task: "Lab report for experiment 3", teacher: "Mrs. Sunita G.", dueDate: "2024-08-02", status: "Graded" },
  { id: 6, subject: "Hindi", task: "Poem recitation practice", teacher: "Mrs. Sharma", dueDate: "2024-07-30", status: "Overdue" },
];

type ChatMessage = {
    user: string;
    avatar: string;
    message: string | React.ReactNode;
    isAI?: boolean;
};

const initialChatMessages: ChatMessage[] = [
    { user: 'Rohan', avatar: 'https://avatar.vercel.sh/Rohan.png', message: 'Hey, did you guys start with question 3?' },
    { user: 'You', avatar: 'https://avatar.vercel.sh/Demo Student.png', message: "Yeah, I'm a bit stuck on the second part of it." },
    { user: 'Priya', avatar: 'https://avatar.vercel.sh/Priya.png', message: "Let's check the textbook example on page 54, it might help." },
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Submitted":
        case "Graded":
            return "default";
        case "Pending":
            return "secondary";
        case "Overdue":
            return "destructive";
        default:
            return "outline";
    }
}

export default function HomeworkPage() {
  const router = useRouter();
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isFriendsChatOpen, setIsFriendsChatOpen] = useState(false);
  const [selectedHw, setSelectedHw] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [chatInput, setChatInput] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const openScheduler = (hw: any) => {
    setSelectedHw(hw);
    setIsSchedulerOpen(true);
  };

  const openFriendsChat = (hw: any) => {
    setSelectedHw(hw);
    setChatMessages(initialChatMessages); // Reset chat on open
    setIsFriendsChatOpen(true);
  };
  
  const sendToAIDoubtSolver = (hw: any) => {
    const question = `I need help with my homework for ${hw.subject}. The task is: "${hw.task}". Can you help me understand it better?`;
    sessionStorage.setItem('ai-buddy-question', question);
    toast({
        title: "Redirecting to AI Study Buddy...",
        description: "Your homework question is ready to be solved.",
    });
    router.push('/student/dashboard');
  }

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      const headers = ["Subject", "Task", "Teacher", "Due Date", "Status"];
      const csvContent = [
        headers.join(','),
        ...mockHomework.map(hw => [
          hw.subject,
          `"${hw.task.replace(/"/g, '""')}"`, // Handle quotes in task
          hw.teacher,
          hw.dueDate,
          hw.status,
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.setAttribute('download', 'homework_assignments.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Complete",
        description: "Homework assignments have been exported to CSV.",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not export homework assignments.",
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;
    const newMessage: ChatMessage = {
        user: 'You',
        avatar: 'https://avatar.vercel.sh/Demo Student.png',
        message: chatInput,
    };
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');
  };

  const handleAskAIInChat = () => {
     const aiSolution = (
        <div className="space-y-2">
            <p className="font-semibold">Sure, here is how to solve for x in 2x + 5 = 15:</p>
            <ol className="list-decimal list-inside text-sm space-y-1">
                <li>Subtract 5 from both sides: 2x = 15 - 5</li>
                <li>Simplify the equation: 2x = 10</li>
                <li>Divide both sides by 2: x = 10 / 2</li>
                <li>The answer is: x = 5</li>
            </ol>
        </div>
    );
    const newMessage: ChatMessage = {
        user: 'AI Doubt Solver',
        avatar: '', // AI has no avatar, will show Bot icon
        message: aiSolution,
        isAI: true,
    };
    setChatMessages(prev => [...prev, newMessage]);
  }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Homework Assignments</CardTitle>
            <CardDescription>
              Track, schedule, and collaborate on your homework assignments.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4" />}
            Download CSV
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHomework.map((hw) => (
                <TableRow key={hw.id}>
                  <TableCell className="font-medium">{hw.subject}</TableCell>
                  <TableCell>{hw.task}</TableCell>
                  <TableCell>{hw.teacher}</TableCell>
                  <TableCell>{hw.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(hw.status)}>
                      {hw.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {hw.status === "Pending" && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openScheduler(hw)}>
                                    <CalendarClock className="mr-2 h-4 w-4" /> Schedule
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openFriendsChat(hw)}>
                                    <Users className="mr-2 h-4 w-4" /> Do with Friends
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => sendToAIDoubtSolver(hw)}>
                                    <Bot className="mr-2 h-4 w-4" /> Ask AI Solver
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Scheduler Dialog */}
      <Dialog open={isSchedulerOpen} onOpenChange={setIsSchedulerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Homework</DialogTitle>
            <DialogDescription>Set a reminder to complete your homework for: <span className="font-semibold">{selectedHw?.subject}</span>.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label>Homework</Label>
                <p className="text-sm text-muted-foreground p-2 bg-secondary rounded-md">{selectedHw?.task}</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="reminder-date">Reminder Date</Label>
                     <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="reminder-time">Reminder Time</Label>
                    <Input id="reminder-time" type="time" defaultValue="18:00" />
                 </div>
             </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSchedulerOpen(false)}>Set Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Friends Chat Dialog */}
      <Dialog open={isFriendsChatOpen} onOpenChange={setIsFriendsChatOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Do HW with Friends</DialogTitle>
            <DialogDescription>Collaborate with your friends on: <span className="font-semibold">{selectedHw?.subject} - {selectedHw?.task}</span></DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 h-[400px] mt-4">
            <div className="col-span-1 border-r pr-4">
                <h4 className="font-semibold mb-2">Friends Online (3/5)</h4>
                <div className="space-y-3">
                  {['Rohan', 'Priya', 'Amit'].map(friend => (
                     <div key={friend} className="flex items-center gap-2 text-sm">
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={`https://avatar.vercel.sh/${friend}.png`} />
                           <AvatarFallback>{friend.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{friend}</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 ml-auto" />
                     </div>
                  ))}
                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={`https://avatar.vercel.sh/Sunita.png`} />
                           <AvatarFallback>S</AvatarFallback>
                        </Avatar>
                        <span>Sunita</span>
                        <div className="w-2 h-2 rounded-full bg-gray-400 ml-auto" />
                     </div>
                </div>
            </div>
            <div className="col-span-2 flex flex-col">
                <div className="flex-grow space-y-4 overflow-y-auto p-2 bg-secondary/50 rounded-md">
                    {chatMessages.map((chat, index) => (
                         <div key={index} className={`flex items-end gap-2 ${chat.user === 'You' ? 'justify-end' : ''} ${chat.isAI ? 'justify-center' : ''}`}>
                            {chat.user !== 'You' && !chat.isAI && (
                                <Avatar className="h-8 w-8"><AvatarImage src={chat.avatar} /></Avatar>
                            )}
                            {chat.isAI && (
                                 <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/20">
                                    <Bot className="h-5 w-5 text-primary" />
                                </div>
                            )}
                            <div className={`p-2 rounded-lg text-sm max-w-[80%] ${chat.user === 'You' ? 'bg-primary text-primary-foreground' : 'bg-background'} ${chat.isAI ? 'bg-purple-100 border border-purple-200 text-purple-900 w-full' : ''}`}>
                               {chat.message}
                            </div>
                            {chat.user === 'You' && (
                                <Avatar className="h-8 w-8"><AvatarImage src={chat.avatar} /></Avatar>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <Input 
                      placeholder="Type a message..." 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}><Send className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" onClick={handleAskAIInChat} title="Ask AI for Help">
                        <Sparkles className="h-4 w-4" />
                    </Button>
                </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
