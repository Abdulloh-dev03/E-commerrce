"use client";

import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const { signOut } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="text-2xl text-center">You do not have an access!</h1>
      <button onClick={() => signOut()} className="cursor-pointer bg-black text-white px-4 py-2 rounded-md mt-4">Sign out</button>
    </div>
  );
};

export default Page;