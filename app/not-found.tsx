import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon, SearchIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page non trouvée</h2>
      <p className="text-xl text-muted-foreground mb-8">
        Oups ! La page que vous recherchez semble avoir pris des vacances.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/" className="flex items-center">
            <HomeIcon className="mr-2 h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/" className="flex items-center">
            <SearchIcon className="mr-2 h-4 w-4" />
            Rechercher une propriété
          </Link>
        </Button>
      </div>
    </div>
  );
}
