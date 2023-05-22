
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from 'date-fns';
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { FullConversationType } from "@/app/types";
import useOtherUser from "@/app/hooks/useOtherUser";
import { useCallback, useMemo } from "react";
import Avatar from "@/app/components/Avatar";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
    data: FullConversationType,
    selected?: boolean
}
const ConversationBox: React.FC<ConversationBoxProps> = ({
    data,
    selected
}) => {

    const otherUser = useOtherUser(data);
    const session = useSession();

    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`);
    }, [data.id, router])

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];


        return messages[messages.length - 1];

    }, [data.messages]);


    const userEmail = useMemo(() => {
        return session.data?.user?.email;
    }, [session.data?.user?.email]);

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false;
        }

        const seenArray = lastMessage.seen || [];
        if (!userEmail) {
            return false;
        }
        return seenArray.filter((user) => user.email === userEmail).length !== 0;

    }, [userEmail, lastMessage])

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Sent an Image';
        }
        if (lastMessage?.body) {
            return lastMessage.body;
        }
        return "Started a Conversation"
    }, [lastMessage]);

    return (
        <div
            onClick={handleClick}
            className={
                clsx(`
           w-full
         relative
         flex
         items-center
         bg-black
         space-x-5
         p-3
         hover:bg-[#212121]
         rounded-lg
         transition
         cursor-pointer
            `,
                    selected ? 'bg-[#0ea5e9]' : 'bg-black'
                )
            }>
            {data.isGroup ? (
                <AvatarGroup users={data.users} />
            ) : (
                <Avatar user={otherUser} />
            )}
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="flex justify-between items-center mb-1">
                        <p
                            className="
                        text-white
                            text-md
                            font-medium
                        ">
                            {data.name || otherUser.name}
                        </p>
                        {lastMessage?.createdAt && (
                            <p className="
                                text-xs
                                text-white
                                font-light
                            ">
                                {format(new Date(lastMessage.createdAt), 'p')}
                            </p>
                        )}
                    </div>
                    <p className={clsx(`
                        truncate
                        text-sm
                    `,
                        hasSeen ? 'text-gray-500' : 'text-white font-medium')}>
                        {lastMessageText}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ConversationBox;