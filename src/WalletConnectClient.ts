import WalletConnectCore from "@walletconnect/core";
import Client, { WalletKitTypes } from "@reown/walletkit";
import { WalletKit } from "@reown/walletkit/dist/types/client";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";

class WalletConnectClient {
  private core?: WalletConnectCore;
  private walletKit?: WalletKit;

  constructor() {
    this.init();
  }

  async init() {
    const projectId = import.meta.env.VITE_PROJECT_ID;
    if (!projectId) {
      throw new Error("WalletConnect Project ID is missing!");
    }
    this.core = new WalletConnectCore({
      projectId: projectId,
      logger: "info",
      relayUrl: "wss://relay.walletconnect.com", // Specify the relay server URL
    });
    console.log("Core instance:", this.core);
    this.walletKit = await Client.init({
      core: this.core,
      metadata: {
        name: "Demo app",
        description: "Demo Client as Wallet/Peer",
        url: "https://reown.com/walletkit",
        icons: [],
      },
    });
  }

  async onSessionProposal({ id, params }: WalletKitTypes.SessionProposal) {
    try {
      const approvedNamespaces = buildApprovedNamespaces({
        proposal: params,
        supportedNamespaces: {
          eip155: {
            chains: ["eip155:1", "eip155:137"],
            methods: ["eth_sendTransaction", "personal_sign"],
            events: ["accountsChanged", "chainChanged"],
            accounts: [
              "eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
              "eip155:137:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb",
            ],
          },
        },
      });
      const session = await this.walletKit?.approveSession({
        id,
        namespaces: approvedNamespaces,
      });
      console.log("SESSION PROPOSAL: ", session);
    } catch (error) {
      console.error("ERROR: ", error);
      await this.walletKit?.rejectSession({
        id,
        reason: getSdkError("USER_REJECTED"),
      });
    }
  }

  async connect(walletConnectURI: string) {
    try {
      this.walletKit?.on("session_proposal", this.onSessionProposal);
      await this.walletKit?.pair({ uri: walletConnectURI });
      const session = this.getSession();
      console.log("Connected session:", session);
    } catch (error) {
      console.error("Error connecting:", error);
    }
  }

  public getSession() {
    return this.walletKit?.getActiveSessions();
  }
}

export default new WalletConnectClient();
