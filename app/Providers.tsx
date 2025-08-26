'use client';

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

let persistor = persistStore(store);


export function Providers({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                {children}
                <ToastContainer position="top-right" autoClose={3000} />
            </PersistGate>
        </Provider>
    );
}