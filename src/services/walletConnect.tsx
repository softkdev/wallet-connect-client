import { Client } from "@walletconnect/client";
import { useMemo } from "react";

export const useWalletConnect = () => {
  const namespaces = useMemo(
    () => ({
      eip155: {
        methods: [
          "eth_requestAccounts",
          "eth_sendTransaction",
          "personal_sign",
          "eth_signTypedData",
        ],
        chains: ["eip155:1", "eip155:56", "eip155:5", "eip155:97"],
        events: ["chainChanged", "accountsChanged"],
        accounts: [
          "eip155:1:0xfe9A29fbD39658CAF5CC24925bc8e62459087b88",
          "eip155:56:0xfe9A29fbD39658CAF5CC24925bc8e62459087b88",
          "eip155:5:0xfe9A29fbD39658CAF5CC24925bc8e62459087b88",
          "eip155:97:0xfe9A29fbD39658CAF5CC24925bc8e62459087b88",
        ],
      },
    }),
    []
  );

  const connectWallet = async () => {
    const walletConnectClient = await Client.init({
      relayProvider: "wss://relay.walletconnect.com",
      projectId: "your_project_id", // Get this from WalletConnect cloud
    });
    await walletConnectClient.pair({ uri: "your_walletconnect_url" }); // Use the URL you copy from the popup
  };

  const handleConnectWallet = () => {
    walletConnectClient.on("session_update", ({ params }) => {
      const { accounts, chains } = params[0];
      console.log("Accounts updated:", accounts);
      console.log("Chains updated:", chains);
    });

    walletConnectClient.on("disconnect", () => {
      console.log("Wallet disconnected");
    });
  };

  return {
    walletConnectClient,
  };
};
