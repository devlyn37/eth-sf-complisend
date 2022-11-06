// Please run `npx hardhat run` before
import { ethers } from "hardhat";

async function main() {
  const accounts = await ethers.getSigners();

  const NFTFactory = await ethers.getContractFactory("MockNFT");
  const kycNFT = await NFTFactory.deploy("KYC NFT", "KT");
  await kycNFT.deployed();

  for (let i = 0; i < 3; i++) {
    const mintTx = await kycNFT.mint(accounts[i].address, i);
    await mintTx.wait();
  }

  console.log(
    "KYC NFT contract has been deployed and assigned KYC NFT to 3 accounts"
  );
  console.log("3 accounts have KYC, and 2 others doesn't have");

  const WrappedTokenFactory = await ethers.getContractFactory("WrappedToken");
  const wrappedToken = await WrappedTokenFactory.deploy(
    kycNFT.address,
    ethers.constants.AddressZero,
    ethers.constants.AddressZero
  );

  console.log("WrappedToken has been deployed");

  console.log("");
  console.log("ERC20 Transfer");

  const MockTokenFactory = await ethers.getContractFactory("MockToken");
  const mockToken = await MockTokenFactory.deploy("MockToken", "MT");
  await mockToken.deployed();

  for (let i = 0; i < 3; i++) {
    const mintTx = await mockToken.mint(
      accounts[i].address,
      ethers.utils.parseEther("100")
    );
    await mintTx.wait();

    const approveTx = await mockToken
      .connect(accounts[i])
      .approve(wrappedToken.address, ethers.utils.parseEther("100"));
    await approveTx.wait();

    const lockTx = await wrappedToken
      .connect(accounts[i])
      .lockERC20(
        mockToken.address,
        accounts[i].address,
        accounts[i].address,
        ethers.utils.parseEther("100"),
        ethers.utils.toUtf8Bytes("lock")
      );

    await lockTx.wait();
  }

  const pairs = [
    [0, 1], // o → o
    [3, 4], // x → x
    [0, 3], // o → x
    [4, 1], // x → o
  ];

  const getAccountType = async (address) => {
    const balance = await kycNFT.balanceOf(address);

    return !balance.isZero() ? "KYC Holder" : "Non KYC holder";
  };

  await Promise.all(
    pairs.map(async ([sender, recipient]) => {
      let result = true;
      try {
        await wrappedToken
          .connect(accounts[sender])
          .safeTransferFrom(
            accounts[sender].address,
            accounts[recipient].address,
            await wrappedToken.erc20TokenID(mockToken.address),
            ethers.utils.parseEther("10"),
            ethers.utils.toUtf8Bytes("transfer")
          );
        result = true;
      } catch (_err) {
        result = false;
      }

      console.log(
        `account ${sender}  (${await getAccountType(
          accounts[sender].address
        )})) -> account ${recipient} (${await getAccountType(
          accounts[recipient].address
        )}): transfer ${result ? "succeeded" : "failed"}`
      );
    })
  );

  console.log("");
  console.log("ERC721 Tansfer");

  const MockNFTFactory = await ethers.getContractFactory("MockNFT");
  const mockNFT = await MockNFTFactory.deploy("MockToken", "MT");
  await mockNFT.deployed();

  for (let i = 0; i < 3; i++) {
    const mintTx = await mockNFT.mint(accounts[i].address, i);
    mintTx.wait();

    const approveTx = await mockNFT
      .connect(accounts[i])
      .approve(wrappedToken.address, i);
    await approveTx.wait();

    const lockTx = await wrappedToken
      .connect(accounts[i])
      .lockERC721(
        mockNFT.address,
        i,
        accounts[i].address,
        accounts[i].address,
        ethers.utils.toUtf8Bytes("lock")
      );
    await lockTx.wait();
  }

  await Promise.all(
    pairs.map(async ([sender, recipient]) => {
      let result = true;
      try {
        await wrappedToken
          .connect(accounts[sender])
          .safeTransferFrom(
            accounts[sender].address,
            accounts[recipient].address,
            await wrappedToken.erc721TokenID(mockNFT.address, sender),
            ethers.utils.parseEther("10"),
            ethers.utils.toUtf8Bytes("transfer")
          );
        result = true;
      } catch (_e) {
        result = false;
      }

      console.log(
        `account ${sender}  (${getAccountType(
          accounts[sender].address
        )})) -> account ${recipient} (${getAccountType(
          accounts[recipient].address
        )}): transfer ${result ? "succeeded" : "failed"}`
      );
    })
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
