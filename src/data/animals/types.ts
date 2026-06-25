export interface Animal {
  id: string;
  name: string;
  englishName: string;
  scientificName: string;
  emoji: string;
  illustrationSvg?: string;
  category: string;
  habitat: string;
  habitatEmoji: string;
  food: string;
  foodEmoji: string;
  lifespan: string;
  weight: string;
  description: string;
  color: string;
  /** Narasi cerita anak dari sudut pandang hewan (first-person).
   *  Digunakan di modal "Dengarkan {name} bercerita".
   *  Harus berbeda dari description dan funFacts — gaya dongeng, bukan fakta. */
  story: string;
  funFacts: string[];
  conservationStatus: string;
  videoEmbedUrl: string;
  videoUrl: string;
  distribution: string[];
  distributionCountries: string;
  soundUrl?: string;
  imageUrl?: string;
}

export interface FamilyMember {
  animalId: string;
  name: string;
  emoji: string;
  exists: boolean;
}

export interface FamilyGroup {
  id: string;
  name: string;
  emoji: string;
  members: FamilyMember[];
}
