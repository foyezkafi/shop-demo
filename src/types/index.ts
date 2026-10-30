export interface Product {
  id: string;
  code: string;
  nameBn: string;
  nameEn: string;
  price: number;
  previousPrice: number;
  discountPercentage: number;
  category: string;
  image: string;
  gallery?: string[];
  inStock: boolean;
  isTopSelling?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  rating: number;
  reviewsCount: number;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  specs: {
    material: string;
    color: string;
    dimensions: string;
    weightCapacity?: string;
    warranty: string;
  };
}

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  image: string;
  count: number;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  whatsapp: string;
  address: string;
  district: string;
  upazila: string;
  deliveryNotes: string;
}

export interface OrderPaymentInfo {
  method: 'cod' | 'bkash' | 'nagad';
  trxId?: string;
  senderNumber?: string;
  amount?: number;
  screenshotName?: string;
}

export interface PlacedOrder {
  orderId: string;
  createdAt: string;
  customer: OrderCustomerInfo;
  payment: OrderPaymentInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Pending Verification' | 'Processing' | 'Shipped' | 'Delivered';
}
