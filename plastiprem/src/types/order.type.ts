import { ClientModel } from './clients.type';
import { PriceListModel } from './priceList.type';
import { ProductModel } from './product.type';

export enum OrderStatusType
    {
        Entregado=0,
        EnReparto=1,
        Cancelado=2,
        EnPreparacion=3
    }
export interface OrderModel {
  orderID: string;
  clientID: string;
  client: ClientModel;
  total: number;
  orderNumber: number;
  orderStatus: OrderStatusType;
  orderedBy: string;
  orderDate: string;
  deliveryDate: string;
  realDeliveryDate: string;
  schedules: string;
  address: string;
  geoPointAddress: string;
  amount: number;
  totalAmount: number;
  amountToBeReceived: number;
  weight: number;
  orderProducts: OrderProductModel[];
}



export interface OrderProductModel {
  orderID: string;
  order: OrderModel | null;
  productID: string;
  product: ProductModel;
  quantity: number;
  unitaryPrice: number;
  subtotal: number;
}

export interface OrderProductsEntity {
  product: ProductModel;
  quantity: number;
  unitaryPrice: number;
  subtotal: number;
  listPrice: PriceListModel;
  revenue: number;
  costPrice: number;

}
export interface NewOrderDTO {
    clientID: string; // ID del cliente que realiza la orden
    orderedBy: string; // Persona que da de alta la orden
    deliveryDate: string; // Fecha pactada para la entrega (ISO 8601)
    realDeliveryDate: string; // Fecha real de entrega (ISO 8601)
    schedules: string; // Horarios para la entrega
    address: string; // Dirección asociada a la orden
    geoPointAddress: string; // Punto geográfico asociado a la dirección
    orderProducts: OrderProductDTO[]; // Productos asociados a la orden
  }
  
  export interface OrderProductDTO {
    productID: string; // ID del producto
    quantity: number; // Cantidad del producto
    unitaryPrice: number; // Precio unitario del producto
  }
  