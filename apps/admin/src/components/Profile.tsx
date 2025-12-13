"use client";

import { UserButton } from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();


  return (
    <UserButton>
      <UserButton.MenuItems>

        
        <UserButton.Action
          label="Client Dashboard"
          labelIcon={<ShoppingBag className="w-4 h-4" />}
          onClick={() => router.push(`${process.env.NEXT_PUBLIC_CLIENT_URL}`)}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
