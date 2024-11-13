"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { redirect, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { User } from "@/lib/models/user";
import { fetchUserData } from "@/lib/api/users.service";
import { removeToken } from "@/lib/auth";
import { PlusCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
      <span className="text-primary-foreground font-bold">C</span>
    </div>
    <span className="font-bold text-lg">Chillhost</span>
  </div>
);

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleAuth = (action: "login" | "register") => {
    router.push(`/auth?action=${action}`);
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
    redirect("/");
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    // Implement search logic here
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchUserData();
        setUser(user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUser();
  }, [router]);

  return (
    <header className="sticky p-2 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/">
          <Logo />
        </Link>
        <div className="relative flex-1 max-w-md mx-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher ..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center space-x-4">
          {user && (
            <Button
              onClick={() => router.push("/ads/new")}
              className="flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer une annonce
            </Button>
          )}
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
                <DropdownMenuItem onClick={handleLogout}>
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
    </header>
  );
};

export default Navbar;
