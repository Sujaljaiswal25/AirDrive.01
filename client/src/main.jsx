import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { store, persistor } from "./store/store";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#0D0D0D",
                color: "#EEEEEE",
                border: "1px solid #253900",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "14px",
                fontWeight: "500",
                backdropFilter: "blur(10px)",
                boxShadow: "0 8px 32px rgba(8, 203, 0, 0.1)",
              },
              success: {
                duration: 3000,
                style: {
                  background: "#0D0D0D",
                  border: "1px solid #08CB00",
                  boxShadow: "0 8px 32px rgba(8, 203, 0, 0.2)",
                },
                iconTheme: {
                  primary: "#08CB00",
                  secondary: "#000000",
                },
              },
              error: {
                duration: 4000,
                style: {
                  background: "#0D0D0D",
                  border: "1px solid #ef4444",
                  boxShadow: "0 8px 32px rgba(239, 68, 68, 0.2)",
                },
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#000000",
                },
              },
              loading: {
                style: {
                  background: "#0D0D0D",
                  border: "1px solid #253900",
                },
                iconTheme: {
                  primary: "#08CB00",
                  secondary: "#000000",
                },
              },
            }}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
