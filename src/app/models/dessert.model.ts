type Image = {
  thumbnail: string;
  mobile: string;
  desktop: string;
  tablet: string;
};

export interface Dessert {
  id: number;
  category: string;
  name: string;
  price: number;
  image: Image;
}

export interface CartItem {
  dessert: Dessert;
  quantity: number;
}
