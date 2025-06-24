import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import PageTitle from './components/PageTitle';
// import Loader from './common/Loader/Loader';

// import Calendar from './pages/Calendar';

// import ECommerce from './pages/Dashboard/ECommerce';

// import Profile from './pages/Profile';

import DefaultLayout from './layout/DefaultLayout';
import { Clients } from './pages/Clients/Clients';
import { Products } from './pages/Products/Products';
import { NewClient } from './pages/Clients/New/NewClient';
import { Orders } from './pages/Orders/Orders';
// import { Sellers } from './pages/Sellers/Sellers';
// import { Stock } from './pages/Stock/Stock';
// import { Buy } from './pages/Accounting/Buy';
// import { Accounting } from './pages/Accounting/Accounting';
// import { Sales } from './pages/Accounting/Sales';
// import { NewSeller } from './pages/Sellers/New/NewSeller';
// import { Logistics } from './pages/Logistics/Logistics';
// import { APIProvider } from '@vis.gl/react-google-maps';
import { Login } from './pages/Auth/Login';
import PrivateRoute from './common/Auth/PrivateRoute';
import { NewProduct } from './pages/Products/New/NewProduct';
import { NewOrder } from './pages/Orders/New/NewOrder';
import { AuthProvider } from './feature/Auth/AuthProvider';

//@ts-ignore
const GOOGLE_API = import.meta.env.VITE_GOOGLE_MAPS_KEY;

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <AuthProvider>
      <DefaultLayout>
        <Routes>
          <Route
            path="/"
            index
            element={
              <>
                <PageTitle title="Valplas Gestion" />
                <Login />
              </>
            }
          />
          <Route
            path="/orders/new"
            element={
              <PrivateRoute>
                <PageTitle title="Nuevo pedido | Valplas Gestión" />
                <NewOrder />
              </PrivateRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <PageTitle title="Pedidos | Valplas Gestión" />
                <Orders />
              </PrivateRoute>
            }
          />
            <Route
              path="/clients/new"
              element={
                <PrivateRoute>
                  <PageTitle title="Nuevo cliente | Valplas Gestión" />
                  <NewClient />
                </PrivateRoute>
              }
            />
          <Route
            path="/clients"
            index
            element={
              <PrivateRoute>
                <PageTitle title="Clientes | Valplas Gestión" />
                <Clients />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <PageTitle title="Productos | Valplas Gestión" />
                <Products />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/new"
            element={
              <PrivateRoute>
                <PageTitle title="Productos | Valplas Gestión" />
                <NewProduct />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/orders"  />} />
          <Route path="*" element={<Navigate to="/orders"  />} />
        </Routes>
      </DefaultLayout>
    </AuthProvider>
  );
}

export default App;
{
  /*     <Route
  path="/home"
  element={
    <PrivateRoute>
      <PageTitle title="Valplas Gestion" />
      <ECommerce />
    </PrivateRoute>
  }
/> */
}

{
  /*  <Route
  path="/sellers/new"
  element={
    <PrivateRoute>
      <PageTitle title="Nuevo vendedor | Valplas Gestión" />
      <NewSeller />
    </PrivateRoute>
  }
/>
<Route
  path="/sellers"
  element={
    <PrivateRoute>
      <PageTitle title="Vendedores | Valplas Gestión" />
      <Sellers />
    </PrivateRoute>
  }
/>
<Route
  path="/calendar"
  element={
    <PrivateRoute>
      <PageTitle title="Calendario | Valplas Gestión" />
      <Calendar />
    </PrivateRoute>
  }
/>
<Route
  path="/profile"
  element={
    <PrivateRoute>
      <PageTitle title="Perfil | Valplas Gestión" />
      <Profile />
    </PrivateRoute>
  }
/>
<Route
  path="/sales"
  element={
    <PrivateRoute>
      <PageTitle title="Ventas | Valplas Gestión" />
      <Sales />
    </PrivateRoute>
  }
/> */
}
{
  /*      <Route
  path="/stock"
  element={
    <PrivateRoute>
      <PageTitle title="Stock | Valplas Gestión" />
      <Stock />
    </PrivateRoute>
  }
/>
<Route
  path="/buy"
  element={
    <PrivateRoute>
      <PageTitle title="Compras | Valplas Gestión" />
      <Buy />
    </PrivateRoute>
  }
/>
<Route
  path="/accounting"
  element={
    <PrivateRoute>
      <PageTitle title="Contabilidad y finanzas | Valplas Gestión" />
      <Accounting />
    </PrivateRoute>
  }
/>
<Route
  path="/logistics"
  element={
    <PrivateRoute>
      <PageTitle title="Logística | Valplas Gestión" />
     
      <APIProvider
        apiKey={GOOGLE_API}
        onLoad={() => console.log('Maps API has loaded.')}
      >
        <Logistics />
      </APIProvider>
    </PrivateRoute>
  }
/> 
*/
}
