"use client"
import { IoMdClose } from "react-icons/io"

import { useDispatch, useSelector } from "react-redux"
import { setCreateDeliveryModalOpen } from "@/redux/features/deliverySlice"

const CreateDelivery = () => {
    const dispatch = useDispatch();
    const { clients, jiraLabels } = useSelector((state) => state.delivery)

    const handleCreateDeliveryModal = () => {
        dispatch(setCreateDeliveryModalOpen());
    }
    return (
        <div className='w-screen min-h-screen fixed inset-0 bg-black/50 flex justify-center items-start px-4 py-6'>
            <div className='py-4 px-6 rounded-md bg-white w-full'>
                <div className="w-full flex justify-between items-center">
                    <h1 className='text-xl font-semibold'>Create Delivery</h1>
                    <button className='text-2xl rounded-full hover:bg-gray-100 transition duration-150 p-2' onClick={handleCreateDeliveryModal}>
                        <IoMdClose />
                    </button>
                </div>
                <form className="w-full mt-10">
                    <div className="w-full flex justify-between gap-4">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col gap-2 mb-5">
                                <label htmlFor="delivery" className="text-lg font-medium">Delivery</label>
                                <input id="delivery" type="text" className="border border-gray-200 px-4 py-1 rounded-md focus:ring focus:ring-primary-500/50 focus:outline-none" placeholder="Delivery..." />
                            </div>
                            <div className="flex flex-col gap-2 mb-5">
                                <label htmlFor="client" className="text-lg font-medium">Client</label>
                                <select id="client" type="text" className="border border-gray-200 bg-transparent px-4 py-1 rounded-md focus:ring focus:ring-primary-500/50 focus:outline-none" placeholder="Delivery...">
                                    <option>Select</option>
                                    {clients.map((client, index) => <option key={index} value={client}>{client}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 mb-5">
                                <label htmlFor="jiraLabel" className="text-lg font-medium">Jira Label</label>
                                <select id="jiraLabel" type="text" className="border border-gray-200 bg-transparent px-4 py-1 rounded-md focus:ring focus:ring-primary-500/50 focus:outline-none" placeholder="Delivery...">
                                    <option>Select</option>
                                    {jiraLabels.map((jiraLabel, index) => <option key={index} value={jiraLabel}>{jiraLabel}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col gap-2 mb-5">
                                <label htmlFor="pacfile" className="text-lg font-medium">Reference Pacfile</label>
                                <select id="pacfile" type="text" className="border border-gray-200 bg-transparent px-4 py-1 rounded-md focus:ring focus:ring-primary-500/50 focus:outline-none" placeholder="Delivery...">
                                    <option>Select</option>
                                    {jiraLabels.map((jiraLabel, index) => <option key={index} value={jiraLabel}>{jiraLabel}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="bg-primary-500 rounded-md w-full hover:bg-primary-500/60 transition duration-150 px-4 py-2 text-white font-medium">Create Delivery</button>
                </form>
            </div>
        </div>
    )
}

export default CreateDelivery