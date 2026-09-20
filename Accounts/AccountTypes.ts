import SavingsAccount from "./SavingsAccountClass.ts";
import CurrentAccount from "./CurrentAccountClass.ts";
import VisualData from "../VisualData/VisualDataClass.ts";

export type Account = SavingsAccount | CurrentAccount;

export type AccountData = {
    accountName: string;
    goalAmount: number;
    hexCount: number;
    visualData: VisualData;
};
