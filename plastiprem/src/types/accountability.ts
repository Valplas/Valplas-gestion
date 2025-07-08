export interface ProductListPriceSalesDto {
  listPriceID: string;
  listPriceName: string;
  totalQuantity: number;
  totalRevenue: number;
  margin: number; // nuevo
  totalCost: number;
}

export interface ProductWithSalesDto {
  productID: string;
  productName: string;
  stock: number;
  costPrice: number;
  salesByListPrice: ProductListPriceSalesDto[];
}
