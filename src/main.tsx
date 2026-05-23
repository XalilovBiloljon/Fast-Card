import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from 'react-redux';
import { store } from './shared/store/store';
import "./index.css";
import "@/shared/config/i18n/i18n";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
