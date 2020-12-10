export interface Sneaker {
  token: string;
  manufacturer: string;
  modelID: string;
  size: string;
  name: string;
}

export interface Manufacturer {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
}

export interface Account {
  isManufacturer: boolean;
  isAdmin: boolean;
  sneakers: Sneaker[];
}
