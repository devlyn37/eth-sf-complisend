// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { MockToken } from "../frontend/types/typechain";

const ERC20_TOKEN_ADDRESS = "0xf38d32C01233eDAF3b61DAaD0eb598521688C3C6";
const WRAPPED_TOKEN_ADDRESS = "0x02052ABEC1ccc18093022b6b648b9754201C7D5f";

async function main() {
  const [account, account2] = await ethers.getSigners();
  const erc20Token = (await ethers.getContractAt(
    "MockToken",
    ERC20_TOKEN_ADDRESS
  )) as MockToken;
  const wrappedToken = await ethers.getContractAt(
    "WrappedToken",
    WRAPPED_TOKEN_ADDRESS
  );

  for (let i = 1; i <= 15; i++) {
    const transferTx = await wrappedToken.safeTransferFrom(
      account.address,
      account2.address,
      await wrappedToken.erc20TokenID(erc20Token.address),
      2,
      ethers.utils.toUtf8Bytes("test"),
      {
        gasPrice: 20000000000,
      }
    );
    await transferTx.wait();

    console.log(`${i} done`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
