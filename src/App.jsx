//following the tutorial https://dev.to/dom_the_dev/how-to-use-the-spotify-api-in-your-react-js-app-50pn
//going to use the overlayscrollbars package so I need to import the css - moving this to it's component so it is dynamically loaded
// import 'overlayscrollbars/styles/overlayscrollbars.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';
import Spinner from './ui/Spinner';
// import AppLayout from './ui/AppLayout';
const AppLayout = lazy(() => import('./ui/AppLayout'));
const Home = lazy(() => import('./pages/Home'));
// import Error from './ui/Error';
const Error = lazy(() => import('./ui/Error'));
const Playlists = lazy(() => import('./pages/Playlists'));
import { playlistsLoader } from './loaders/playlistsLoader';
const Playlist = lazy(() => import('./pages/Playlist'));
import { playlistLoader } from './loaders/playlistLoader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import Landing from './pages/Landing';
const Landing = lazy(() => import('./pages/Landing'));

//I'm dealing with a lot of data requests now so I'm going to implement tanstack query to look after caching etc
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 120000,
    },
  },
});

const router = createBrowserRouter(
  //Now we're going to create a layout that will work with phone screens or browsers on a pc in the AppLayout component, then make our routes children
  [
    {
      index: true,
      element: <Landing />,
      errorElement: <Error />,
    },
    {
      path: '/auth',
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
          //let's try to use the prefetch of the infinite query as it is a different call to the call for getting more tracks
          loader: playlistLoader(queryClient),
          errorElement: <Error />,
        },
      ],
    },
  ]
);

function App() {
  //standard setup for react router v6.4+
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        future={{ v7_startTransition: true }}
        router={router}
        fallbackElement={<Spinner />}
      />
    </QueryClientProvider>
  );
}

export default App;
