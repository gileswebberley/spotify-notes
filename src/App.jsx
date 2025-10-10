//following the tutorial https://dev.to/dom_the_dev/how-to-use-the-spotify-api-in-your-react-js-app-50pn

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './ui/AppLayout';
import Home from './pages/Home';
import Error from './ui/Error';
import Playlists from './pages/Playlists';
import Auth from './pages/Auth';

const router = createBrowserRouter(
  //Now we're going to create a layout that will work with phone screens or browsers on a pc in the AppLayout component, then make our routes children
  [
    {
      //layout route so no path
      element: <AppLayout />,
      //browser router also catches errors and you can define a component to be shown if that occurs (see Error component for how to get the message)
      errorElement: <Error />,
      children: [
        {
          path: '/',
          element: <Home />,
          errorElement: <Error />,
        },
        {
          path: '/auth',
          element: <Auth />,
          errorElement: <Error />,
        },
        {
          path: '/playlists',
          element: <Playlists />,
          //loader function defined and exported from Menu.js
          // loader: menuLoader,
          //our overall error handler does not sit within the layout because it is at the parent level so let's catch those more local errors here and stop it bubbling-up
          errorElement: <Error />,
        },
        // {
        //   path: "/cart",
        //   element: <Cart />,
        //   errorElement: <Error />,
        // },
        // {
        //   path: "/order/new",
        //   element: <CreateOrder />,
        //   //now we are using the actions functionality to submit a Form (not form) from the CreateOrder component
        //   action: CreateOrderAction,
        //   errorElement: <Error />,
        // },
        // {
        //   path: "/order/:orderId",
        //   element: <Order />,
        //   loader: orderLoader,
        //   action: updateOrderAction,
        //   errorElement: <Error />,
        // },
      ],
    },
  ]
);

function App() {
  //standard setup for react router v6.4+
  return <RouterProvider router={router} />;
}

export default App;
