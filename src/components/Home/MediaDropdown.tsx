/** @format */

import React, { useEffect, useRef, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ImageIcon, Plus, VideoIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import ReactPlayer from "react-player";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chatStore";
import toast from "react-hot-toast";

const MediaDropdown = () => {
    const inputImage = useRef<HTMLInputElement>(null);
    const inputVideo = useRef<HTMLInputElement>(null);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateUploadUrl = useMutation(api.conversations.generateUploadUrl);
    const sendImage = useMutation(api.messages.sendImage);
    const sendVideo = useMutation(api.messages.sendVideo);

    const { selectedConversation } = useConversationStore();
    const me = useQuery(api.users.getMe);

    const handleSendImage = async () => {
        setIsLoading(true);
        try {
            const postUrl = await generateUploadUrl();
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": selectedImage!.type },
                body: selectedImage,
            });

            const { storageId } = await result.json();
            await sendImage({
                conversation: selectedConversation!._id,
                imgId: storageId,
                sender: me!._id,
            });

            setSelectedImage(null);
            //@ts-ignore
        } catch (error) {
            toast.error("Failed to send Image 🔥🔥");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendVideo = async () => {
        setIsLoading(true);
        try {
            // Step 1: Get a short-lived upload URL
            const postUrl = await generateUploadUrl();
            // Step 2: POST the file to the URL
            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": selectedVideo!.type },
                body: selectedVideo,
            });

            const { storageId } = await result.json();
            // Step 3: Save the newly allocated storage id to the database
            await sendVideo({
                videoId: storageId,
                conversation: selectedConversation!._id,
                sender: me!._id,
            });
            //@ts-ignore
            setSelectedVideo(null);
        } catch (err) {
            toast.error("Failed to send image");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <input
                type="file"
                ref={inputImage}
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files![0])}
                hidden
            />
            <input
                type="file"
                ref={inputVideo}
                accept="video/*"
                onChange={(e) => setSelectedVideo(e.target.files![0])}
                hidden
            />

            {selectedImage && (
                <MediaImageDialog
                    isOpen={selectedImage !== null}
                    onClose={() => setSelectedImage(null)}
                    selectedImage={selectedImage}
                    isLoading={isLoading}
                    handleSendImage={handleSendImage}
                />
            )}

            {selectedVideo && (
                <MediaVideoDialog
                    isOpen={selectedVideo !== null}
                    onClose={() => setSelectedVideo(null)}
                    selectedVideo={selectedVideo}
                    isLoading={isLoading}
                    handleSendVideo={handleSendVideo}
                />
            )}
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Plus className={`text-gray-600 dark:text-gray-400`} />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => inputImage.current!.click()}
                    >
                        <ImageIcon className="mr-1" size={20} /> Image
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => inputVideo.current!.click()}
                    >
                        <VideoIcon className="mr-1" size={20} /> Video
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default MediaDropdown;
type MediaImageDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedImage: File;
    isLoading: boolean;
    handleSendImage: () => void;
};

const MediaImageDialog = ({
    isOpen,
    onClose,
    selectedImage,
    isLoading,
    handleSendImage,
}: MediaImageDialogProps) => {
    const [renderedImage, setRenderedImage] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedImage) return;
        const reader = new FileReader();
        reader.onload = (e) => setRenderedImage(e.target?.result as string);
        reader.readAsDataURL(selectedImage);
    }, [selectedImage]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose();
            }}
        >
            <DialogContent>
                <DialogDescription className="flex flex-col gap-10 justify-center items-center">
                    {renderedImage && (
                        <Image
                            src={renderedImage}
                            width={300}
                            height={300}
                            alt="selected image"
                        />
                    )}
                    <Button
                        className="w-full"
                        disabled={isLoading}
                        onClick={handleSendImage}
                    >
                        {isLoading ? "Sending..." : "Send"}
                    </Button>
                </DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

type MediaVideoDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedVideo: File;
    isLoading: boolean;
    handleSendVideo: () => void;
};

const MediaVideoDialog = ({
    isOpen,
    onClose,
    selectedVideo,
    isLoading,
    handleSendVideo,
}: MediaVideoDialogProps) => {
    const renderedVideo = URL.createObjectURL(
        new Blob([selectedVideo], { type: "video/mp4" })
    );
    return (
        <Dialog
            open={isOpen}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose();
            }}
        >
            <DialogContent>
                <DialogDescription>Video</DialogDescription>
                <div className="w-full">
                    {renderedVideo && (
                        <ReactPlayer
                            url={renderedVideo}
                            controls
                            width="100%"
                        />
                    )}
                </div>
                <Button
                    className="w-full"
                    disabled={isLoading}
                    onClick={handleSendVideo}
                >
                    {isLoading ? "Sending..." : "Send"}
                </Button>
            </DialogContent>
        </Dialog>
    );
};
