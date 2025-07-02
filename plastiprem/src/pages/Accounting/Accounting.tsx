import { useEffect, useState } from 'react';
import { PageContainer } from '../../components/atoms/container/PageContainer';
// import { SkeletonRow } from '../../components/atoms/skeleton/SkeletonRow';
import { TableBodyContainer } from '../../components/atoms/table/TableBodyContainer';
import { TableHeaders } from '../../components/molecules/table/TableHeaders';
import { TableRow } from '../../components/molecules/table/TableRow';
import { fakeFetch } from '../../helpers/functions/fakeFetch';

const headers = ['Producto', 'Stock', 'Precio compra', 'Vendidos', 'Ganancia'];
type ResumenItem = {
  Producto: string;
  Stock: number;
  'precio compra': number;
  Vendidos: number;
  Ganancia: number;
};
const data = [
  {
    Producto: 'Shampoo',
    Stock: 25,
    'precio compra': 150,
    Vendidos: 10,
    Ganancia: 500,
  },
  {
    Producto: 'Acondicionador',
    Stock: 18,
    'precio compra': 180,
    Vendidos: 8,
    Ganancia: 360,
  },
  {
    Producto: 'Jabón',
    Stock: 40,
    'precio compra': 50,
    Vendidos: 20,
    Ganancia: 300,
  },
  {
    Producto: 'Crema',
    Stock: 12,
    'precio compra': 200,
    Vendidos: 5,
    Ganancia: 250,
  },
  {
    Producto: 'Toalla',
    Stock: 30,
    'precio compra': 100,
    Vendidos: 15,
    Ganancia: 450,
  },
  {
    Producto: 'Peine',
    Stock: 50,
    'precio compra': 30,
    Vendidos: 25,
    Ganancia: 350,
  },
  {
    Producto: 'Gel',
    Stock: 20,
    'precio compra': 120,
    Vendidos: 12,
    Ganancia: 400,
  },
  {
    Producto: 'Perfume',
    Stock: 10,
    'precio compra': 500,
    Vendidos: 4,
    Ganancia: 600,
  },
  {
    Producto: 'Desodorante',
    Stock: 22,
    'precio compra': 90,
    Vendidos: 18,
    Ganancia: 540,
  },
  {
    Producto: 'Cepillo',
    Stock: 35,
    'precio compra': 60,
    Vendidos: 14,
    Ganancia: 280,
  },
];

export const Accounting = () => {
 const [resumen, setResumen] = useState<ResumenItem[]>([]);


useEffect(() => {
  const handleAsync = async () => {
    const res = await fakeFetch(data);
    setResumen(res);
  };

  handleAsync();
}, []);
  return (
    <PageContainer>
      <div className="flex justify-between items-center ">
        <h4 className=" text-xl font-semibold text-black dark:text-white">
          Resumen ventas
        </h4>
      </div>
      <TableBodyContainer>
        <TableHeaders titles={headers} columns={headers.length} />
        {resumen?.map((product, key) => (
          <TableRow
            key={key}
            content={{
              Producto: product?.Producto,
              Stock: product.Stock,
              'Precio compra': product?.['precio compra'] ?? 0,
              Vendidos: product.Vendidos,
              Ganancia: product?.Ganancia ?? '',
            }}
          />
        ))}
        {/*      {loading ? (
          <div className="w-full">
            {[...Array(5)].map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </div> // Muestra 5 filas de skeleton
        ) : (
          resumen?.map((product, key) => (
            <TableRow
              key={key}
              content={{
                Nombre: product?.name,
                Descripcion: product.description,
                Stock: product?.quantity ?? 0,
                Código: product.code,
                Marca: product?.manufacturer ?? '',
              }}
            />
          ))
        )} */}
      </TableBodyContainer>
    </PageContainer>
  );
};
