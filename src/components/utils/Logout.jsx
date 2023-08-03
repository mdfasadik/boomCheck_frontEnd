"use client"

import { useState } from "react"
import { FaPowerOff } from "react-icons/fa"
import { useRouter } from "next/navigation"

import { useDispatch } from "react-redux"
import { logOutUser } from "@/redux/features/authSlice"

const Logout = () => {
    const [expand, setExpand] = useState(false);
    const [loading, setLoading] = useState(false);


    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogout = () => {
        setLoading(true);
        dispatch(logOutUser());
        setLoading(false);
        router.push("/");
    }

    return (
        <div className="w-full flex justify-end py-2 px-6 border-b border-b-gray-200 relative">
            <button className='rounded-full p-4 bg-gray-100 hover:bg-gray-200 transition duration-150 text-red-600'
                onClick={() => setExpand(!expand)}>
                <FaPowerOff />
            </button>
            {expand &&
                <div className="shadow-lg bg-white rounded-md py-4 flex flex-col justify-center items-center absolute top-full">
                    <button className="px-8 py-2 hover:bg-gray-200 transition duration-150" onClick={handleLogout} disabled={loading ? true : false}>
                        {loading ? "Logging Out..." : "Logout"}
                    </button>
                </div>}
        </div>
    )
}

export default Logout