// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const WRAPPED_TOKEN_ADDRESS = process.env.WRAPPED_TOKEN_ADDRESS ?? "";

async function main() {
  const wrappedToken = await ethers.getContractAt(
    "WrappedToken",
    WRAPPED_TOKEN_ADDRESS
  );

  const setTx = await wrappedToken.setPushProtocol(
    "0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa",
    "0x6E49a917271909FD77B88c3d0c32E90716139AcB"
  );
  await setTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
