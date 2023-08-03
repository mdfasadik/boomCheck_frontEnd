"use client"
import { getHeartBeat } from "@/services/heartBeatService"
import { useEffect, useState } from "react";

const Footer = () => {
    const [heartBeat, setHeartBeat] = useState({});
    const [fetching, setFetching] = useState(false);

    const heartBeatData = async () => {

        setFetching(true);
        const heartBeat = await getHeartBeat();
        setHeartBeat(heartBeat);
        setFetching(false);
    }

    useEffect(() => {
        heartBeatData();
    }, [])

    return (
        <>
            { !fetching &&
                <footer className="w-full h-20 px-4 mt-12">
                <span>Pacman DB : </span> {heartBeat?.PACMAN ? (<span className="text-green-500">OK, </span>) : (<span className="text-red-500">NOT OK, </span>)}
                <span>BoomCheck DB : </span> {heartBeat?.BOOMCHECK ? (<span className="text-green-500">OK, </span>) : (<span className="text-red-500">NOT OK, </span>)}
                <span>Jira : </span> {heartBeat?.JIRA ? (<span className="text-green-500">OK, </span>) : (<span className="text-red-500">NOT OK, </span>)}
                <span>Gitlab : </span> {heartBeat?.GITLAB ? (<span className="text-green-500">OK</span>) : (<span className="text-red-500">NOT OK </span>)}
            </footer>}
        </>
    )
}

export default Footer