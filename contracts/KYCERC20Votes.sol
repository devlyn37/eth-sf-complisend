pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "./IBalanceOf.sol";
import "./KYCVerifier.sol";

contract KYCERC20Votes is ERC20, ERC20Votes, KYCVerifier {
    IERC20 public _oldERC20;

    constructor(IERC20Metadata oldErc20, IBalanceOf kycToken)
        KYCVerifier(kycToken)
        ERC20(oldErc20.name(), oldErc20.symbol())
        ERC20Permit(oldErc20.name())
    {
        _oldERC20 = oldErc20;
        _kycToken = kycToken;
    }

    function lock(uint256 amount) public {
        _oldERC20.transferFrom(msg.sender, address(this), amount);

        _mint(msg.sender, amount);
    }

    function release(uint256 amount) public {
        _burn(msg.sender, amount);

        _oldERC20.transferFrom(address(this), msg.sender, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super.kycVerify(from, to);

        super._beforeTokenTransfer(from, to, amount);
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }
}
