import * as accFunctions from "../Accounts/AccountFunctions";

//temporary implementation
// function createClusterData() {
//     const cluster1 = new ClusterData(
//         "one",
//         { q: 0, r: 0 },
//         3,
//         new THREE.Color(1, 1, 0),
//     );
//     const cluster2 = new ClusterData(
//         "two",
//         { q: 5, r: 3 },
//         4,
//         new THREE.Color(0, 1, 1),
//     );
//     const cluster3 = new ClusterData(
//         "three",
//         { q: -8, r: -4 },
//         6,
//         new THREE.Color(1, 0, 1),
//     );
//     const cluster4 = new ClusterData(
//         "four",
//         { q: 8, r: -4 },
//         2,
//         new THREE.Color(0.5, 0.5, 0.5),
//     );

//     return [cluster1, cluster2, cluster3, cluster4];
// }

export function getVisualData() {
    const visualDataArray = accFunctions
        .getAccountsArray()
        .map((account) => account.visualData);

    return visualDataArray;
}
