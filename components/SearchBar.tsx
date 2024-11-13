"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortBy } from "@/lib/models/ad";

// Cette liste devrait être remplacée par une vraie API ou une base de données
const locations = [
  "Paris",
  "Marseille",
  "Lyon",
  "Toulouse",
  "Nice",
  "Île-de-France",
  "Provence-Alpes-Côte d'Azur",
  "Auvergne-Rhône-Alpes",
  "Occitanie",
  "Hauts-de-France",
];

export default function SearchBar() {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [filters, setFilters] = useState({
    wifi: false,
    parking: false,
    piscine: false,
    salleDeSport: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortOption, setSortOption] = useState<SortBy>(SortBy.RELEVANCE);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Implémenter la logique de recherche ici
    console.log("Recherche avec filtres:", {
      searchTerm,
      priceRange,
      filters,
      SortBy,
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-wrap items-center space-x-2 space-y-2 mb-8"
    >
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Rechercher des villes, régions ou mots-clés..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        {showSuggestions && (
          <div className="absolute z-50 w-full mt-2 bg-popover text-popover-foreground">
            <Command>
              <CommandInput placeholder="Rechercher une ville ou une région" />
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              <CommandGroup>
                {locations
                  .filter((location) =>
                    location.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((location) => (
                    <CommandItem
                      key={location}
                      onSelect={() => {
                        setSearchTerm(location);
                        setShowSuggestions(false);
                      }}
                    >
                      {location}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </Command>
          </div>
        )}
      </div>
      <Button type="submit">Rechercher</Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Filtres</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Fourchette de prix</h4>
              <Slider
                min={0}
                max={10000}
                step={100}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between">
                <span>{priceRange[0]}€</span>
                <span>{priceRange[1]}€</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(filters).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked: boolean) =>
                      setFilters({ ...filters, [key]: checked as boolean })
                    }
                  />
                  <Label htmlFor={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Select
        value={sortOption}
        onValueChange={(value: unknown) => setSortOption(value as SortBy)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SortBy.RELEVANCE}>Pertinence</SelectItem>
          <SelectItem value={SortBy.PRICE_ASC}>Prix croissant</SelectItem>
          <SelectItem value={SortBy.PRICE_DESC}>Prix décroissant</SelectItem>
          <SelectItem value={SortBy.DATE_ASC}>
            Date (ancien au récent)
          </SelectItem>
          <SelectItem value={SortBy.DATE_DESC}>
            Date (récent à l&apos;ancien)
          </SelectItem>
          <SelectItem value={SortBy.AREA_ASC}>Surface croissante</SelectItem>
          <SelectItem value={SortBy.AREA_DESC}>Surface décroissante</SelectItem>
        </SelectContent>
      </Select>
    </form>
  );
}
