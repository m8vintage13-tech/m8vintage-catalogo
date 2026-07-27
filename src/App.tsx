import { createBrowserRouter } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Admin from "./pages/Admin";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Data router: necesario para las View Transitions de React Router
// (useViewTransitionState + prop `viewTransition` en <Link>).
export const router = createBrowserRouter([
  { path: "/", element: <Catalog /> },
  { path: "/producto/:id", element: <Product /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
  },
]);
