
'use client';

import { useRef, type ReactNode, type ComponentProps } from 'react';
import { Button } from './button';
import { useToast } from '@/hooks/use-toast';

type UploadButtonProps = ComponentProps<typeof Button> & {
    onFileSelect: (file: File) => void;
    children: ReactNode;
};

export function UploadButton({ onFileSelect, children, ...props }: UploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
        } else {
             toast({
                variant: "destructive",
                title: "No File Selected",
                description: "Please select a file to upload.",
            });
        }
        // Reset the input value to allow selecting the same file again
        if(inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <>
            <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <Button onClick={handleClick} {...props}>
                {children}
            </Button>
        </>
    );
}
