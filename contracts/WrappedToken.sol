pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IBalanceOf.sol";
import "./IPUSHCommInterface.sol";

contract WrappedToken is ERC1155, ERC1155URIStorage, Pausable, Ownable {
    using Strings for uint256;
    using Strings for address;

    IBalanceOf public _kycToken;
    IPUSHCommInterface public _push;
    address public _channelAddress;

    event LockedERC20(
        address tokenAddress,
        uint256 erc1155TokenID,
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

    constructor(
        address kycToken,
        address pushComm,
        address channelAddress
    ) ERC1155("") {
        _kycToken = IBalanceOf(kycToken);
        _push = IPUSHCommInterface(pushComm);
        _channelAddress = channelAddress;
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

    function setPushProtocol(address pushComm, address channelAddress)
        external
        onlyOwner
    {
        _push = IPUSHCommInterface(pushComm);
        _channelAddress = channelAddress;
    }

    function lockERC20(
        address tokenAddress,
        address from,
        address to,
        uint256 amount,
        bytes memory data
    ) external whenNotPaused {
        uint256 erc1155TokenID = erc20TokenID(tokenAddress);

        require(
            IERC20(tokenAddress).transferFrom(from, address(this), amount),
            "can't transfer"
        );

        _mint(to, erc1155TokenID, amount, data);

        _notifyERC20Lock(
            tokenAddress,
            erc1155TokenID,
            msg.sender,
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

        _notifyERC20Release(
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

        IERC721(tokenAddress).transferFrom(from, address(this), tokenID);

        _mint(to, erc1155TokenID, 1, data);

        _notifyERC721Lock(
            tokenAddress,
            tokenID,
            erc1155TokenID,
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

        _notifyERC721Release(
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

    function _notifyERC20Lock(
        address tokenAddress,
        uint256 token1155ID,
        address from,
        address to,
        uint256 amount,
        bytes memory data
    ) private {
        emit LockedERC20(tokenAddress, token1155ID, from, to, amount, data);

        if (address(_push) == address(0x0) || _channelAddress == address(0x0)) {
            return;
        }

        _push.sendNotification(
            _channelAddress,
            from,
            bytes(
                string(
                    abi.encodePacked(
                        "0+3+ERC20 Token Locked+",
                        '{"token":"',
                        tokenAddress.toHexString(),
                        '",',
                        '"wrapped_token_id":"',
                        token1155ID.toHexString(),
                        '",',
                        '"from":"',
                        from.toHexString(),
                        '",',
                        '"to":"',
                        to.toHexString(),
                        '",',
                        '"amount":"',
                        amount.toHexString(),
                        '",',
                        '"data":"',
                        string(data),
                        '"}'
                    )
                )
            )
        );
    }

    function _notifyERC20Release(
        address tokenAddress,
        uint256 token1155ID,
        address from,
        address to,
        uint256 amount,
        bytes memory data
    ) private {
        emit ReleasedERC20(tokenAddress, token1155ID, from, to, amount, data);

        if (address(_push) == address(0x0) || _channelAddress == address(0x0)) {
            return;
        }

        _push.sendNotification(
            _channelAddress,
            from,
            bytes(
                string(
                    abi.encodePacked(
                        "0+3+ERC20 Token Released+",
                        '{"token":"',
                        tokenAddress.toHexString(),
                        '",',
                        '"wrapped_token_id":"',
                        token1155ID.toHexString(),
                        '",',
                        '"from":"',
                        from.toHexString(),
                        '",',
                        '"to":"',
                        to.toHexString(),
                        '",',
                        '"amount":"',
                        amount.toHexString(),
                        '",',
                        '"data":"',
                        string(data),
                        '"}'
                    )
                )
            )
        );
    }

    function _notifyERC721Lock(
        address tokenAddress,
        uint256 tokenID,
        uint256 token1155ID,
        address from,
        address to,
        bytes memory data
    ) private {
        emit LockedERC721(tokenAddress, tokenID, token1155ID, from, to, data);

        if (address(_push) == address(0x0) || _channelAddress == address(0x0)) {
            return;
        }

        _push.sendNotification(
            _channelAddress,
            from,
            bytes(
                string(
                    abi.encodePacked(
                        "0+3+ERC721 NFT Locked+",
                        '{"token":"',
                        tokenAddress.toHexString(),
                        '",',
                        '"id":"',
                        tokenID.toHexString(),
                        '",',
                        '"wrapped_token_id":"',
                        token1155ID.toHexString(),
                        '",',
                        '"from":"',
                        from.toHexString(),
                        '",',
                        '"to":"',
                        to.toHexString(),
                        '",',
                        '"data":"',
                        string(data),
                        '"}'
                    )
                )
            )
        );
    }

    function _notifyERC721Release(
        address tokenAddress,
        uint256 tokenID,
        uint256 token1155ID,
        address from,
        address to,
        bytes memory data
    ) private {
        emit ReleasedERC721(tokenAddress, tokenID, token1155ID, from, to, data);

        if (address(_push) == address(0x0) || _channelAddress == address(0x0)) {
            return;
        }

        _push.sendNotification(
            _channelAddress,
            from,
            bytes(
                string(
                    abi.encodePacked(
                        "0+3+ERC721 NFT Released+",
                        '{"token":"',
                        tokenAddress.toHexString(),
                        '",',
                        '"id":"',
                        tokenID.toHexString(),
                        '",',
                        '"wrapped_token_id":"',
                        token1155ID.toHexString(),
                        '",',
                        '"from":"',
                        from.toHexString(),
                        '",',
                        '"to":"',
                        to.toHexString(),
                        '",',
                        '"data":"',
                        string(data),
                        '"}'
                    )
                )
            )
        );
    }
}
