import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Mainsection from './pages/mainsection.jsx';
import Roomsection from './pages/roomsection.jsx';
import Gamesection from './pages/gamesection.jsx';
import Resultssection from './pages/resultssection.jsx';

function App() {

  const router = createBrowserRouter([
    {
      path:"/",
      element:<><Mainsection/></>
    },
    {
      path:"/room/:roomId",
      element:<><Roomsection/></>
    },
    {
      path:"/game/:roomId",
      element:<><Gamesection/></>
    },
    {
      path:"/results/:roomId",
      element:<><Resultssection/></>
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;