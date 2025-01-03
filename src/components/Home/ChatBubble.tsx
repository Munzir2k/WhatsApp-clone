/** @format */

import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chatStore";
import ChatBubbleAvatar from "./ChatBubbleAvatar";
import DateIndicator from "./DateIndicator";

type ChatBubbleProps = {
    message: IMessage;
    me: any;
    previousMesssage?: IMessage;
};

const ChatBubble = ({ message, me, previousMesssage }: ChatBubbleProps) => {
    const date = new Date(message._creationTime);
    const hour = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
    const minute = date.getMinutes().toString().padStart(2, "0");
    const ampm = date.getHours() < 12 ? "AM" : "PM";
    const time = `${hour}:${minute} ${ampm}`;

    const { selectedConversation } = useConversationStore();
    const isMember =
        selectedConversation?.participants.includes(message.sender._id) ||
        false;
    const isGroup = selectedConversation?.isGroup;
    const fromMe = message.sender._id === me._id;

    const bgClass = fromMe ? "bg-green-chat" : "bg-white dark:bg-gray-primary";

    if (!fromMe) {
        return (
            <>
                <DateIndicator
                    message={message}
                    previousMessage={previousMesssage}
                />
                <div className="flex gap-1 w-2/3">
                    <ChatBubbleAvatar
                        message={message}
                        isMember={isMember}
                        isGroup={isGroup}
                    />
                    <div
                        className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md relative ${bgClass}`}
                    >
                        <OtherMessageIndicator />
                        <TextMessage message={message} />
                        <MessageTime time={time} fromMe={fromMe} />
                    </div>
                </div>
            </>
        );
    }
    return (
        <>
            <DateIndicator
                message={message}
                previousMessage={previousMesssage}
            />
            <div className="flex gap-1 w-2/3 ml-auto">
                <div
                    className={`flex ml-auto z-20 max-w-fit px-2 pt-1 rounded-md relative ${bgClass}`}
                >
                    <SelfMessageIndicator />
                    <TextMessage message={message} />
                    <MessageTime time={time} fromMe={fromMe} />
                </div>
            </div>
        </>
    );
};
export default ChatBubble;

const OtherMessageIndicator = () => (
    <div className="absolute bg-white dark:bg-gray-primary top-0 -left-[4px] w-3 h-3 rounded-bl-full" />
);

const SelfMessageIndicator = () => (
    <div className="absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden" />
);

const TextMessage = ({ message }: { message: IMessage }) => {
    // check if message is url
    const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content);

    return (
        <div>
            {isLink ? (
                <a
                    href={message.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mr-2 text-sm font-light text-blue-400 underline`}
                >
                    {message.content}
                </a>
            ) : (
                <p className={`mr-2 text-sm font-light`}>{message.content}</p>
            )}
        </div>
    );
};

const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
    return (
        <p className="text-[10px] mt-2 self-end flex gap-1 items-center">
            {time} {fromMe && <MessageSeenSvg />}
        </p>
    );
};
