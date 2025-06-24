import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import { OrderModel, OrderProductModel } from '../../types/order.type';

export const generatePDF = (order: OrderModel) => {
  const doc = new jsPDF();

  // ✅ Encabezado
  doc.setFontSize(18);
  doc.text(`Orden #${order.orderNumber}`, 14, 20);

  doc.setFontSize(12);
  doc.text(`Cliente: ${order.client?.clientName ?? ''}`, 14, 30);
  doc.text(
    `Fecha alta: ${dayjs(order.orderDate).format('DD/MM/YYYY')}`,
    14,
    38,
  );
  doc.text(`Monto total: $${order.amount}`, 14, 46);

  // ✅ Espaciado para la tabla
  let finalY = 54;

  // ✅ Datos de productos en tabla
  const tableRows =
    order.orderProducts?.map((row: OrderProductModel) => [
      row.product.code,
      row.product.description,
      row.quantity,
      `$${row.unitaryPrice}`,
      `$${(row.quantity * Number(row.unitaryPrice)).toFixed(2)}`,
    ]) ?? [];

  autoTable(doc, {
    startY: finalY,
    head: [['Código', 'Producto', 'Cantidad', 'Precio unitario', 'Subtotal']],
    body: tableRows,
    theme: 'grid',
 styles: {
    fontSize: 10,
    textColor: '#000000',     // texto negro
    fillColor: [255, 255, 255] // fondo blanco
  },
  headStyles: {
    fillColor: [255, 255, 255], // fondo blanco para encabezado
    textColor: '#000000',
    fontStyle: 'bold',
    halign: 'left',
  },
  footStyles: {
    fillColor: [255, 255, 255],
    textColor: '#000000',
    fontStyle: 'bold',
    halign: 'left',
  },
  alternateRowStyles: {
    fillColor: [255, 255, 255], // sin sombreado
  },
    foot: [
      [
        { content: 'Total', colSpan: 4, styles: { halign: 'right' } },
        `$${order.amount.toFixed(2)}`,
      ],
    ],
  });

  // ✅ Exportar y abrir
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};


