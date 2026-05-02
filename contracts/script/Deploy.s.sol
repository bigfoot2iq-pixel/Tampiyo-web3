// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Script.sol";
import "../src/Tampiyo.sol";
import "../src/TampiyoClaim.sol";

contract Deploy is Script {
    uint256 internal constant INITIAL_SUPPLY = 1_000_000_000;

    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address owner = vm.envAddress("OWNER");
        require(vm.addr(deployerKey) == owner, "deployer key must match OWNER for pool funding");
        address feeToken = vm.envAddress("FEE_TOKEN");
        address feeRecipient = vm.envAddress("FEE_RECIPIENT");
        uint256 poolAmount = vm.envUint("POOL_AMOUNT");

        TampiyoClaim.Category[3] memory cats;
        for (uint8 i; i < 3; ++i) {
            cats[i] = TampiyoClaim.Category({
                amount: uint128(vm.envUint(string(abi.encodePacked("CAT", vm.toString(i), "_AMOUNT")))),
                cooldown: uint64(vm.envUint(string(abi.encodePacked("CAT", vm.toString(i), "_COOLDOWN")))),
                fee: uint128(vm.envUint(string(abi.encodePacked("CAT", vm.toString(i), "_FEE")))),
                enabled: vm.envBool(string(abi.encodePacked("CAT", vm.toString(i), "_ENABLED")))
            });
        }

        vm.startBroadcast(deployerKey);

        Tampiyo tampiyo = new Tampiyo("Tampiyo", "TAMPIYO", INITIAL_SUPPLY, owner);
        console.log("Tampiyo deployed to:", address(tampiyo));

        TampiyoClaim claim = new TampiyoClaim(address(tampiyo), feeToken, feeRecipient, owner, cats);
        console.log("TampiyoClaim deployed to:", address(claim));

        if (poolAmount > 0) {
            tampiyo.transfer(address(claim), poolAmount * 10 ** tampiyo.decimals());
            console.log("Funded claim contract with pool amount");
        }

        vm.stopBroadcast();
    }
}
