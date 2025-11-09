'use client';

import axios from "axios";
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";

type typeTokenContext = {
    accessToken: string | undefined,
    setAccessToken: Dispatch<SetStateAction<string | undefined>>;
}

export const TokenContext = createContext<typeTokenContext | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
    useEffect(() => {
        async function restoreToken() {
            const request = await axios.post('/api/auth/refresh', {
                withCredentials: true
            });
            if (request.status === 200) {
                setAccessToken(request.data.accessToken);
            } else {
                setAccessToken(undefined);
            }
        }
        restoreToken();
    }, []);
    return (
        <TokenContext.Provider value={{ accessToken, setAccessToken }}>
            {children}
        </TokenContext.Provider>
    )
}

export const useToken = () => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error("useToken must be used inside a TokenProvider");
    }
    return context;
};
