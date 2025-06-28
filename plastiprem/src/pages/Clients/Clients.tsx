import { Link } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import { ClientModel } from '../../types/clients.type';
import { useAsyncSimulator } from '../../hooks/useAsyncSimulator';
import { SkeletonRow } from '../../components/atoms/skeleton/SkeletonRow';
import { TableHeaders } from '../../components/molecules/table/TableHeaders';
import { TableRow } from '../../components/molecules/table/TableRow';
import { fakeFetch } from '../../helpers/functions/fakeFetch';
import { PageContainer } from '../../components/atoms/container/PageContainer';
import { TableBodyContainer } from '../../components/atoms/table/TableBodyContainer';
import { TableActions } from '../../components/molecules/table/TableActions';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useSnackbar } from '../../feature/Snackbar/SnackbarContext';
import Loader from '../../common/Loader/Loader';
import { BACKEND_URL } from '../../envs';
import { Search } from '../../components/atoms/inputs/Search';

const headers = [
  'Nombre',
  'Partido',
  'Dirección',
  'Teléfono',
  'Mail',
  'CUIT',
  ' ',
];

export const Clients = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [value, setValue] = useState<string>('');
  const [visibleClients, setVisibleClients] = useState<ClientModel[]>([]);
  const { showSnackbar } = useSnackbar();

  const { data, error, loading } = useFetch<ClientModel[]>(
    `${BACKEND_URL}/client`,
    [refresh],
  );

  useEffect(() => {
    if (!data) return;

    const filteredClients = value
      ? data.filter((client) =>
          [client.clientCUIT, client.clientName, client.clientSurname]
            .filter(Boolean)
            .some((field) =>
              (field as string).toLowerCase().includes(value.toLowerCase()),
            ),
        )
      : data;

    setVisibleClients(filteredClients);
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
              Clientes
            </h4>
            <Search
              onChange={setValue}
              placeholder="Buscar Cliente por nombre, apellido, CUIT"
              value={value}
            />
          </div>
          <Link
            to="/clients/new"
            className="inline-flex items-center  justify-center gap-2.5 rounded-full bg-meta-3 py-2 px-4 text-center font-bold text-lg text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Nuevo cliente
          </Link>
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
            visibleClients?.map((client, key) => (
              <TableRow
                key={key}
                content={{
                  Nombre: `${client.clientName} ${client?.clientSurname ?? ''}`,
                  Partido: client?.clientLocality ?? '',
                  Dirección: client?.clientAddress ?? '',
                  Teléfono: client?.clientPhone ?? '',
                  Mail: client?.clientEmail ?? '',
                  CUIT: client?.clientCUIT ?? '',
                }}
                actions={
                  <TableActions
                    onDelete={() => {
                      setSelectedClientId(client.clientID);
                      setIsDialogOpen(true);
                    }}
                    onEdit={() => {
                      setSelectedClientId(client.clientID);
                      setIsEditDialogOpen(true);
                    }}
                  />
                }
              />
            ))
          )}
        </TableBodyContainer>
        <Suspense fallback={<Loader />}>
          {selectedClientId && isDialogOpen && (
            <DeleteClientDialog
              open={isDialogOpen}
              clientId={selectedClientId}
              setOpen={setIsDialogOpen}
              onDeleted={() => setRefresh((prev) => !prev)}
            />
          )}

          {selectedClientId && isEditDialogOpen && (
            <EditClientDialog
              open={isEditDialogOpen}
              setOpen={setIsEditDialogOpen}
              clientId={selectedClientId}
              onEdited={() => setRefresh((prev) => !prev)}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </Suspense>
      </PageContainer>
    </>
  );
};

const DeleteClientDialog = lazy(
  () => import('../../components/molecules/modal/DeleteClientDialog'),
);
const EditClientDialog = lazy(
  () => import('../../components/molecules/modal/EditClientDialog'),
);
