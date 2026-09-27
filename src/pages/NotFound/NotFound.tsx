import type { FC } from "react";
import { Link } from "react-router";

export const NotFound: FC = () => (
  <main>
    <h1>Page not found</h1>
    <Link to="/">Back to home</Link>
  </main>
);
