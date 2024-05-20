import { Chain } from "@rainbow-me/rainbowkit";
import {
    arbitrumGoerli,
    baseSepolia,
    blastSepolia,
    modeTestnet,
    opBNBTestnet,
    optimismGoerli,
    zkSyncSepoliaTestnet,
} from "viem/chains";

import { iconModeTestnet, iconOpBNBTestnet, iconZkSyncSepoliaTestnet } from "@/assets";
import { onusTestnet } from "@/chain";

export const chainTestnet: [Chain, ...Chain[]] = [
    {
        ...opBNBTestnet,
        iconUrl: iconOpBNBTestnet,
    },
    arbitrumGoerli,
    baseSepolia,
    blastSepolia,
    {
        ...modeTestnet,
        iconUrl: iconModeTestnet,
    },
    optimismGoerli,
    {
        ...zkSyncSepoliaTestnet,
        iconUrl: iconZkSyncSepoliaTestnet,
    },
    onusTestnet,
];