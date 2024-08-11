export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  image: string;
  rating: Rating;
};

export type Rating = {
  rate: number;
  count: number;
};

export type Category = string;
