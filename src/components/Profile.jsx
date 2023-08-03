"use client"

import { useSelector } from 'react-redux'
import Link from 'next/link'

const Profile = () => {

    const { user } = useSelector(state => state.auth);
    const { currentDelivery } = useSelector(state => state.delivery);


    return (
        <div className='container mx-auto p-5 text-center'>
            <div className='mb-4'>
                <h1 className='text-xl font-medium'>
                    Welcome, {user.userName}
                </h1>
                <p className='text-sm italic text-gray-400'>Your rights are : {user.role?.map((role, index) => <span key={index}>{role}, </span>)}</p>
            </div>

            <div className='w-full flex justify-center gap-4 items-center'>
                <Link href="/profile/delivery" className='cta'>
                    Set Delivery
                </Link>

                {/* ===============================links to be implimented============================ */}

                <button className='px-4 py-2 bg-primary-500 text-white rounded-md font-medium opacity-25' disabled>
                    Delivery mgmt
                </button>
                <button className='cta'>
                    Relase notes
                </button>
                <button className='px-4 py-2 bg-primary-500 text-white rounded-md font-medium opacity-25' disabled>
                    Delivery Advancement
                </button>
                <button className='px-4 py-2 bg-primary-500 text-white rounded-md font-medium opacity-25' disabled>
                    Delta
                </button>
            </div>
            {currentDelivery &&
                <div className="bg-green-100 px-4 py-2 max-w-2xl mx-auto rounded-md font-medium mt-7 text-center">
                    Selected delivery :
                    <span>
                        {` ${currentDelivery.deliveryDescription} of ${currentDelivery.jiraLabelDescription} to client ${currentDelivery.clientDescription}`}
                    </span>
                </div>
            }
        </div>
    )
}

export default Profile;