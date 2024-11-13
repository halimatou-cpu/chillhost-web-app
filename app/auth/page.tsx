"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { login, register } from "@/lib/auth";

function AuthPageComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    type: "login" | "register"
  ) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      let response = null;
      if (type === "login") {
        response = await login(email, password);
      } else {
        const fullName = formData.get("name") as string;
        response = await register(email, password, fullName);
      }

      if (response) {
        toast({
          title: type === "login" ? "Connexion réussie" : "Inscription réussie",
          description: "Bienvenue sur notre plateforme !",
        });
        router.push(callbackUrl);
      } else {
        throw new Error("Authentication failed");
      }
    } catch {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] mx-auto">
      <CardHeader>
        <CardTitle>Bienvenue</CardTitle>
        <CardDescription>
          Connectez-vous ou créez un compte pour continuer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={(e) => handleSubmit(e, "login")}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Entrez votre email"
                    type="email"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Entrez votre mot de passe"
                    type="password"
                    required
                  />
                </div>
              </div>
              <Button
                className="w-full mt-4"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "Se connecter"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={(e) => handleSubmit(e, "register")}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Entrez votre nom"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Entrez votre email"
                    type="email"
                    required
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    placeholder="Choisissez un mot de passe"
                    type="password"
                    required
                  />
                </div>
              </div>
              <Button
                className="w-full mt-4"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Chargement..." : "S'inscrire"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          className="px-0"
          onClick={() =>
            toast({
              title: "Réinitialiser le mot de passe",
              description:
                "La fonctionnalité de réinitialisation du mot de passe sera implémentée prochainement",
            })
          }
        >
          Mot de passe oublié ?
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback="Chargement...">
      <AuthPageComponent />
    </Suspense>
  );
}
