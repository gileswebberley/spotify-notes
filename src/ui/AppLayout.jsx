import { Outlet, useLocation, useNavigation } from 'react-router-dom';
import { UserContextProvider } from '../contexts/UserContext';
import Spinner from './Spinner';
import User from './User';
import OverlayScrollContainer from './OverlayScrollContainer';
import Header from './Header';
import Footer from './Footer';

function AppLayout() {
  const navigationState = useNavigation();
  const location = useLocation();
  const isLoading = navigationState.state === 'loading';
  // console.log(`AppLayout navigation status: ${navigationState.state}`);
  if (isLoading) return <Spinner />;

  return (
    <main className="app-layout">
      <UserContextProvider>
        <Header />
        <OverlayScrollContainer className="main-content">
          <Outlet key={location.key} />
        </OverlayScrollContainer>
        <Footer />
      </UserContextProvider>
    </main>
  );
}

export default AppLayout;
