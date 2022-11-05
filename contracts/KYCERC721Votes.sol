pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "./IBalanceOf.sol";
import "./KYCVerifier.sol";

contract KYCERC721Votes is ERC721, ERC721Votes, KYCVerifier {
    IERC721Metadata public _oldERC721;

    constructor(IERC721Metadata oldERC721, IBalanceOf kycToken)
        KYCVerifier(kycToken)
        ERC721(oldERC721.name(), oldERC721.symbol())
        EIP712(oldERC721.name(), "1")
    {
        _oldERC721 = oldERC721;
        _kycToken = kycToken;
    }

    function lock(uint256 tokenID) public {
        _oldERC721.safeTransferFrom(msg.sender, address(this), tokenID);

        _safeMint(msg.sender, tokenID);
    }

    function release(uint256 tokenID) public {
        _burn(tokenID);

        _oldERC721.safeTransferFrom(address(this), msg.sender, tokenID);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenID
    ) internal override {
        super.kycVerify(from, to);
        super._beforeTokenTransfer(from, to, tokenID);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId
    ) internal override(ERC721, ERC721Votes) {
        super._afterTokenTransfer(from, to, firstTokenId);
    }
}
