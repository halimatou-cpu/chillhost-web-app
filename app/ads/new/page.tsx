"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { createAd, uploadAdImages } from "@/lib/api/ads.service";
import { PropertyType, RentalType } from "@/lib/models/ad";
import {
  PriceUnit,
  MeasureUnit,
  MeasureSymbol,
} from "@/lib/models/create-ad.dto";
import { Loader2, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const createAdSchema = z.object({
  // Basic Information
  title: z.string().min(10, "Le titre doit contenir au moins 10 caractères"),
  description: z
    .string()
    .min(50, "La description doit contenir au moins 50 caractères"),
  rentalType: z.nativeEnum(RentalType),

  // Property Details
  property: z.object({
    type: z.nativeEnum(PropertyType),
    price: z.object({
      amount: z.number().min(1, "Le prix doit être supérieur à 0"),
      currency: z.string().default("EUR"),
      unit: z.nativeEnum(PriceUnit),
    }),
    capacity: z.object({
      rooms: z.number().min(1, "Au moins une pièce est requise"),
      beds: z.number().min(1, "Au moins un lit est requis"),
      bathrooms: z.number().min(1, "Au moins une salle de bain est requise"),
      guests: z.object({
        adults: z.number().min(1, "Au moins un adulte est requis"),
        children: z.number().min(0),
      }),
    }),
    address: z.object({
      country: z.string().min(1, "Le pays est requis"),
      city: z.string().min(1, "La ville est requise"),
      street: z.string().min(1, "L'adresse est requise"),
      postal_code: z.number().min(1, "Le code postal est requis"),
      region: z.string().min(1, "La région est requise"),
      additionalInfo: z.string().optional(),
    }),
    livingArea: z.object({
      value: z.number().min(1, "La surface habitable est requise"),
      unit: z.nativeEnum(MeasureUnit),
      symbol: z.nativeEnum(MeasureSymbol),
    }),
    amenities: z.object({
      wifi: z.boolean().default(false),
      kitchen: z.boolean().default(false),
      tv: z.boolean().default(false),
      airConditioning: z.boolean().default(false),
      heating: z.boolean().default(false),
      parking: z.boolean().default(false),
      pool: z.boolean().default(false),
      gym: z.boolean().default(false),
      petFriendly: z.boolean().default(false),
      smokingAllowed: z.boolean().default(false),
    }),
  }),
});

export default function CreateAdPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const form = useForm<z.infer<typeof createAdSchema>>({
    resolver: zodResolver(createAdSchema),
    defaultValues: {
      property: {
        amenities: {
          wifi: false,
          kitchen: false,
          tv: false,
          airConditioning: false,
          heating: false,
          parking: false,
          pool: false,
          gym: false,
          petFriendly: false,
          smokingAllowed: false,
        },
      },
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) =>
        file.size <= MAX_FILE_SIZE && ACCEPTED_IMAGE_TYPES.includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Erreur",
        description:
          "Certains fichiers n'ont pas pu être ajoutés. Vérifiez le format et la taille.",
        variant: "destructive",
      });
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);
    const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));
    setImageUrls((prev) => [...prev, ...newImageUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: z.infer<typeof createAdSchema>) => {
    setIsSubmitting(true);
    try {
      const ad = await createAd(values);
      if (selectedImages.length > 0) {
        await uploadAdImages(ad.id, selectedImages);
      }

      toast({
        title: "Annonce créée",
        description: "Votre annonce a été créée avec succès !",
      });

      router.push(`/ads/${ad.id}`);
    } catch {
      toast({
        title: "Erreur",
        description:
          "Une erreur s'est produite lors de la création de l'annonce.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Créer une annonce</CardTitle>
          <CardDescription>
            Remplissez les informations ci-dessous pour créer votre annonce.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Informations</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                  <TabsTrigger value="amenities">Équipements</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre de l&apos;annonce</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Magnifique appartement au cœur de Paris"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Décrivez votre bien..."
                            className="min-h-[200px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rentalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de location</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez le type de location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(RentalType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="button" onClick={() => setActiveTab("details")}>
                    Suivant
                  </Button>
                </TabsContent>

                <TabsContent value="details" className="space-y-4">
                  {/* Property Type */}
                  <FormField
                    control={form.control}
                    name="property.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de bien</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez le type de bien" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(PropertyType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="property.price.amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="property.price.unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Par</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez l'unité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(PriceUnit).map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Capacity */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="property.capacity.rooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de pièces</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="property.capacity.beds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de lits</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="property.capacity.bathrooms"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salles de bain</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="property.capacity.guests.adults"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adultes</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="property.capacity.guests.children"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enfants</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Living Area */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="property.livingArea.value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Surface habitable</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="property.livingArea.unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unité</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez l'unité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(MeasureUnit).map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="property.address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="property.address.postal_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code postal</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="property.address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ville</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="property.address.region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Région</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="property.address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pays</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("basic")}
                    >
                      Précédent
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("amenities")}
                    >
                      Suivant
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.keys(form.getValues().property.amenities).map(
                      (amenity) => (
                        <FormField
                          key={amenity}
                          control={form.control}
                          name={
                            `property.amenities.${amenity}` as keyof z.infer<
                              typeof createAdSchema
                            >
                          }
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value as unknown as boolean}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {amenity}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      )
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("details")}
                    >
                      Précédent
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("images")}
                    >
                      Suivant
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(index)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">
                            Cliquez pour ajouter
                          </span>{" "}
                          ou glissez et déposez
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG ou WEBP (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        multiple
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("amenities")}
                    >
                      Précédent
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Création en cours...
                        </>
                      ) : (
                        "Créer l'annonce"
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
