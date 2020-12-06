export interface Sneaker {
  token: string;
  manufacturer: string;
  modelId: string;
  size: number;
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