import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { Sidebar } from "./components/sidebar";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <Sidebar>
            <Suspense>{props.children}</Suspense>
          </Sidebar>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
