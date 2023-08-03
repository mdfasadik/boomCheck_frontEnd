"use client"
import { RxCross2 } from "react-icons/rx"

export default function DeleteModal({ label, onDelete, setShowModal }) {
    

    return (
        <div className="w-screen h-screen fixed inset-0 bg-black/25 z-10 flex justify-center items-center">
            <div className="bg-white px-6 py-4 rounded-md flex flex-col gap-4" onClick={()=> setShowModal(false)}>
                <button className="flex w-full justify-end text-2xl">
                    <span className="rounded-full p-2 bg-gray-100 hover:bg-gray-200">
                        <RxCross2 />
                    </span>
                </button>
                <p> Are you sure you want to delte {<span className="font-bold">{label}</span>} ?</p>
                <button className="w-full cta bg-red-500" onClick={onDelete}>Delete</button>
            </div>
        </div>
    )
}
