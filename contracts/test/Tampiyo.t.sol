// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "../src/Tampiyo.sol";

contract TampiyoTest is Test {
    Tampiyo public tampiyo;
    address public owner = address(0x1);
    address public user = address(0x2);

    uint256 public constant INITIAL_SUPPLY = 1000000000;

    function setUp() public {
        vm.prank(owner);
        tampiyo = new Tampiyo("Tampiyo", "TAMPIYO", INITIAL_SUPPLY, owner);
    }

    function testConstructorMintsSupplyToOwner() public {
        uint256 expected = INITIAL_SUPPLY * 10 ** 18;
        assertEq(tampiyo.balanceOf(owner), expected);
        assertEq(tampiyo.totalSupply(), expected);
    }

    function testPauseBlocksTransfers() public {
        vm.prank(owner);
        tampiyo.pause();

        vm.prank(owner);
        vm.expectRevert();
        tampiyo.transfer(user, 100 * 10 ** 18);
    }

    function testUnpauseResumesTransfers() public {
        vm.prank(owner);
        tampiyo.pause();
        vm.prank(owner);
        tampiyo.unpause();

        vm.prank(owner);
        tampiyo.transfer(user, 100 * 10 ** 18);
        assertEq(tampiyo.balanceOf(user), 100 * 10 ** 18);
    }

    function testNonOwnerCannotPause() public {
        vm.prank(user);
        vm.expectRevert();
        tampiyo.pause();
    }

    function testBurnReducesSupply() public {
        uint256 burnAmount = 100 * 10 ** 18;
        uint256 initialBalance = tampiyo.balanceOf(owner);
        uint256 initialSupply = tampiyo.totalSupply();

        vm.prank(owner);
        tampiyo.burn(burnAmount);

        assertEq(tampiyo.balanceOf(owner), initialBalance - burnAmount);
        assertEq(tampiyo.totalSupply(), initialSupply - burnAmount);
    }

    function testPublicBurn() public {
        uint256 burnAmount = 50 * 10 ** 18;
        vm.prank(owner);
        tampiyo.transfer(user, burnAmount);

        vm.prank(user);
        tampiyo.burn(burnAmount);

        assertEq(tampiyo.balanceOf(user), 0);
    }
}
