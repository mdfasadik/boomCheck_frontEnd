import DeliveryNav from "@/components/delivery/DeliveryNav"
import DeliveryTable from "@/components/delivery/DeliveryTable"

import { Suspense } from "react";

const DeliveryPage = () => {
    return (
        <>
            <DeliveryNav />
            <Suspense fallback={<p className='text-center italic text-gray-400'>Loading...</p>}>
                <DeliveryTable />
            </Suspense>
        </>
    )
}

export default DeliveryPage