"use client"

import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface UserboxProps {
    data: User
}
const UserBox: React.FC<UserboxProps> = ({
    data
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true);

        axios.post('/api/conversations', {
            userId: data.id
        })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [data, router])

    return (
        <>
        {isLoading  && (
            <LoadingModal />
        )}
       
        <div
            onClick={handleClick}
            className="
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
        "
        >
            <Avatar user={data} />
            <div className="min-w-0 flex-1">
                <div className="focus:outline-none">
                    <div className="
                        flex
                        justify-between
                        items-center
                        mb-1                    
                    ">
                        <p className="
                            text-sm
                            font-medium
                            text-white
                        ">
                            {data.name}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default UserBox;