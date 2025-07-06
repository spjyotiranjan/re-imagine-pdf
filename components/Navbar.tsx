import React from 'react';
import {auth, signOut} from "@/auth";
import Image from "next/image";
import Link from "next/link";
import {User} from "lucide-react";

const Navbar = async () => {
    const session = await auth();
    return (
        <div className="navbar gray-container">
            <Link href={"/"}>Home</Link>
            <div>
                {session && session?.user ? (
                    <div className={"flex justify-between items-center gap-10"}>
                        <form action={async () => {
                            "use server"
                            await signOut({redirectTo: "/"})
                        }}>
                            <button className={"cursor-pointer flex justify-center items-center"} type={"submit"}>
                                <span className={"max-sm:hidden"}>Logout</span>
                            </button>
                        </form>

                        <div className={"navbar-right"}>
                            {session?.user?.image ? (<Image src={session?.user?.image as string || ""} alt={"User Logo"} width={50} height={50}
                                                            className={"rounded-full"}/>):
                                (<div className={"rounded-full w-[50px] h-[50px] bg-gray-200 flex justify-center items-center"}>
                                    <User />
                                </div>)
                            }

                            <div className={"flex-col justify-between"}>
                                <p className={"text-black font-medium "}>{session?.user?.name}</p>
                                <p className={"text-gray-500 text-sm font-extralight"}>{session?.user?.email}</p>
                            </div>
                        </div>
                    </div>

                ) : (
                    // <form className={'cursor-pointer'} action={async () => {
                    //     "use server"
                    //     signIn("google")
                    // }}>
                    //     <button className={"cursor-pointer flex justify-center items-center text-black"}
                    //             type={"submit"}>
                    //         <span>Login</span>
                    //     </button>
                    // </form>
                    <Link className={"text-black"} href={"/login"}>Login</Link>
                )}
            </div>
        </div>
    )
}

export default Navbar;
