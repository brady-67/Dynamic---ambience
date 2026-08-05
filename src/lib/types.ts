export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  old_price: number | null;
  image_url: string;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  featured: boolean;
  description: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}
