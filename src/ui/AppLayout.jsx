import { Outlet } from 'react-router-dom';
import { UserContextProvider } from '../contexts/UserContext';

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
