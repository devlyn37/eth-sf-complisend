// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

const ERC721_TOKEN_ADDRESS = process.env.ERC721_TOKEN_ADDRESS ?? "";
const WRAPPED_TOKEN_ADDRESS = process.env.WRAPPED_TOKEN_ADDRESS ?? "";

async function main() {
  const [account] = await ethers.getSigners();
  const mockNFT = await ethers.getContractAt("MockNFT", ERC721_TOKEN_ADDRESS);
  const wrappedToken = await ethers.getContractAt(
    "WrappedToken",
    WRAPPED_TOKEN_ADDRESS
  );

  const tx = await mockNFT.mint(account.address, 0, {
    gasPrice: 2500000000,
  });
  console.log("minting... ", tx.hash);
  await tx.wait();

  console.log(`Minted NFT to ${account.address}`);

  const approveTx = await mockNFT.approve(wrappedToken.address, 0, {
    gasPrice: 2500000000,
  });
  console.log("approving... ", approveTx.hash);
  await approveTx.wait();

  const depositTx = await wrappedToken.lockERC721(
    mockNFT.address,
    0,
    account.address,
    account.address,
    ethers.utils.toUtf8Bytes("deposit_nft_test"),
    {
      gasPrice: 2500000000,
    }
  );
  console.log("depositing... ", depositTx.hash);
  await depositTx.wait();

  console.log(`Deposited NFT from ${account.address} to WrappedToken`);

  const withdraw_tx = await wrappedToken.releaseERC721(
    mockNFT.address,
    0,
    account.address,
    ethers.utils.toUtf8Bytes("withdraw_nft_test"),
    {
      gasPrice: 2500000000,
    }
  );
  console.log("withdrawing... ", withdraw_tx.hash);
  await withdraw_tx.wait();

  console.log(`Withdrew NFT to ${account.address} from WrappedToken`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
