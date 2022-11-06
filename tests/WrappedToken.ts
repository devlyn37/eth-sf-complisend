import { ethers } from "hardhat";
import { expect } from "chai";
import { BigNumber, BigNumberish } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { WrappedToken, MockToken, MockNFT } from "../typechain";

describe("WrappedToken", () => {
  describe("ERC20Transfer", () => {
    let wrappedToken: WrappedToken;
    let mockToken: MockToken;
    let accounts: SignerWithAddress[];

    beforeEach(async () => {
      accounts = await ethers.getSigners();

      const mockTokenFactory = await ethers.getContractFactory("MockToken");
      mockToken = await mockTokenFactory.deploy("MockToken", "MT");

      const wrappedTokenFactory = await ethers.getContractFactory(
        "WrappedToken"
      );
      wrappedToken = await wrappedTokenFactory.deploy(
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero
      );
    });

    it("should lock token", async () => {
      await (
        await mockToken.mint(
          accounts[0].address,
          ethers.utils.parseEther("1.0")
        )
      ).wait();

      await mockToken.approve(
        wrappedToken.address,
        ethers.utils.parseEther("0.4")
      );

      await wrappedToken.lockERC20(
        mockToken.address,
        accounts[0].address,
        accounts[0].address,
        ethers.utils.parseEther("0.4"),
        ethers.utils.toUtf8Bytes("test")
      );

      expect(await mockToken.balanceOf(accounts[0].address)).to.eq(
        ethers.utils.parseEther("0.6")
      );
      expect(await mockToken.balanceOf(wrappedToken.address)).to.eq(
        ethers.utils.parseEther("0.4")
      );

      expect(
        await wrappedToken.balanceOf(
          accounts[0].address,
          await wrappedToken.erc20TokenID(mockToken.address)
        )
      ).to.eq(ethers.utils.parseEther("0.4"));
    });

    it("should release token", async () => {
      await (
        await mockToken.mint(
          accounts[0].address,
          ethers.utils.parseEther("1.0")
        )
      ).wait();

      await mockToken.approve(
        wrappedToken.address,
        ethers.utils.parseEther("0.4")
      );

      await wrappedToken.lockERC20(
        mockToken.address,
        accounts[0].address,
        accounts[0].address,
        ethers.utils.parseEther("0.4"),
        ethers.utils.toUtf8Bytes("test")
      );

      await wrappedToken.safeTransferFrom(
        accounts[0].address,
        accounts[1].address,
        await wrappedToken.erc20TokenID(mockToken.address),
        ethers.utils.parseEther("0.2"),
        ethers.utils.toUtf8Bytes("test")
      );

      expect(await mockToken.balanceOf(accounts[1].address)).to.eq(0);

      await wrappedToken
        .connect(accounts[1])
        .releaseERC20(
          mockToken.address,
          accounts[1].address,
          ethers.utils.parseEther("0.2"),
          ethers.utils.toUtf8Bytes("test")
        );

      expect(await mockToken.balanceOf(accounts[1].address)).to.eq(
        ethers.utils.parseEther("0.2")
      );
    });

    it("should check KYC", async () => {
      await wrappedToken.setKYCToken(mockToken.address);

      await (
        await mockToken.mint(
          accounts[0].address,
          ethers.utils.parseEther("1.0")
        )
      ).wait();

      await mockToken.approve(
        wrappedToken.address,
        ethers.utils.parseEther("0.9")
      );

      await wrappedToken.lockERC20(
        mockToken.address,
        accounts[0].address,
        accounts[0].address,
        ethers.utils.parseEther("0.9"),
        ethers.utils.toUtf8Bytes("test")
      );

      expect(
        wrappedToken.safeTransferFrom(
          accounts[0].address,
          accounts[1].address,
          mockToken.address,
          ethers.utils.parseEther("0.5"),
          ethers.utils.toUtf8Bytes("test")
        )
      ).to.be.revertedWith("recipient doesn't have KYC token");

      await (
        await mockToken.mint(
          accounts[1].address,
          ethers.utils.parseEther("0.1")
        )
      ).wait();

      expect(
        wrappedToken.safeTransferFrom(
          accounts[0].address,
          accounts[1].address,
          mockToken.address,
          ethers.utils.parseEther("0.5"),
          ethers.utils.toUtf8Bytes("test")
        )
      ).not.to.be.reverted;

      expect(
        await wrappedToken.balanceOf(
          accounts[0].address,
          await wrappedToken.erc20TokenID(mockToken.address)
        )
      ).to.eq(ethers.utils.parseEther("0.4"));

      expect(
        await wrappedToken.balanceOf(
          accounts[1].address,
          await wrappedToken.erc20TokenID(mockToken.address)
        )
      ).to.eq(ethers.utils.parseEther("0.5"));
    });
  });

  describe("ERC721Transfer", () => {
    let wrappedToken: WrappedToken;
    let kycNFT: MockNFT;
    let mockNFT: MockNFT;
    let accounts: SignerWithAddress[];

    beforeEach(async () => {
      accounts = await ethers.getSigners();

      const MockNFTFactory = await ethers.getContractFactory("MockNFT");
      kycNFT = await MockNFTFactory.deploy("KYCNFT", "KT");
      mockNFT = await MockNFTFactory.deploy("MockToken", "MT");

      const wrappedTokenFactory = await ethers.getContractFactory(
        "WrappedToken"
      );
      wrappedToken = await wrappedTokenFactory.deploy(
        ethers.constants.AddressZero,
        ethers.constants.AddressZero,
        ethers.constants.AddressZero
      );
    });

    it("should lock token", async () => {
      await (await mockNFT.mint(accounts[0].address, 0)).wait();

      await mockNFT.approve(wrappedToken.address, 0);

      await wrappedToken.lockERC721(
        mockNFT.address,
        0,
        accounts[0].address,
        accounts[0].address,
        ethers.utils.toUtf8Bytes("test")
      );

      expect(
        await wrappedToken.balanceOf(
          accounts[0].address,
          await wrappedToken.erc721TokenID(mockNFT.address, 0)
        )
      ).to.be.eq(1);
    });

    it("should release token", async () => {
      await (await mockNFT.mint(accounts[0].address, 0)).wait();

      await mockNFT.approve(wrappedToken.address, 0);

      await wrappedToken.lockERC721(
        mockNFT.address,
        0,
        accounts[0].address,
        accounts[0].address,
        ethers.utils.toUtf8Bytes("test")
      );

      await wrappedToken.safeTransferFrom(
        accounts[0].address,
        accounts[1].address,
        await wrappedToken.erc721TokenID(mockNFT.address, 0),
        1,
        ethers.utils.toUtf8Bytes("test")
      );

      expect(await mockNFT.balanceOf(accounts[1].address)).to.eq(0);

      await wrappedToken
        .connect(accounts[1])
        .releaseERC721(
          mockNFT.address,
          0,
          accounts[1].address,
          ethers.utils.toUtf8Bytes("test")
        );

      expect(await mockNFT.balanceOf(accounts[1].address)).to.eq(1);
    });

    it("should check KYC", async () => {
      await wrappedToken.setKYCToken(kycNFT.address);

      await (await kycNFT.mint(accounts[0].address, 0)).wait();
      await (await mockNFT.mint(accounts[0].address, 0)).wait();

      await mockNFT.approve(wrappedToken.address, 0);

      await wrappedToken.lockERC721(
        mockNFT.address,
        0,
        accounts[0].address,
        accounts[0].address,
        ethers.utils.toUtf8Bytes("test")
      );

      expect(
        wrappedToken.safeTransferFrom(
          accounts[0].address,
          accounts[1].address,
          await wrappedToken.erc721TokenID(mockNFT.address, 0),
          1,
          ethers.utils.toUtf8Bytes("test")
        )
      ).to.be.revertedWith("recipient doesn't have KYC token");

      await (await kycNFT.mint(accounts[1].address, 1)).wait();

      expect(
        wrappedToken.safeTransferFrom(
          accounts[0].address,
          accounts[1].address,
          await wrappedToken.erc721TokenID(mockNFT.address, 0),
          1,
          ethers.utils.toUtf8Bytes("test")
        )
      ).not.to.be.reverted;

      expect(
        await wrappedToken.balanceOf(
          accounts[0].address,
          await wrappedToken.erc721TokenID(mockNFT.address, 0)
        )
      ).to.eq(0);

      expect(
        await wrappedToken.balanceOf(
          accounts[1].address,
          await wrappedToken.erc721TokenID(mockNFT.address, 0)
        )
      ).to.eq(1);
    });
  });
});
