pragma solidity 0.8.17;

interface IBalanceOf {
    function balanceOf(address _owner) external view returns (uint256);
}
