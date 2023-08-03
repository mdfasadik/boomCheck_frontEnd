import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

import { toast } from "react-toastify"



const API_URL = process.env.NEXT_PUBLIC_API_URL;

const cookieKeys = {
    user: "user"
}

export async function login(data) {
    const url = API_URL + "/api/login"
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!res.ok)
            throw new Error("Invalid Username or Password");
        const token = res.text()
        // const token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ7XCJ1c2VyTmFtZVwiOlwic2Fyd2FyMlwiLFwicm9sZVwiOltcIlZpZXcgYW5kIHByaW50IHJlcG9ydHNcIixcIkVkaXQgZGVsaXZlcmllc1wiXSxcImdyb3VwXCI6W1wiU0RBLUhcIixcIlVzZXJzXCJdfSIsImlhdCI6MTY4NzE1NjU2MSwiZXhwIjoxNjg3MjQyOTYxfQ.VKcBazHhIpg_oiW0u-94ZJV7ILm_vg4JXCmJw6TTMnAJGfloBFfPpOdfpog3_-ZLujvyRUzBsEvnc3v3UWDIVA"
        toast.success("Login Successful");

        return token;
    } catch (err) {
        toast.error(err.message)
    }
}

export function logout() {
    Cookies.remove(cookieKeys.user);
}

export function DecodeToken(token) {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken;
    } catch (error) {
        //======================================replace with nottification=========================//
        console.log(err.message);
    }

}


export function getUserFromCookie() {
    const cookie = Cookies.get(cookieKeys.user);
    let user;
    if (cookie)
        user = JSON.parse(cookie);
    return user;
}
