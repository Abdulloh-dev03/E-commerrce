import { SignIn } from "@clerk/nextjs";


export default async function Page() {
  return(
    <div className='flex items-center justify-center h-screen w-screen'>
        <SignIn/>
    </div>
  )
}