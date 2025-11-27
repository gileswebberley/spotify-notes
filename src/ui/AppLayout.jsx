import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import { UserContextProvider } from '../contexts/userContext';
import Spinner from './Spinner';
import User from './User';

function AppLayout() {
  const navigationState = useNavigation();
  const location = useLocation();
  const isLoading = navigationState.state === 'loading';
  console.log(`AppLayout navigation status: ${navigationState.state}`);
  if (isLoading) return <Spinner />;

  return (
    <main className="app-layout">
      <UserContextProvider>
        <section className="main-content">
          <Outlet key={location.key} />
        </section>
        <footer>
          <div className="footer-content">
            <User />
          </div>
        </footer>
      </UserContextProvider>
    </main>
  );
}

export default AppLayout;
