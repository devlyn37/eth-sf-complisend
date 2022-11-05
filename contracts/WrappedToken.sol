pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IBalanceOf.sol";

contract WrappedToken is ERC1155, ERC1155URIStorage, Pausable, Ownable {
    IBalanceOf _kycToken;

    event LockedERC20(
        address tokenAddress,
        uint256 erc1155TokenID,
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes data
    );

    event ReleasedERC20(
        address tokenAddress,
        uint256 erc1155TokenID,
        address operator,
        address to,
        uint256 amount,
        bytes data
    );

    event LockedERC721(
        address tokenAddress,
        uint256 tokenID,
        uint256 erc1155TokenID,
        address operator,
        address from,
        address to,
        bytes data
    );

    event ReleasedERC721(
        address tokenAddress,
        uint256 tokenID,
        uint256 erc1155TokenId,
        address from,
        address to,
        bytes data
    );

    constructor(address kycToken) ERC1155("") {
        _kycToken = IBalanceOf(kycToken);
    }

    // view functions
    function uri(uint256 tokenID)
        public
        view
        override(ERC1155, ERC1155URIStorage)
        returns (string memory)
    {
        return super.uri(tokenID);
    }

    function erc20TokenID(address tokenAddress) public view returns (uint256) {
        return uint256(uint160(tokenAddress));
    }

    function erc721TokenID(address tokenAddress, uint256 tokenID)
        public
        view
        returns (uint256)
    {
        return uint256(keccak256(abi.encodePacked(tokenAddress, tokenID)));
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setKYCToken(address kycToken) external onlyOwner {
        _kycToken = IBalanceOf(kycToken);
    }

    function lockERC20(
        address tokenAddress,
        address from,
        address to,
        uint256 amount,
        bytes memory data
    ) external whenNotPaused {
        uint256 erc1155TokenID = erc20TokenID(tokenAddress);

        _mint(to, erc1155TokenID, amount, data);

        require(
            IERC20(tokenAddress).transferFrom(from, address(this), amount),
            "can't transfer"
        );

        emit LockedERC20(
            tokenAddress,
            erc1155TokenID,
            msg.sender,
            from,
            to,
            amount,
            data
        );
    }

    function releaseERC20(
        address tokenAddress,
        address to,
        uint256 amount,
        bytes memory data
    ) external whenNotPaused {
        uint256 erc1155TokenID = erc20TokenID(tokenAddress);

        _burn(msg.sender, erc1155TokenID, amount);

        require(IERC20(tokenAddress).transfer(to, amount), "can't transfer");

        emit ReleasedERC20(
            tokenAddress,
            erc1155TokenID,
            msg.sender,
            to,
            amount,
            data
        );
    }

    function lockERC721(
        address tokenAddress,
        uint256 tokenID,
        address from,
        address to,
        bytes memory data
    ) external whenNotPaused {
        uint256 erc1155TokenID = erc721TokenID(tokenAddress, tokenID);

        _mint(to, erc1155TokenID, 1, data);

        IERC721(tokenAddress).transferFrom(from, address(this), tokenID);

        emit LockedERC721(
            tokenAddress,
            tokenID,
            erc1155TokenID,
            msg.sender,
            from,
            to,
            data
        );
    }

    function releaseERC721(
        address tokenAddress,
        uint256 tokenID,
        address to,
        bytes memory data
    ) external whenNotPaused {
        uint256 erc1155TokenID = erc721TokenID(tokenAddress, tokenID);

        _burn(msg.sender, erc1155TokenID, 1);

        IERC721(tokenAddress).transferFrom(address(this), to, tokenID);

        emit ReleasedERC721(
            tokenAddress,
            tokenID,
            erc1155TokenID,
            msg.sender,
            to,
            data
        );
    }

    function _beforeTokenTransfer(
        address _operator,
        address from,
        address to,
        uint256[] memory _ids,
        uint256[] memory _amounts,
        bytes memory _data
    ) internal override {
        // Verification
        require(
            // ignore in case of minting or KYCToken is not set
            from == address(0x0) ||
                address(_kycToken) == address(0x0) ||
                _kycToken.balanceOf(from) > 0,
            "sender doesn't have KYC token"
        );

        require(
            // ignire in case of burning or KYCToken is not set
            to == address(0x0) ||
                address(_kycToken) == address(0x0) ||
                _kycToken.balanceOf(to) > 0,
            "recipient doesn't have KYC token"
        );
    }
}
