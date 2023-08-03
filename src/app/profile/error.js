"use client"

import React from 'react'

export default function Error({ err, reset }) {
    return (
        <div className='container mx-auto bg-red-50 flex justify-center items-center flex-col p-4'>
            <h1 className='p-1 w-1/2 my-2 rounded-md text-red-600 text-center text-2xl font-bold'>Something Went Wrong!</h1>
            <button onClick={() => reset()} className='bg-primary-500 text-white rounded-md px-2 py-1'>Try Again!</button>
        </div>
    )
}
