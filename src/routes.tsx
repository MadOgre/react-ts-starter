import { createBrowserRouter } from "react-router";
import { Home, NotFound } from "@/pages";

// Data-mode router.
export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "*", element: <NotFound /> },
]);
