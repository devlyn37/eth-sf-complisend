pragma solidity 0.8.17;

import "./IBalanceOf.sol";

contract KYCVerifier {
    IBalanceOf _kycToken;

    constructor(IBalanceOf kycToken) {
        _kycToken = kycToken;
    }

    function kycVerify(address from, address to) internal view {
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

    function _setKYCToken(IBalanceOf kycToken) internal {
        _kycToken = kycToken;
    }
}
