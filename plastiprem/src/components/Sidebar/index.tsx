import { useEffect, useRef,  } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {  BsArrowRight, BsBox, BsBoxes, BsBucket, BsCalculator, BsCalendar, BsCurrencyDollar,  BsDropbox, BsHouse, BsPeople, BsPerson,  BsPersonWorkspace,  BsTruck } from 'react-icons/bs';
import { useAuth } from '../../feature/Auth/AuthContext';

// import SidebarLinkGroup from './SidebarLinkGroup';



interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({  sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const {isAuthenticated} =useAuth()
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);



  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  if(!isAuthenticated)
    return null
  return (
    <aside
      ref={sidebar}
      className={`fixed right-0 top-0 z-9999 flex h-screen w-44 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'} `}
    >


      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="py-4 px-4 lg:px-6">
          {/* <!-- Menu Group --> */}

          <div className='flex justify-end lg:flex-row-reverse items-center py-2 gap-3'

            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >

            <h3 className=" text-sm font-semibold text-bodydark2">
              MENU
            </h3>
            <button
              className="block lg:hidden"
            >
              <BsArrowRight />
            </button>
          </div>
          <ul className="mb-6 flex flex-col items-end lg:items-start gap-1.5">
           {/*  
           <li
            className=''
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/home"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.length === 1 &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >
                Home
                <BsHouse />
              </NavLink>
            </li>
            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/calendar"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('calendar') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >
                Calendario
                <BsCalendar />
              </NavLink>
            </li> 
            */}
            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/orders"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('orders') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >

                Pedidos
                <BsBox />
              </NavLink>
            </li>
            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/products"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('products') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >

                Productos
                <BsDropbox />
              </NavLink>
            </li>
            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/clients"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('clients') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >

                Clientes
                <BsPersonWorkspace />
              </NavLink>
            </li>

            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/accounting"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('accounting') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >

                Contabilidad
                <BsCalculator />
              </NavLink>
            </li>
            {/* 
            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/sellers"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('sellers') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >

                Vendedores
                <BsPeople />
              </NavLink>
            </li>

            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/profile"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                  }`}
              >

                Perfil
                <BsPerson />
              </NavLink>
            </li>
            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/sales"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('sales') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >

                Ventas
                <BsCurrencyDollar />
              </NavLink>
            </li>
             */}
            
            {/* 
            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/stock"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('stock') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >

                Stock
                <BsBoxes />
              </NavLink>
            </li>
            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/buy"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('buy') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >

                Compras
                <BsBucket />
              </NavLink>
            </li>
            
            <li
              onClick={() => setSidebarOpen(false)}
            >
              <NavLink
                to="/logistics"
                className={`group relative flex lg:flex-row-reverse items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${pathname.includes('logistics') &&
                  'bg-graydark dark:bg-meta-4'
                  }`}
              >
                Logística
                <BsTruck />
              </NavLink>
            </li>
             */}
          </ul>



        </nav>
      </div>
    </aside >
  );
};

export default Sidebar;
