export enum PetType {
  dog = "dog",
  cat = "cat",
}

export type CatBreeds =
  | "siamese"
  | "persian"
  | "maine-coon"
  | "ragdoll"
  | "none";
export type DogBreeds =
  | "labrador"
  | "german-shepherd"
  | "golden-retriever"
  | "none";

export interface Dog {
  name: string;
  type: PetType.dog;
  age: number;
  breed: DogBreeds;
}

export interface Cat {
  name: string;
  type: PetType.cat;
  age: number;
  breed: CatBreeds;
}

export type Pet = Dog | Cat;
