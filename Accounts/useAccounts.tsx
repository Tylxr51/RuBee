import { createContext, useContext } from "react";
import type { Account } from "./AccountTypes";
import type { HexCoord } from "../HexCell/HexCoordType";

type AccountsContextType = {
    accounts: Account[];
    createAccount: (
        accountName: string,
        accountTypeString: string,
        goalAmount: number,
        clusterCentre: HexCoord,
    ) => void;
    deleteAccount: (accountName: string) => void;
};

export const AccountsContext = createContext<AccountsContextType | null>(null);

export const useAccounts = () => {
    const context = useContext(AccountsContext);
    if (!context) {
        throw new Error("Context error: No account context found");
    }
    return context;
};
