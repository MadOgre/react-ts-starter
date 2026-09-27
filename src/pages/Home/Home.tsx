import type { FC } from "react";
import { useItems } from "@/apiHooks";
import styles from "./Home.module.scss";

export const Home: FC = () => {
  const { data: items, isPending, isError } = useItems();

  return (
    <main>
      <h1>react-ts-starter</h1>
      <p className={styles.intro}>Edit this Page to start building your app.</p>
      {isPending && <p>Loading Items…</p>}
      {isError && <p>Could not load Items.</p>}
      {items && (
        <ul>
          {items.map(({ id, name, description }) => (
            <li key={id}>
              <strong>{name}</strong>: {description}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};
