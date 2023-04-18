/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('hardhat-deploy');
require("hardhat-deploy-ethers");
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan")
module.exports = {
  solidity: "0.8.18",
};
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// Your API key for Etherscan
// Obtain one at https://etherscan.io/
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  defaultNetwork: "goerli",
  networks: {
    hardhat: {
      gasPrice: 1000000000,
      gasLimit: 10000000, 
    },
    goerli: {
       url: API_URL,
       accounts: [`0x${PRIVATE_KEY}`]
    }
 },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};