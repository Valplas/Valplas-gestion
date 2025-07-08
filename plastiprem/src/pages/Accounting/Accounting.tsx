import { PageContainer } from '../../components/atoms/container/PageContainer';
// import { SkeletonRow } from '../../components/atoms/skeleton/SkeletonRow';
import { TableBodyContainer } from '../../components/atoms/table/TableBodyContainer';
import { TableHeaders } from '../../components/molecules/table/TableHeaders';
import { TableRow } from '../../components/molecules/table/TableRow';
import useFetch from '../../hooks/useFetch';
import { BACKEND_URL } from '../../envs';
import { ProductWithSalesDto } from '../../types/accountability';
import { SkeletonRow } from '../../components/atoms/skeleton/SkeletonRow';

const headers = [
  'Producto',
  'En stock',
  'Precio compra',
  'Total vendidos',
  'Total Ganancia',
];

export const Accounting = () => {
  const { data, loading, error } = useFetch<ProductWithSalesDto[]>(
    `${BACKEND_URL}/accountability`,
  );



  return (
    <PageContainer>
      <div className="flex justify-between items-center ">
        <h4 className=" text-xl font-semibold text-black dark:text-white">
          Resumen ventas
        </h4>
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
          data?.map((product, key) => (
            <>
              <TableRow
                key={key}
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
                <tr>
                  <td colSpan={headers.length}>
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
                  </td>
                </tr>
              )}
            </>
          ))
        )}
 
      </TableBodyContainer>
    </PageContainer>
  );
};
