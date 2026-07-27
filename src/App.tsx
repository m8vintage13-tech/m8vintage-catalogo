import { Routes, Route } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Admin from "./pages/Admin";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/producto/:id" element={<Product />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
