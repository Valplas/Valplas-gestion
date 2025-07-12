import { PageContainer } from '../../components/atoms/container/PageContainer';
// import { SkeletonRow } from '../../components/atoms/skeleton/SkeletonRow';
import { TableBodyContainer } from '../../components/atoms/table/TableBodyContainer';
import { TableHeaders } from '../../components/molecules/table/TableHeaders';
import { TableRow } from '../../components/molecules/table/TableRow';
import useFetch from '../../hooks/useFetch';
import { BACKEND_URL } from '../../envs';
import { ProductWithSalesDto } from '../../types/accountability';
import { SkeletonRow } from '../../components/atoms/skeleton/SkeletonRow';
import { Fragment, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Button } from '../../components/atoms/button/Button';

const headers = [
  'Producto',
  'En stock',
  'Precio compra',
  'Total vendidos',
  'Total Ganancia',
];

export const Accounting = () => {
  const [date, setDate] = useState<string>(dayjs().format('DD-MM-YYYY'));

  const { data, loading } = useFetch<ProductWithSalesDto[]>(
    `${BACKEND_URL}/accountability${date ? `?date=${date}` : ''}`,
    [date],
  );
  const totalRevenue = useMemo(() => {
  if (data) {
    const total = data.reduce((prev: number, prod) => {
      return (
        prev +
        prod.salesByListPrice.reduce((prev: number, lp) => {
          return prev + lp.totalRevenue;
        }, 0)
      );
    }, 0);
    return parseFloat(total.toFixed(2)); // Redondea a 2 decimales y convierte a número
  }
  return 0; // Valor por defecto
}, [data, loading]); // Añadido data como dependencia

  // Función para generar el CSV
  const generateCSV = () => {
    if (!data || data.length === 0) {
      alert('No hay datos disponibles para generar el CSV.');
      return;
    }

    // Encabezados del CSV
    const csvHeaders = [
      'Producto',
      'En stock',
      'Precio compra',
      'Lista de precios',
      'Margen de ganancia',
      'Cantidad vendida',
      'Ganancia',
    ].join(',');

    // Convertir datos a filas CSV
    const csvRows = data.flatMap((product) =>
      product.salesByListPrice.map((list) => [
        `"${product.productName}"`,
        product.stock,
        product.costPrice,
        `"${list.listPriceName}"`,
        `${list.margin}%`,
        list.totalQuantity,
        list.totalRevenue.toFixed(2),
      ].join(','))
    );

    // Combinar encabezados y filas
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    // Crear un blob y un enlace para descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ventas_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };



  return (
    <PageContainer>
      <div className="flex justify-between items-center ">
        <h4 className=" text-xl font-semibold text-black dark:text-white">
          Resumen ventas
        </h4>

            <Button label="Generar CSV" onClick={generateCSV} />


        <div className="flex gap-3">
          <input
            type="date"
            onChange={(e) => {
              setDate(dayjs(e.target.value).format('DD-MM-YYYY'));
            }}
          />
          <h3>
            Ganancia del dia {date}:<strong> ${totalRevenue}</strong>
          </h3>
        </div>
      </div>
      <TableBodyContainer>
        <TableHeaders titles={headers} columns={headers.length} />
        {loading ? (
          <div className="w-full">
            {[...Array(5)].map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </div> // Muestra 5 filas de skeleton
        ) : (
          data?.map((product) => (
            <Fragment key={product.productID}>
              <TableRow
                content={{
                  Producto: product.productName,
                  Stock: product.stock,
                  'Precio compra': product.costPrice,
                  Vendidos: product.salesByListPrice.reduce(
                    (prev: number, curr) => prev + curr.totalQuantity,
                    0,
                  ),
                  Ganancia: product.salesByListPrice.reduce(
                    (prev: number, curr) => prev + curr.totalRevenue,
                    0,
                  ),
                }}
              />
              {product.salesByListPrice.some((l) => l.totalQuantity > 0) && (
                
                    <table className="w-full mt-2 border-separate border-spacing-y-2 text-sm">
                      <thead>
                        <tr className="text-left bg-gray-800 text-white">
                          <th className="px-4 py-2">Lista de precios</th>
                          <th className="px-4 py-2">Margen de ganancia</th>
                          <th className="px-4 py-2">Cantidad vendida</th>
                          <th className="px-4 py-2">Ganancia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.salesByListPrice
                          .filter((list) => list.totalQuantity > 0)
                          .map((list) => (
                            <tr
                              key={list.listPriceID}
                              className="bg-gray-100 hover:bg-gray-200"
                            >
                              <td className="px-4 py-2">
                                {list.listPriceName}
                              </td>
                              <td className="px-4 py-2">{list.margin}%</td>
                              <td className="px-4 py-2">
                                {list.totalQuantity}
                              </td>
                              <td className="px-4 py-2">
                                ${list.totalRevenue.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
              )}
            </Fragment>
          ))
        )}
      </TableBodyContainer>
    </PageContainer>
  );
};
