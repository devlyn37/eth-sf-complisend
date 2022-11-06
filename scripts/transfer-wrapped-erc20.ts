// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { MockToken } from "../frontend/types/typechain";

const ERC20_TOKEN_ADDRESS = process.env.ERC20_TOKEN_ADDRESS ?? "";
const WRAPPED_TOKEN_ADDRESS = process.env.WRAPPED_TOKEN_ADDRESS ?? "";

async function main() {
  const [account] = await ethers.getSigners();
  const erc20Token = (await ethers.getContractAt(
    "MockToken",
    ERC20_TOKEN_ADDRESS
  )) as MockToken;
  const wrappedToken = await ethers.getContractAt(
    "WrappedToken",
    WRAPPED_TOKEN_ADDRESS
  );

  const tx = await wrappedToken.safeTransferFrom(
    account.address,
    "0xE898BBd704CCE799e9593a9ADe2c1cA0351Ab660",
    await wrappedToken.erc20TokenID(erc20Token.address),
    ethers.utils.parseEther("10000"),
    ethers.utils.toUtf8Bytes("test")
  );

  await tx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
