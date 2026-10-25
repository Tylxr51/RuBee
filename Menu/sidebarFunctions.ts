import { type AccountsContextType } from "../Accounts/useAccounts";

export function sidebarCreateAccount(
    accountsContext: AccountsContextType,
    name: string,
    amount: number,
    q: number,
    r: number,
) {
    console.log(name, amount, q, r);
    accountsContext.createAccount(name, "savingsAccount", amount, { q, r });
}

export function sidebarDeleteAccount(
    accountsContext: AccountsContextType,
    name: string,
) {
    accountsContext.deleteAccount(name);
}

export function sidebarShowAccounts(accountsContext: AccountsContextType) {
    console.log(accountsContext.accounts);
}
