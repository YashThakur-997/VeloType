import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Mainsection from './pages/mainsection.jsx';
import Roomsection from './pages/roomsection.jsx';

function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      element:<><Mainsection/></>
    },
    {
      path:"/room/:roomId",
      element:<><Roomsection/></>
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;