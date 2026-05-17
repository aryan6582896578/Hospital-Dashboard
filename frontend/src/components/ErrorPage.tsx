import { Link } from "react-router"

export function ErrorPage(){
    return(
        <div className="">
            <Link to="/">
                <div className="flex h-fit bg-blue-600 w-fit rounded-[10px] mt-[20px] ml-auto mr-auto cursor-pointer text-white font-bold text-[40px] p-[10px] hover:bg-blue-500 hover:underline">Error invalid Route Click Here to go back</div>
            </Link>
        </div>
        
    )
}