import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { RootStoreProvider } from "./store/RootStoreProvider";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <RootStoreProvider>
      <App />
    </RootStoreProvider>
  </BrowserRouter>
);
