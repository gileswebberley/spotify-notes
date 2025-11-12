import { Outlet } from 'react-router-dom';
import { UserContextProvider } from '../contexts/userContext';

function AppLayout() {
  return (
    <main className="app-layout">
      <UserContextProvider>
        <Outlet />
      </UserContextProvider>
    </main>
  );
}

export default AppLayout;
