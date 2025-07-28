export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  material: string;
  technique: string;
  originCountry: string;
  stockQuantity: any;
  ecoFriendly: boolean;
  limitedEdition: boolean;
  productionTime: string;
  totalPrice: number;
  favorite?: boolean;
  cartQuantity: any;
  category: Category;
}



export interface ProductRequest {
  name: string;
  price: number;
  description: string;
  material: string;
  technique: string;
  originCountry: string;
  stockQuantity: number;
  ecoFriendly: boolean;
  limitedEdition: boolean;
  productionTime: string;
  categoryId?: number;
  favorite?: boolean;

}
export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  material: string;
  technique: string;
  originCountry: string;
  stockQuantity: number;
  ecoFriendly: boolean;
  limitedEdition: boolean;
  productionTime: string;
  category: Category;
  imageUrl?: string;
  favorite?: boolean;
  cartQuantity?: number;
}

export interface Category {
  id: number;
  name: string;
}
export interface FavoriteRequest {
  userId: number;
  productId: number;
}

