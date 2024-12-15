import { Core } from "@walletconnect/core";
import { WalletKit } from "@reown/walletkit";

class WalletConnectClient {
  private core: Core;
  private walletKit: WalletKit;

  constructor() {
    console.log("Core instance:", this.core);
    const projectId = import.meta.env.VITE_PROJECT_ID; // Load projectId from env file
    if (!projectId) {
      throw new Error("WalletConnect Project ID is missing!");
    }

    // Properly initialize Core with required options
    this.core = new Core({
      projectId: projectId,
      logger: "info", // Add a logger to avoid undefined errors
      relayUrl: "wss://relay.walletconnect.com", // Specify the relay server URL
    });
    console.log("Core instance:", this.core);
    this.walletKit = new WalletKit(this.core);
  }

  async connect(walletConnectURI: string) {
    try {
      const session = await this.walletKit.connect({
        uri: walletConnectURI,
      });
      console.log("Connected session:", session);
    } catch (error) {
      console.error("Error connecting:", error);
    }
  }
}

export default new WalletConnectClient();
