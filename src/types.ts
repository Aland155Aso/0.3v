export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: string[];
  image: string;
  images?: string[];
  rating: number;
  reviewsCount: number;
  stock: number;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  discountPrice?: number;
  suggestedUsage?: string;
  caution?: string;
  supplementFacts?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  createdAt: string;
}

export type Language = 'en' | 'ku' | 'ar';

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}
