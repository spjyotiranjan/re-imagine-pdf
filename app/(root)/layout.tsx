import Navbar from "@/components/Navbar";
import SideNav from "@/components/SideNav";

export default function Layout({children}: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className={"p-3 text-black flex gap-3 h-screen"}>
            {/*<SideNav/>*/}
            <div className={"flex-col w-full h-full"}>
                <Navbar/>
                {children}
            </div>
        </main>
    )
}