import { useRef } from "react";
import { useAccounts, type AccountsContextType } from "../Accounts/useAccounts";

import sidebarJSON from "./sidebarContents.json";
import * as sidebarFunctions from "./sidebarFunctions";

// import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
// import AppBar from "@mui/material/AppBar";
// import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const drawerWidth = 240;

function SidebarSections({
    accountsContext,
    sidebarKey,
}: {
    accountsContext: AccountsContextType;
    sidebarKey: keyof typeof sidebarJSON;
}) {
    const sidebarContent = sidebarJSON[sidebarKey];

    const title = sidebarContent.title;
    const entries = sidebarContent.entries;
    const functionName =
        sidebarContent.functionName as keyof typeof sidebarFunctions;
    const buttonText = sidebarContent.buttonText;

    const entryRefs = useRef<HTMLInputElement[]>([]);

    const titleItem = (
        <ListItem key={title}>
            <ListItemText primary={title} />
        </ListItem>
    );

    const entriesItems = entries.map((name, index) => {
        return (
            <ListItem>
                <ListItemText primary={name} />
                <input
                    ref={(e) => {
                        if (e) entryRefs.current[index] = e;
                    }}
                />
            </ListItem>
        );
    });

    // is it a good idea to convert numbers to number type blindly?
    // i think my errors are stemming from the error shown under ...args - it doesnt know the types of args
    const buttonItem = (
        <ListItem>
            <ListItemButton
                onClick={() => {
                    //change this!
                    const args = entryRefs.current.map((e) =>
                        Number.isNaN(Number(e.value))
                            ? e.value
                            : Number(e.value),
                    );
                    const buttonFunction = sidebarFunctions[functionName] as (
                        accountContext: AccountsContextType,
                        ...args: Array<string | number>
                    ) => unknown;
                    buttonFunction(accountsContext, ...args);
                }}
            >
                <ListItemText primary={buttonText}></ListItemText>
            </ListItemButton>
        </ListItem>
    );

    return (
        <List>
            {titleItem} {entriesItems} {buttonItem}
        </List>
    );
}

export function Sidebar() {
    const accountsContext = useAccounts();

    const sidebarKeys = Object.keys(sidebarJSON) as Array<
        keyof typeof sidebarJSON
    >;

    const sidebarSections = sidebarKeys.map((k) => (
        <SidebarSections
            key={k}
            accountsContext={accountsContext}
            sidebarKey={k}
        />
    ));

    // const sidebarContentRefs = sidebarContents.map((contents) =>
    //     contents.map(() => useRef<HTMLInputElement>(null!)),
    // );

    return (
        <>
            <CssBaseline />

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                {sidebarSections}
            </Drawer>
        </>
    );
}

// <ListItem key={text} disablePadding>
//                             <ListItemButton>
//                                 <ListItemIcon>
//                                     {index % 2 === 0 ? <Box /> : <Box />}
//                                 </ListItemIcon>
//                                 <ListItemText primary={text} />
//                             </ListItemButton>
//                         </ListItem>

// <List>
//     {sidebarHeaders.map((text, i) => (
//         <>
//             <Divider />
//             <ListItem key={text}>
//                 <ListItemText primary={text} />
//             </ListItem>

//             {sidebarContents[i].map((contents, j) => {
//                 return (
//                     <ListItem>
//                         <ListItemText primary={contents} />
//                         <input
//                             ref={sidebarContentRefs[i][j]}
//                         ></input>
//                     </ListItem>
//                 );
//             })}
//             <ListItem>
//                 <ListItemButton onClick={sidebarFunctions[i]}>
//                     <ListItemText
//                         primary={"action"}
//                     ></ListItemText>
//                 </ListItemButton>
//             </ListItem>
//         </>
//     ))}
// </List>

// //temporary implementation
// export function AccountsMenu() {
//     const accountsContext = useAccounts();

//     const accCreateNameRef = useRef<HTMLInputElement>(null!);
//     const accCreateAmountRef = useRef<HTMLInputElement>(null!);
//     const accCreateqRef = useRef<HTMLInputElement>(null!);
//     const accCreaterRef = useRef<HTMLInputElement>(null!);
//     const accDeleteRef = useRef<HTMLInputElement>(null!);
//     return (
//         <>
//             <input ref={accCreateNameRef} />
//             <input ref={accCreateAmountRef} />
//             <input ref={accCreateqRef} />
//             <input ref={accCreaterRef} />
//             <button
//                 onClick={() => {
//                     accountsContext.createAccount(
//                         accCreateNameRef.current.value,
//                         "savingsAccount",
//                         Number(accCreateAmountRef.current.value),
//                         {
//                             q: Number(accCreateqRef.current.value),
//                             r: Number(accCreaterRef.current.value),
//                         },
//                     );
//                 }}
//             >
//                 Create
//             </button>
//             <br></br>
//             <input ref={accDeleteRef} />
//             <button
//                 onClick={() => {
//                     accountsContext.deleteAccount(accDeleteRef.current.value);
//                 }}
//             >
//                 Delete
//             </button>
//             <br></br>
//             <button
//                 onClick={() => {
//                     console.log(typeof accountsContext);
//                 }}
//             >
//                 show accounts
//             </button>
//         </>
//     );
// }
