import { toast } from "react-toastify"

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getHeartBeat() {
    const url = API_URL + "/api/heartbeat";
    try {

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok)
            throw new Error("Failed to load Heart Beat");

        const data = await res.json();

        return data;
    } catch (error) {
        toast.error(error.message);
    }
}