'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Button from "./ui/Button";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {session.user?.image && (
          <img 
            src={session.user.image} 
            alt={session.user.name} 
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className="hidden md:block">
          <p className="text-sm font-medium">{session.user.name}</p>
          <p className="text-xs text-gray-500">{session.user.email}</p>
        </div>
        <Button 
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white text-sm"
        >
          Sign out
        </Button>
      </div>
    );
  }
  return (
    <Button 
      onClick={() => signIn("google")}
      className="bg-blue-500 hover:bg-blue-600 text-white"
    >
      Sign in with Google
    </Button>
  );
}
