import SavingsAccount from "./SavingsAccountClass.ts";
import CurrentAccount from "./CurrentAccountClass.ts";
import type { HexCoord } from "../HexCell/HexCoordType.ts";

const accountsArray: (CurrentAccount | SavingsAccount)[] = [];

export function createSavingsAccount(
    accountName: string,
    goalAmount: number,
    clusterCentre: HexCoord,
) {
    accountsArray.forEach((account) => {
        if (account.accountName === accountName) {
            throw Error("Overwrite error: Account of same name already exists");
        }
    });

    accountsArray.push(
        new SavingsAccount(accountName, goalAmount, clusterCentre),
    );
}

export function createCurrentAccount(
    accountName: string,
    goalAmount: number,
    clusterCentre: HexCoord,
) {
    accountsArray.forEach((account) => {
        if (account.accountName === accountName) {
            throw Error("Overwrite error: Account of same name already exists");
        }
    });

    accountsArray.push(
        new CurrentAccount(accountName, goalAmount, clusterCentre),
    );
}

export function deleteAccount(accountName: string) {
    const accountMatchingName = accountsArray.find(
        (account) => account.accountName === accountName,
    );
    if (!accountMatchingName) {
        throw Error("Name Error: Account of that name does not exist");
    }
    accountsArray.splice(accountsArray.indexOf(accountMatchingName), 1);
}

export function getAccountsArray() {
    return accountsArray;
}
