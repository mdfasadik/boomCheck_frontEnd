"use client"

import { useSelector, useDispatch } from "react-redux"
import { setCurrentDelivery, resetDeliveryInput } from "@/redux/features/deliverySlice"

// import CreateDelivery from "./CreateDelivery"

const DeliveryNav = () => {
    const { selectedDelivery, createDeliveryModalOpen, currentDelivery } = useSelector((state) => state.delivery);
    const dispatch = useDispatch();

    const handleSetCurrentDelivery = () => {
        dispatch(resetDeliveryInput(false));
        dispatch(setCurrentDelivery(selectedDelivery));
    }

    const handleRemoveCurrentDelivery = () => {
        dispatch(resetDeliveryInput(true));
        dispatch(setCurrentDelivery(null));
    }

    return (
        <>
            {/* {createDeliveryModalOpen && <CreateDelivery />} */}
            <div className='w-full px-6 py-2 flex justify-end'>
                <div className="flex gap-2">
                    <button onClick={handleSetCurrentDelivery} className='px-4 py-2 bg-gray-200 hover:bg-gray-300 transition duration-150 rounded-md flex gap-2 items-center'>
                        Set as current delivery
                    </button>
                    {currentDelivery &&
                        <button onClick={handleRemoveCurrentDelivery} className='px-4 py-2 bg-gray-200 hover:bg-gray-300 transition duration-150 rounded-md flex gap-2 items-center'>
                            Remove current delivery
                        </button>
                    }
                </div>
            </div>
        </>
    )
}

export default DeliveryNav