"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSelector } from "react-redux"

function Auth() {
    const { user } = useSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (!user.userName) {
            router.push("/");
        }
    }, [])

    return (
        <></>
    )
}

export default Auth