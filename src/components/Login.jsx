"use client"

import { useState, useEffect } from "react"
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";
import Joi from 'joi';
import { joiResolver } from '@hookform/resolvers/joi';
import { HiEye, HiEyeOff } from "react-icons/hi"

import { login, DecodeToken } from "@/services/authService";

import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/features/authSlice";



const Login = () => {
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch(state => state.auth);


    useEffect(() => {
        if (user.userName) {
            router.push("/profile");
        }
    }, [])

    //----------------------------------login credential schema-------------------------------------//
    const schema = Joi.object({
        username: Joi.string().max(180).required().label("Username"),
        password: Joi.string().max(180).required().label("Password")
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: joiResolver(schema)
    })

    const onSubmit = async (data) => {
        setLoading(true);
        const token = await login(data);

        if (token) {
            const decodedToken = DecodeToken(token);
            const user = JSON.parse(decodedToken.sub);
            dispatch(setUser({ token, user }))
            Cookies.set("user", JSON.stringify(user), { expires: 7 })
            router.push("/profile");
        }
        setLoading(false);
    }

    return (
        <>
            <div className="flex flex-col justify-center sm:py-12">
                <div className="xs:p-0 mx-auto md:w-full md:max-w-md">
                    <h1 className="font-bold text-center text-2xl mb-5">Login</h1>
                    <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">

                        <form className="px-5 py-7" onSubmit={handleSubmit(onSubmit)}>
                            <label className="font-semibold text-sm text-gray-600 pb-1 block">Username</label>
                            {/* --------------------------------------------username input field------------------------------------- */}
                            <input autoFocus={errors.userName} type="text" className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:ring focus:ring-primary-500" {...register("username")} />
                            {errors.username && <p className="text-red-700 rounded-md mb-4">{errors.username.message}</p>}

                            <label className="font-semibold text-sm text-gray-600 pb-1 block">Password</label>

                            {/* --------------------------------------------password input field------------------------------------- */}
                            <div className="relative">
                                <span className="text-gray-400 absolute inset-y-4 right-4 cursor-pointer" onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <HiEye /> : <HiEyeOff />}
                                </span>
                                <input autoFocus={errors.password} type={showPass ? "text" : "password"} className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:ring focus:ring-primary-500" {...register("password")} />
                                {errors.password && <p className="text-red-700 rounded-md mb-4">{errors.password.message}</p>}
                            </div>


                            <button type="submit" className="transition duration-200 bg-primary-500 hover:bg-primary-500/60 focus:bg-primary-500 focus:shadow-sm focus:ring-4 focus:ring-primary-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
                                disabled={loading ? true : false}>
                                <span className="inline-block mr-2">{loading ? "Logging in..." : "Login"}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Login