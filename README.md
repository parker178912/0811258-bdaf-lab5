# 0811258-bdaf-lab5
## Setting environment

```bash
mkdir lab5
cd lab5
npm install --save-dev hardhat
npx hardhat
(choose "Create an empty hardhat.config.js")
mkdir contracts test scripts
code
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
npm install @openzeppelin/contracts
```

## Contracts folder

add file at path `contracts/Token.sol` : 

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable{
    mapping(address => uint256) private _balances;
    uint256 _totalSupply;

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        _totalSupply = 100000 * 10 ** decimals();
    }
    
    // only owner (specific project) can call mint or burn function
    function mint(uint256 amount) external onlyOwner{
        _mint(msg.sender, amount * 10 ** decimals());
    }

    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount * 10 ** decimals());
    }
}
```

## Script folder

add file at path `scripts/deploy.js` :

```jsx
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with :", deployer.address);

  const ERC20 = await ethers.getContractFactory("Token");
  const token = await ERC20.deploy('SWAP', 'SWP');

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Test folder

add file at path  `test/test.js` : 

```jsx
// SPDX-License-Identifier: MIT
const { expect } = require('chai');
const { ethers } = require("hardhat");
describe('Token', function () {
    let Token;
    let token;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
    Token = await ethers.getContractFactory('Token');
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.connect(owner).deploy('MyToken', 'MTK');
    await token.deployed();
    });

    it('Should set the correct name and symbol', async function () {
        expect(await token.name()).to.equal('MyToken');
        expect(await token.symbol()).to.equal('MTK');
    });

    it('Should set the initial total supply to 0', async function () {
      expect(await token.totalSupply()).to.equal(0);
    });

    it('Should revert when a non-owner tries to mint', async function () {
      await expect(
        token.connect(addr1).mint(100)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should increase the total supply by the specified amount when owner mints', async function () {
      await token.connect(owner).mint(100);
      expect(await token.totalSupply()).to.equal(100000000000000000000n);
    });

    it('Should increase the balance of the owner by the specified amount when owner mints', async function () {
      await token.connect(owner).mint(100);
      await token.connect(owner).burn(50);
      expect(await token.balanceOf(owner.address)).to.equal(50000000000000000000n);
    });

    it('Should revert when a non-owner tries to burn', async function () {
        await expect(
        token.connect(addr1).burn(50)
        ).to.be.revertedWith('Ownable: caller is not the owner');
    });

});
```

## Compile & Test

```bash
npx hardhat compile
npx hardhat test
```

## Deploy

add `.env` file : 

```bash
API_URL = "https://eth-goerli.g.alchemy.com/v2/YOUR_API_URL "
PRIVATE_KEY = "YOUR_PRIVATE_KEY"
ETHERSCAN_API_KEY = "YOUR_ETHERSCAN_API_KEY"
```

fill in `hardhat.config.js` :

```jsx
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
```

deploy : 

```bash
npx hardhat run scripts/deploy.js --network goerli
```

Check the contracts on [goerli etherscan](https://goerli.etherscan.io/), and you can see that the contract aren’t verified yet.

## Verify

```bash
npx hardhat verify --network goerli <contract-address> <arg1> <arg2>
npx hardhat verify --network goerli 0x1C02053E9565DF6178eCaAD166D4cB9F8431107b SWAP SWP
```

You can see that the contract is verified !!

## Process

1. Develop an ERC20 token:  **(Record the address of your own token)**
    - 18 decimals.
    - Minting and burning capability with onlyOwner access control.
    - Ability to transfer ownership

→ [Token | Address 0x1C02053E9565DF6178eCaAD166D4cB9F8431107b | Etherscan](https://goerli.etherscan.io/address/0x1C02053E9565DF6178eCaAD166D4cB9F8431107b#writeContract)

1. Mint 1000 tokens (i.e. 1000 * 10^18 units) to yourself.

→ [Goerli Transaction Hash (Txhash) Details | Etherscan](https://goerli.etherscan.io/tx/0xe3ec049924086039ea6cb45e181f4197ff81a645b2d6bcd20267c6c5a745a4e3)

1. Go to Aave, lend ETH and borrow DAI out **(Record your Borrow transaction)**
    1. Go to AaveV3 Goerli: [https://staging.aave.com/?marketName=proto_goerli_v3](https://staging.aave.com/?marketName=proto_goerli_v3) 
    2. On the left, Supply 0.05 ETH.→  [Goerli Transaction Hash (Txhash) Details | Etherscan](https://goerli.etherscan.io/tx/0x1dfd38de099c3f6a9cb3c5a260a2b4297d2e522e77d7dce7ba39e217e0c65648)
    3. Borrow some DAI (50 or 100) → [Goerli Transaction Hash (Txhash) Details | Etherscan](https://goerli.etherscan.io/tx/0x95bc5d0aaa9efe376fb4279df093417f1b086f79e6c413c17d5198a36e67eb03)
2. Go to Etherscan and get the address of the DAI **(Record the address of the DAI token)**
    - As this is a testnet, there are a lot of different versions of DAI, we’re going to use the one you borrowed out from Aave.
    
    → 0xBa8DCeD3512925e52FE67b1b5329187589072A55
    
3. Go to UniswapV2 to create a new liquidity pair: [https://app.uniswap.org/#/pools/v2](https://app.uniswap.org/#/pools/v2) 
    - Make sure you are on Goerli testnet
    - “Add V2 Liquidity”
    - paste the address of your DAI token you have in one field (the ui should show you that you have some)
    - Paste the address of your own token in the other field
    - We can actually set the initial price of the token by determining the ratio between DAI and your token: let’s make your token worth 10 DAI by supplying 100 DAI to 10 of your token. (or 50 DAI to 5 of your token).
    - Approve DAI and your token to Uniswap, and hit the Supply button. (It will ask you to “Create pool and Supply”)
    - You will receive some pool tokens as per this transaction. Look at your address on Etherscan and determine the address of the token. **(Record the address of the pool token)**
    
    → [Goerli Transaction Hash (Txhash) Details | Etherscan](https://goerli.etherscan.io/tx/0xea4a7160ca4bbc99f0fff0b786ce0ee32da8c46312f86a360050488bf37c39e4), 
    
    → 0xe34F798d80D90Fb80845435DA9f39cB1C656795A
    
    - Try [Swap](https://app.uniswap.org/#/swap), you should be able to swap your token to DAI now. Buy 0.001 of your token now. **(Record the transaction)**
    
    → [Goerli Transaction Hash (Txhash) Details | Etherscan](https://goerli.etherscan.io/tx/0xb911ea6177bc04c68db52e5a861272ae3cfb50a995647b513e646bf320602862)
    
4. Create a [Safe (Gnosis’s multiSig solution) on Goerli](https://app.safe.global/new-safe/create) **(Record the address of your Safe multiSig address)**
    - Have 2 owners in the Safe. You can use Metamask to generate the second address.
    - Set the Threshold as 2 out of 2 owners. This means that every time this multiSig is sending a transaction, both of these owners have to sign.
    
    → 0xe8f6f12B77b78834b1E2E568F667fBa68959cF9d
    
5. Transfer Ownership of your token to your Safe multiSig address. **(Record the transaction)**
    
    → [Goerli Transaction Hash (Txhash) Details | Etherscan](https://goerli.etherscan.io/tx/0xb0896e9e5f27881162c2cd59349556b402c165082a88a6b59598c2d8130fa31b)
    
6. Mint 10000 of your tokens by using your Safe multiSig address to your own address **(Record the transaction)**
    
    → [Goerli Transaction Hash (Txhash) Details | Etherscan](https://goerli.etherscan.io/tx/0x84c79f249afa9873519e44b6ab5ed1a547262a0bb7ad86355bab88a83209e5b1)
    
7. Sell all of the 10000 tokens into the Uniswap pool you created. **(Record the transaction)**
    
    → [Goerli Transaction Hash (Txhash) Details | Etherscan](https://goerli.etherscan.io/tx/0x84c79f249afa9873519e44b6ab5ed1a547262a0bb7ad86355bab88a83209e5b1)
