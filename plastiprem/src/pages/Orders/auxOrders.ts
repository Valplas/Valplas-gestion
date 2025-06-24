import { OrderStatusType } from "../../types/order.type";

export interface ClientModel {
  clientID: string;
  clientName: string;
  clientSurname: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
}

export interface ProductModel {
  productID: string;
  productName: string;
  productDescription: string;
  price: number;
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

// Función para generar un cliente aleatorio
const generateClient = (index: number): ClientModel => ({
  clientID: String(index),
  clientName: `Cliente${index + 1}`,
  clientSurname: `Apellido${index + 1}`,
  clientPhone: `+54 11 1234-${String(1000 + index).slice(-4)}`,
  clientEmail: `cliente${index + 1}@example.com`,
  clientAddress: `Calle Falsa ${index + 100}, Ciudad`,
});

// Función para generar un producto aleatorio
const generateProduct = (index: number): ProductModel => ({
  productID: String(index),
  productName: `Producto${index + 1}`,
  productDescription: `Descripción del producto ${index + 1}`,
  price: Math.floor(Math.random() * 5000) + 100, // Precio entre 100 y 5100
});

// Función para generar un pedido
const generateOrder = (index: number): OrderModel => {
  const client = generateClient(index);
  const orderID = String(index);
  const products = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => {
    const product = generateProduct(i);
    const quantity = Math.floor(Math.random() * 5) + 1;
    return {
      orderID,
      order: null,
      productID: product.productID,
      product,
      quantity,
      unitaryPrice: product.price,
      subtotal: product.price * quantity,
    };
  });

  return {
    orderID,
    clientID: client.clientID,
    client,
    total: products.reduce((sum, item) => sum + item.subtotal, 0),
    orderNumber: 1000 + index,
    orderStatus: [0,1,2,3][Math.floor(Math.random() * 3)] as OrderStatusType,
    orderedBy: `Vendedor${index + 1}`,
    orderDate: new Date().toISOString(),
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 días después
    realDeliveryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 días después
    schedules: "9:00 - 18:00",
    address: client.clientAddress,
    geoPointAddress: `-34.6${index}, -58.3${index}`,
    amount: products.length,
    totalAmount: products.reduce((sum, item) => sum + item.subtotal, 0),
    amountToBeReceived: products.reduce((sum, item) => sum + item.subtotal, 0),
    weight: Math.floor(Math.random() * 20) + 1,
    orderProducts: products,
  };
};

// Generar un array de 15 órdenes
const orders: OrderModel[] = Array.from({ length: 15 }, (_, index) => generateOrder(index));

console.log(orders); // Puedes ver los datos en la consola

export default orders;
