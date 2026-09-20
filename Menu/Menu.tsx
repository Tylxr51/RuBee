import { useRef } from "react";
import { useAccounts } from "../Accounts/useAccounts";

//temporary implementation
export function AccountsMenu() {
    const accountsContext = useAccounts();

    const accCreateNameRef = useRef<HTMLInputElement>(null!);
    const accCreateAmountRef = useRef<HTMLInputElement>(null!);
    const accCreateqRef = useRef<HTMLInputElement>(null!);
    const accCreaterRef = useRef<HTMLInputElement>(null!);
    const accDeleteRef = useRef<HTMLInputElement>(null!);
    return (
        <>
            <input ref={accCreateNameRef} />
            <input ref={accCreateAmountRef} />
            <input ref={accCreateqRef} />
            <input ref={accCreaterRef} />
            <button
                onClick={() => {
                    accountsContext.createAccount(
                        accCreateNameRef.current.value,
                        "savingsAccount",
                        Number(accCreateAmountRef.current.value),
                        {
                            q: Number(accCreateqRef.current.value),
                            r: Number(accCreaterRef.current.value),
                        },
                    );
                }}
            >
                Create
            </button>
            <br></br>
            <input ref={accDeleteRef} />
            <button
                onClick={() => {
                    accountsContext.deleteAccount(accDeleteRef.current.value);
                }}
            >
                Delete
            </button>
            <br></br>
            <button
                onClick={() => {
                    console.log(typeof accountsContext);
                }}
            >
                show accounts
            </button>
        </>
    );
}
