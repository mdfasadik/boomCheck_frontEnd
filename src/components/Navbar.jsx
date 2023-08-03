"use client"

import Image from "next/image"
import Link from "next/link"


const Navbar = () => {
    return (
        <nav>
            <div className={`relative w-[200px] h-8 ml-5 mt-5`}>
                <Link href={"/"}>
                    <Image
                        src="/icon.png"
                        alt="logo"
                        fill
                        className="object-contain"
                    />
                </Link>
            </div>
        </nav>
    )
}

export default Navbar