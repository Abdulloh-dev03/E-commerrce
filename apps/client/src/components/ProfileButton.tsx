"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ShoppingBag, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileButton() {
  const router = useRouter();
  const { user } = useUser();

  const role = user?.publicMetadata?.role;

  return (
    <UserButton>
      <UserButton.MenuItems>

        
        <UserButton.Action
          label="See Orders"
          labelIcon={<ShoppingBag className="w-4 h-4" />}
          onClick={() => router.push("/orders")}
        />

        {role === "admin" && (
          <UserButton.Action
            label="Admin Dashboard"
            labelIcon={<ShieldCheck className="w-4 h-4" />}
            onClick={() => router.push(`${process.env.NEXT_PUBLIC_ADMIN_URL}`)}
          />
        )}

      </UserButton.MenuItems>
    </UserButton>
  );
}
