import React from 'react';
import {signIn} from "@/auth";
import LoginCredential from "@/components/LoginCredential";

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Login to Your Account</h2>
                <LoginCredential/>

                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
                    <span className="text-sm">or</span>
                    <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
                </div>


                <form action={async () => {
                        "use server"
                        await signIn("google",{
                            redirect: true,
                            redirectTo: "/"
                        })
                    }}>

                    <button
                        type="submit"
                        className="w-full cursor-pointer py-2 px-4 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Login with Google</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
