import React, { useState } from "react";
import WalletConnectClient from "./WalletConnectClient";

const App: React.FC = () => {
  const [walletURI, setWalletURI] = useState("");

  const handleConnect = async () => {
    try {
      if (!walletURI) {
        alert("Please enter the WalletConnect URI!");
        throw "Error";
      }

      await WalletConnectClient.connect(walletURI);
      console.log("Connected to WalletConnect!");
    } catch (error) {
      console.error("Error connecting:", error);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">WalletConnect with React</h1>
        <input
          type="text"
          placeholder="Paste WalletConnect URI"
          value={walletURI}
          onChange={(e) => setWalletURI(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={handleConnect}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default App;
