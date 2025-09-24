
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { processVoiceCommand } from '@/ai/flows/voice-assistant';
import { useSidebar } from '@/components/ui/sidebar';

// This is a browser-only feature.
const SpeechRecognition =
  typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : undefined;

export function VoiceCommand() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { userRole } = useSidebar();

  useEffect(() => {
    if (!SpeechRecognition) {
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Can be changed based on user preference

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Automatically process the command when listening stops
      if (transcript) {
          handleProcessCommand(transcript);
      }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
             toast({
                variant: 'destructive',
                title: 'Microphone Access Denied',
                description: 'Please enable microphone permissions in your browser settings.',
             });
        }
        setIsListening(false);
    }

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [toast, transcript]); // Added transcript to dependency array

  const handleStartListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setIsListening(true);
      try {
        recognitionRef.current.start();
      } catch (e) {
         console.error(e);
         setIsListening(false);
      }
    } else {
        toast({
            variant: 'destructive',
            title: 'Voice Commands Not Supported',
            description: 'Your browser does not support the Web Speech API.',
        });
    }
  };
  
  const handleStopListening = () => {
    if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsListening(false);
    }
  }

  const handleProcessCommand = async (commandToProcess: string) => {
    if (!commandToProcess || !userRole) return;
    setIsProcessing(true);
    setTranscript(commandToProcess); 
    
    const capitalizedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

    try {
        const result = await processVoiceCommand({ command: commandToProcess, role: capitalizedRole as any });
        
        if (result.action === 'navigate') {
            router.push(result.target);
            toast({
                title: 'Navigating...',
                description: `Taking you to the requested page.`,
            });
        } else if (result.action === 'error') {
            toast({
                variant: 'destructive',
                title: 'Command Not Understood',
                description: result.target || "I couldn't understand that command. Please try again.",
            });
        }
    } catch (error) {
        console.error("Error processing voice command:", error);
        toast({
            variant: 'destructive',
            title: 'AI Error',
            description: 'There was a problem processing your command.',
        });
    } finally {
        setIsProcessing(false);
        setTranscript('');
        setIsListening(false); // Ensure dialog closes
    }
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={handleStartListening}>
        <Mic className="h-5 w-5" />
        <span className="sr-only">Use Voice Command</span>
      </Button>

      <Dialog open={isListening || isProcessing} onOpenChange={(open) => !open && handleStopListening()}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Mic className="text-primary"/> Voice Command
            </DialogTitle>
            <DialogDescription>
              {isProcessing ? "Processing your command..." : "I'm listening... What would you like to do?"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center h-32 text-center text-lg font-semibold bg-secondary/50 rounded-md p-4">
            {isProcessing && !transcript ? (
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            ) : (
                <p>{transcript || "..."}</p>
            )}
          </div>
          
          <DialogFooter className="gap-2">
            {isListening ? (
                <Button variant="destructive" onClick={handleStopListening}>
                    <MicOff className="mr-2" /> Stop Listening
                </Button>
            ) : (
                 <Button onClick={() => handleProcessCommand(transcript)} disabled={!transcript || isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2" />}
                    Process Command
                </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
