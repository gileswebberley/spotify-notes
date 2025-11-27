//following the tutorial https://dev.to/dom_the_dev/how-to-use-the-spotify-api-in-your-react-js-app-50pn
//going to use the overlayscrollbars package so I need to import the css
import 'overlayscrollbars/styles/overlayscrollbars.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';
import Spinner from './ui/Spinner';
import AppLayout from './ui/AppLayout';
const Home = lazy(() => import('./pages/Home'));
import Error from './ui/Error';
const Playlists = lazy(() => import('./pages/Playlists'));
import { loader as playlistsLoader } from './pages/Playlists';
const Playlist = lazy(() => import('./pages/Playlist'));
import { loader as playlistLoader } from './pages/Playlist';
// import Auth from './pages/Auth';

const router = createBrowserRouter(
  //Now we're going to create a layout that will work with phone screens or browsers on a pc in the AppLayout component, then make our routes children
  [
    {
      index: true,
      // path: '/',
      element: <Home />,
      errorElement: <Error />,
    },
    {
      path: '/',
      //layout route so no path
      element: <AppLayout />,
      //browser router also catches errors and you can define a component to be shown if that occurs (see Error component for how to get the message)
      errorElement: <Error />,
      children: [
        // {
        //   index: true,
        //   // path: '/',
        //   element: <Home />,
        //   errorElement: <Error />,
        // },
        // {
        //   path: '/auth',
        //   element: <Auth />,
        //   errorElement: <Error />,
        // },
        {
          path: '/playlists',
          element: <Playlists />,
          //loader function defined and exported from Menu.js
          loader: playlistsLoader,
          //our overall error handler does not sit within the layout because it is at the parent level so let's catch those more local errors here and stop it bubbling-up
          errorElement: <Error />,
        },
        {
          path: '/playlist/:playlistId',
          element: <Playlist />,
          loader: playlistLoader,
          errorElement: <Error />,
        },
      ],
    },
  ]
);

function App() {
  //standard setup for react router v6.4+
  return (
    <RouterProvider
      // future={{ v7_startTransition: true }}
      router={router}
      fallbackElement={<Spinner />}
    />
  );
}

export default App;
