export interface Sneaker {
  token: string;
  manufacturer: string;
  modelId: string;
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

export interface PendingManufacturer {
  address: string;
  amount: string;
}

export interface Account {
  isManufacturer: boolean;
  isAdmin: boolean;
  sneakers: Sneaker[];
}
