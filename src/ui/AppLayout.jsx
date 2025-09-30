import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <main className="app-layout">
      <Outlet />
    </main>
  );
}

export default AppLayout;
