// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const ERC20_TOKEN_ADDRESS = process.env.ERC20_TOKEN_ADDRESS ?? "";

async function main() {
  const [account] = await ethers.getSigners();
  const mockToken = await ethers.getContractAt(
    "MockToken",
    ERC20_TOKEN_ADDRESS
  );

  const recipient = account.address;
  const value = ethers.utils.parseEther("100000");

  const tx = await mockToken.mint(recipient, value);
  await tx.wait();

  console.log(`Minted ${value.toString()} tokens to ${recipient}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
