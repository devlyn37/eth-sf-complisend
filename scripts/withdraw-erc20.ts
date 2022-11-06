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

  const value = ethers.utils.parseEther("1000");

  const depositTx = await wrappedToken.releaseERC20(
    erc20Token.address,
    account.address,
    value,
    ethers.utils.toUtf8Bytes("test")
  );
  await depositTx.wait();

  console.log(
    `Withdrew ${value.toString()} tokens from ${
      account.address
    } in WrappedToken`
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
