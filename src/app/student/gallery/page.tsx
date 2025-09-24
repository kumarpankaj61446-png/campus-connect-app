
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const mockPhotos = [
    { id: 1, src: "https://picsum.photos/seed/event1/600/400", alt: "Sports Day Event", hint: "sports day" },
    { id: 2, src: "https://picsum.photos/seed/event2/600/400", alt: "Science Fair", hint: "science fair" },
    { id: 3, src: "https://picsum.photos/seed/event3/600/400", alt: "Annual Day Function", hint: "annual function" },
    { id: 4, src: "https://picsum.photos/seed/event4/600/400", alt: "Art Exhibition", hint: "art exhibition" },
    { id: 5, src: "https://picsum.photos/seed/event5/600/400", alt: "Christmas Celebration", hint: "celebration" },
    { id: 6, src: "https://picsum.photos/seed/event6/600/400", alt: "Independence Day", hint: "independence day" },
];


export default function SchoolGalleryPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>School Gallery</CardTitle>
                    <CardDescription>Photos from recent school events and programs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Please Note</AlertTitle>
                        <AlertDescription>
                            These photos will be automatically removed from the gallery 60 days after being uploaded. Please download any photos you wish to keep.
                        </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockPhotos.map((photo) => (
                             <Card key={photo.id} className="overflow-hidden">
                                <div className="relative aspect-video">
                                     <Image 
                                        src={photo.src} 
                                        alt={photo.alt} 
                                        fill
                                        className="object-cover"
                                        data-ai-hint={photo.hint}
                                    />
                                </div>
                               <CardContent className="p-4 flex justify-between items-center">
                                    <p className="text-sm font-medium">{photo.alt}</p>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={photo.src} download target="_blank" rel="noopener noreferrer">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </a>
                                    </Button>
                               </CardContent>
                            </Card>
                        ))}
                    </div>

                     <div className="text-center pt-6">
                        <Button asChild>
                            <Link href="#" target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View More Photos & Videos
                            </Link>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                            You will be redirected to our full media gallery (e.g., a Google Photos album).
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
