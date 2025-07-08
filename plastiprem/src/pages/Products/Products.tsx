import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { ProductModel } from '../../types/product.type';
import { TableHeaders } from '../../components/molecules/table/TableHeaders';
import { SkeletonRow } from '../../components/atoms/skeleton/SkeletonRow';
import { TableRow } from '../../components/molecules/table/TableRow';
import { PageContainer } from '../../components/atoms/container/PageContainer';
import { TableBodyContainer } from '../../components/atoms/table/TableBodyContainer';
import { TableActions } from '../../components/molecules/table/TableActions';
import { useSnackbar } from '../../feature/Snackbar/SnackbarContext';
import { lazy, Suspense, useEffect, useState } from 'react';
import { BACKEND_URL } from '../../envs';
import Loader from '../../common/Loader/Loader';
import { Search } from '../../components/atoms/inputs/Search';
import { Button } from '../../components/atoms/button/Button';

const headers = ['Nombre', 'Descripcion', 'Stock','Codigo', 'Costo', 'Marca', ' '];

export const Products = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [value, setValue] = useState<string>('');
  const [visibleProducts, setVisibleProducts] = useState<ProductModel[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [modalListPriceVisible, setModalListPriceVisible] =
    useState<boolean>(false);
  const { data, loading, error } = useFetch<ProductModel[]>(
    `${BACKEND_URL}/products`,
    [refresh],
  );

  useEffect(() => {
    if (!data) return;

    const filteredProducts = value
      ? data.filter((prod) =>
          [prod.name, prod.description]
            .filter(Boolean)
            .some((field) =>
              (field as string).toLowerCase().includes(value.toLowerCase()),
            ),
        )
      : data;

    setVisibleProducts(filteredProducts);
  }, [data, value]);


  useEffect(() => {
    if (error) {
      showSnackbar('Hubo un error al cargar la pagina');
    }
  }, [error]);

  return (
    <>
      <PageContainer>
        <div className="flex justify-between items-center ">
          <div className="flex gap-2">
            <h4 className=" text-xl font-semibold text-black dark:text-white">
              Productos
            </h4>
            <Search
              onChange={setValue}
              placeholder="Buscar Producto"
              value={value}
            />
          </div>
          <div className="flex gap-3">
            <Button label="Nueva lista de precios" onClick={() => {setModalListPriceVisible(true)}} />
            <Link
              to="/products/new"
              className="inline-flex items-center  justify-center gap-2.5 rounded-full bg-meta-3 py-2 px-4 text-center font-bold text-sm sm:text-lg text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
            >
              Nuevo producto
            </Link>
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
            visibleProducts?.map((product, key) => (
              <TableRow
                key={key}
                content={{
                  Nombre: product?.name,
                  Descripcion: product.description,
                  Stock: product?.quantity ?? 0,
                  Codigo: product.code,
                  Costo: `$ ${product.costPrice}`,
                  Marca: product?.manufacturer ?? '',
                }}
                actions={
                  <TableActions
                    onDelete={() => {
                      setSelectedProductId(product.productID);
                      setIsDeleteOpen(true);
                    }}
                    onEdit={() => {
                      setSelectedProductId(product.productID);
                      setIsEditOpen(true);
                    }}
                  />
                }
              />
            ))
          )}
        </TableBodyContainer>
        <Suspense fallback={<Loader />}>
          {selectedProductId && isDeleteOpen && (
            <DeleteProductDialog
              open={isDeleteOpen}
              productId={selectedProductId}
              setOpen={setIsDeleteOpen}
              onDeleted={() => setRefresh((prev) => !prev)}
            />
          )}

          {selectedProductId && isEditOpen && (
            <EditProductDialog
              open={isEditOpen}
              productId={selectedProductId}
              setOpen={setIsEditOpen}
              onEdited={() => setRefresh((prev) => !prev)}
              onCancel={() => setIsEditOpen(false)}
            />
          )}

          {modalListPriceVisible && (
            <ModalPriceList 
              open={modalListPriceVisible}
            setOpen={setModalListPriceVisible} />
          )}
        </Suspense>
      </PageContainer>
    </>
  );
};

const DeleteProductDialog = lazy(
  () => import('../../components/molecules/modal/DeleteProductDialog'),
);
const EditProductDialog = lazy(
  () => import('../../components/molecules/modal/EditProductDialog'),
);

const ModalPriceList = lazy(
  () => import('../../components/molecules/modal/ModalPriceList'),
);
