// components/PrintableOrder.tsx
import { forwardRef } from 'react';
import { OrderModel } from '../../../types/order.type';

interface PrintableOrderProps {
  order: OrderModel;
}

export const PrintableOrder = forwardRef<HTMLDivElement, PrintableOrderProps>(({ order }, ref) => {
  return (
    <div ref={ref} className="p-8 text-black">
      <h2 className="text-2xl font-bold mb-4">Orden #{order.orderNumber}</h2>
      <p><strong>Cliente:</strong> {order.client?.clientName ?? ''}</p>
      <p><strong>Fecha alta:</strong> {order.orderDate}</p>
      <p><strong>Fecha entrega:</strong> {order.deliveryDate}</p>
      <p><strong>Monto:</strong> ${order.amount}</p>
      <p><strong>Kilos:</strong> {Math.ceil(order.weight)} Kg</p>
      {/* Agregá más campos si querés */}
    </div>
  );
});

