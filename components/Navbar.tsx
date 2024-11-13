"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useRouter } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { User } from "@/lib/models/user";

const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
      <span className="text-primary-foreground font-bold">C</span>
    </div>
    <span className="font-bold text-lg">Chillhost</span>
  </div>
);

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null); // Ceci serait remplacé par l'état d'authentification réel
  const router = useRouter();

  const handleAuth = (action: "login" | "register") => {
    router.push(
      `/auth?action=${action}&callbackUrl=${encodeURIComponent(
        window.location.href
      )}`
    );
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.profilePicture?.url} />
                  <AvatarFallback>
                    {user.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/settings">Paramètres</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUser(null)}>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => handleAuth("login")}>
                Connexion
              </Button>
              <Button onClick={() => handleAuth("register")}>
                Inscription
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
