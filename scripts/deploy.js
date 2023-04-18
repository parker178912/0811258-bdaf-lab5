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