import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    artifacts: "./frontend/artifacts",
    tests: "./tests",
  },
  networks: {
    hardhat: {
      chainId: 1337, // We set 1337 to make interacting with MetaMask simpler
    },
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/Na2zliFTw7VNqJo_viAiIXDJZd9EYI8c",
      accounts: [
        "0x92eb0dca70a6b06af5915c8a275b4cb98e4e175be57c6ac69214b35a77233675",
      ],
    },
  },
  typechain: {
    outDir: "./frontend/types/typechain",
  },
};

export default config;
