"use client"

import { ToastContainer } from 'react-toastify';

const ToastProvider = ({ children }) => {
    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={1500}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />
            {children}
        </>
    )
}

export default ToastProvider