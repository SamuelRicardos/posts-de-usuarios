import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Posts from "./pages/posts";
import Details from "./pages/details";


export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Posts/>,
    },
    {
      path: "/details/:id",
      element: <Details/>,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}