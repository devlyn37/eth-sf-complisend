// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import fs from "fs";
import { config, ethers } from "hardhat";

async function main() {
  const WrappedTokenFactory = await ethers.getContractFactory("WrappedToken");
  const wrappedToken = await WrappedTokenFactory.deploy(
    ethers.constants.AddressZero
  );
  await wrappedToken.deployed();

  console.log("Wrapped Token deployed to", wrappedToken.address);
}

// https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/master/scripts/deploy.js
function saveFrontendFiles(
  contractAddress: string,
  contractName: string,
  nftContractAddress: string,
  nftContractName: string
) {
  fs.writeFileSync(
    `${config.paths.artifacts}/contracts/contractAddress.ts`,
    `export const ${contractName} = '${contractAddress}'\nexport const ${nftContractName} = '${nftContractAddress}'\n`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
