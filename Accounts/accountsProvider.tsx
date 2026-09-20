import { useState } from "react";
import type { HexCoord } from "../HexCell/HexCoordType";
import type { Account } from "./AccountTypes";
import SavingsAccount from "./SavingsAccountClass";
import CurrentAccount from "./CurrentAccountClass";
import { AccountsContext } from "./useAccounts";

export function AccountsProvider({ children }: { children: React.ReactNode }) {
    const [accounts, setAccounts] = useState<Account[]>([]);

    function createAccount(
        accountName: string,
        accountTypeString: string,
        goalAmount: number,
        clusterCentre: HexCoord,
    ) {
        const accountType = {
            savingsAccount: SavingsAccount,
            currentAccount: CurrentAccount,
        }[accountTypeString];

        if (!accountType) {
            throw Error("Account Type Error: Account type does not exist");
        }

        accounts.forEach((account) => {
            if (account.accountName === accountName) {
                throw Error(
                    "Overwrite error: Account of same name already exists",
                );
            }
        });

        setAccounts((prev) => [
            ...prev,
            new accountType(accountName, goalAmount, clusterCentre),
        ]);
    }

    function deleteAccount(accountName: string) {
        const correspondingAccount = accounts.find(
            (account) => account.accountName === accountName,
        );

        if (!correspondingAccount) {
            throw Error("Name Error: Account of that name does not exist");
        }

        const correspondingAccountIndex =
            accounts.indexOf(correspondingAccount);

        console.log(correspondingAccountIndex);

        console.log(`Deleting Account: ${correspondingAccount.accountName}`);

        setAccounts((prev) =>
            prev.filter((_, i) => i !== correspondingAccountIndex),
        );
    }

    return (
        <AccountsContext.Provider
            value={{ accounts, createAccount, deleteAccount }}
        >
            {children}
        </AccountsContext.Provider>
    );
}
