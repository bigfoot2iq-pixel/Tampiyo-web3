// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "../src/Tampiyo.sol";
import "../src/TampiyoClaim.sol";

contract MaliciousToken is IERC20 {
    TampiyoClaim public claimContract;
    bool public reentered;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    function setClaimContract(TampiyoClaim _claim) external {
        claimContract = _claim;
    }

    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        if (!reentered && address(claimContract) != address(0)) {
            reentered = true;
            claimContract.claim(0);
        }
        _spendAllowance(from, msg.sender, amount);
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }

    function transfer(address to, uint256 amount) external override returns (bool) {
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        allowances[msg.sender][spender] = amount;
        return true;
    }

    function _spendAllowance(address owner, address spender, uint256 amount) internal {
        allowances[owner][spender] -= amount;
    }

    function mint(address to, uint256 amount) external {
        balances[to] += amount;
    }

    function balanceOf(address account) external view override returns (uint256) { return balances[account]; }
    function allowance(address owner, address spender) external view override returns (uint256) { return allowances[owner][spender]; }
    function totalSupply() external pure override returns (uint256) { return 0; }
    function name() external pure returns (string memory) { return ""; }
    function symbol() external pure returns (string memory) { return ""; }
    function decimals() external pure returns (uint8) { return 18; }
}

contract MockERC20 is IERC20 {
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    function mint(address to, uint256 amount) external { balances[to] += amount; }
    function transfer(address to, uint256 amount) external override returns (bool) {
        balances[msg.sender] -= amount;
        balances[to] += amount;
        return true;
    }
    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        allowances[from][msg.sender] -= amount;
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }
    function approve(address spender, uint256 amount) external override returns (bool) {
        allowances[msg.sender][spender] = amount;
        return true;
    }
    function balanceOf(address a) external view override returns (uint256) { return balances[a]; }
    function allowance(address a, address b) external view override returns (uint256) { return allowances[a][b]; }
    function totalSupply() external pure override returns (uint256) { return 0; }
    function name() external pure returns (string memory) { return "Mock"; }
    function symbol() external pure returns (string memory) { return "MCK"; }
    function decimals() external pure returns (uint8) { return 18; }
}

contract TampiyoClaimTest is Test {
    Tampiyo public tampiyo;
    TampiyoClaim public claim;
    MaliciousToken public maliciousToken;

    address public owner = address(0x1);
    address public user = address(0x2);
    address public feeRecipient = address(0x3);

    uint256 public constant INITIAL_SUPPLY = 1000000000;
    uint256 public constant POOL_AMOUNT = 10000 * 10 ** 18;

    TampiyoClaim.Category[3] public cats;

    function setUp() public {
        vm.prank(owner);
        tampiyo = new Tampiyo("Tampiyo", "TAMPIYO", INITIAL_SUPPLY, owner);

        cats[0] = TampiyoClaim.Category(1 * 10 ** 18, 3600, 0, true);
        cats[1] = TampiyoClaim.Category(2 * 10 ** 18, 7200, 0, true);
        cats[2] = TampiyoClaim.Category(3 * 10 ** 18, 10800, 0, true);

        vm.prank(owner);
        claim = new TampiyoClaim(address(tampiyo), address(0), feeRecipient, owner, cats);

        vm.prank(owner);
        tampiyo.transfer(address(claim), POOL_AMOUNT);
    }

    function testClaimHappyPath() public {
        vm.prank(user);
        claim.claim(0);

        assertEq(tampiyo.balanceOf(user), 1 * 10 ** 18);
    }

    function testCooldownBlocksSecondClaim() public {
        vm.prank(user);
        claim.claim(0);

        uint64 expectedNext = uint64(block.timestamp) + 3600;
        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(TampiyoClaim.CooldownActive.selector, expectedNext));
        claim.claim(0);
    }

    function testDifferentCategoriesIndependent() public {
        vm.prank(user);
        claim.claim(0);

        vm.prank(user);
        claim.claim(1);

        assertEq(tampiyo.balanceOf(user), 3 * 10 ** 18);
    }

    function testDisabledCategoryReverts() public {
        vm.prank(owner);
        claim.setCategory(0, 1 * 10 ** 18, 3600, 0, false);

        vm.prank(user);
        vm.expectRevert(TampiyoClaim.CategoryDisabled.selector);
        claim.claim(0);
    }

    function testInvalidIdReverts() public {
        vm.prank(user);
        vm.expectRevert(TampiyoClaim.InvalidCategory.selector);
        claim.claim(3);
    }

    function testInsufficientPoolReverts() public {
        vm.prank(owner);
        claim.setCategory(0, uint128(POOL_AMOUNT + 1), 0, 0, true);

        vm.prank(user);
        vm.expectRevert(TampiyoClaim.InsufficientPool.selector);
        claim.claim(0);
    }

    function testFeeZeroSkipsTransferFrom() public {
        vm.prank(owner);
        claim.setCategory(0, 1 * 10 ** 18, 0, 0, true);

        vm.prank(user);
        claim.claim(0);
    }

    function testOwnerCanUpdateCategory() public {
        vm.prank(owner);
        claim.setCategory(0, 2 * 10 ** 18, 1800, 100, true);

        TampiyoClaim.Category memory c = claim.getCategory(0);
        assertEq(c.amount, 2 * 10 ** 18);
        assertEq(c.cooldown, 1800);
        assertEq(c.fee, 100);
        assertTrue(c.enabled);
    }

    function testOwnerCanChangeFeeToken() public {
        address newToken = address(0x4);
        vm.prank(owner);
        claim.setFeeToken(newToken);
        assertEq(address(claim.feeToken()), newToken);
    }

    function testOwnerCanChangeFeeRecipient() public {
        address newRecipient = address(0x5);
        vm.prank(owner);
        claim.setFeeRecipient(newRecipient);
        assertEq(claim.feeRecipient(), newRecipient);
    }

    function testNonOwnerSettersRevert() public {
        vm.prank(user);
        vm.expectRevert();
        claim.setCategory(0, 1, 1, 1, true);

        vm.prank(user);
        vm.expectRevert();
        claim.setFeeToken(address(0x4));

        vm.prank(user);
        vm.expectRevert();
        claim.setFeeRecipient(address(0x5));
    }

    function testConstructorRevertsZeroTampiyo() public {
        TampiyoClaim.Category[3] memory localCats;
        for (uint8 i; i < 3; ++i) localCats[i] = TampiyoClaim.Category(1, 0, 0, false);
        vm.expectRevert(TampiyoClaim.ZeroAddress.selector);
        new TampiyoClaim(address(0), address(0), feeRecipient, owner, localCats);
    }

    function testConstructorRevertsZeroFeeRecipient() public {
        TampiyoClaim.Category[3] memory localCats;
        for (uint8 i; i < 3; ++i) localCats[i] = TampiyoClaim.Category(1, 0, 0, false);
        vm.expectRevert(TampiyoClaim.ZeroAddress.selector);
        new TampiyoClaim(address(tampiyo), address(0), address(0), owner, localCats);
    }

    function testSetFeeTokenRevertsZero() public {
        vm.prank(owner);
        vm.expectRevert(TampiyoClaim.ZeroAddress.selector);
        claim.setFeeToken(address(0));
    }

    function testSetFeeRecipientRevertsZero() public {
        vm.prank(owner);
        vm.expectRevert(TampiyoClaim.ZeroAddress.selector);
        claim.setFeeRecipient(address(0));
    }

    function testWithdrawPoolRevertsZero() public {
        vm.prank(owner);
        vm.expectRevert(TampiyoClaim.ZeroAddress.selector);
        claim.withdrawPool(address(0), 1);
    }

    function testReentrancyGuard() public {
        maliciousToken = new MaliciousToken();
        maliciousToken.mint(user, 1000 * 10 ** 18);
        maliciousToken.setClaimContract(claim);

        vm.startPrank(owner);
        claim.setFeeToken(address(maliciousToken));
        claim.setCategory(0, 1 * 10 ** 18, 0, 100, true);
        vm.stopPrank();

        vm.prank(user);
        maliciousToken.approve(address(claim), 1000 * 10 ** 18);
        vm.prank(user);
        vm.expectRevert();
        claim.claim(0);
    }

    function testCanClaimView() public {
        (bool can, uint64 readyAt) = claim.canClaim(user, 0);
        assertTrue(can);
        assertEq(readyAt, 0);

        vm.prank(user);
        claim.claim(0);

        (can, readyAt) = claim.canClaim(user, 0);
        assertFalse(can);
        assertGt(readyAt, 0);
    }

    function testNextClaimAt() public {
        assertEq(claim.nextClaimAt(user, 0), 0);

        vm.prank(user);
        claim.claim(0);

        uint64 expected = uint64(block.timestamp) + 3600;
        assertEq(claim.nextClaimAt(user, 0), expected);
    }

    function testPoolBalance() public {
        assertEq(claim.poolBalance(), POOL_AMOUNT);
    }

    function testPausedBlocksClaim() public {
        vm.prank(owner);
        claim.setPaused(true);

        vm.prank(user);
        vm.expectRevert(TampiyoClaim.ContractPaused.selector);
        claim.claim(0);
    }

    function testWithdrawPool() public {
        uint256 withdrawAmount = 100 * 10 ** 18;
        address withdrawTo = address(0x6);
        uint256 initialPool = claim.poolBalance();

        vm.startPrank(owner);
        vm.expectEmit(true, false, false, true);
        emit TampiyoClaim.PoolWithdrawn(withdrawTo, withdrawAmount);
        claim.withdrawPool(withdrawTo, withdrawAmount);
        vm.stopPrank();

        assertEq(claim.poolBalance(), initialPool - withdrawAmount);
        assertEq(tampiyo.balanceOf(withdrawTo), withdrawAmount);

        vm.prank(user);
        vm.expectRevert();
        claim.withdrawPool(withdrawTo, 1);
    }

    function testPositiveFeeClaim() public {
        MockERC20 feeTokenMock = new MockERC20();
        uint128 feeAmount = 10 * 10 ** 18;
        uint128 claimAmount = 1 * 10 ** 18;

        feeTokenMock.mint(user, feeAmount * 2);
        vm.prank(user);
        feeTokenMock.approve(address(claim), feeAmount * 2);

        vm.startPrank(owner);
        claim.setFeeToken(address(feeTokenMock));
        claim.setCategory(0, claimAmount, 0, feeAmount, true);
        vm.stopPrank();

        uint256 userTampiyoBefore = tampiyo.balanceOf(user);
        uint256 feeRecipientBefore = feeTokenMock.balanceOf(feeRecipient);
        uint256 userFeeBefore = feeTokenMock.balanceOf(user);

        vm.prank(user);
        claim.claim(0);

        assertEq(tampiyo.balanceOf(user), userTampiyoBefore + claimAmount);
        assertEq(feeTokenMock.balanceOf(feeRecipient), feeRecipientBefore + feeAmount);
        assertEq(feeTokenMock.balanceOf(user), userFeeBefore - feeAmount);
    }

    function testClaimedEventEmitted() public {
        vm.prank(owner);
        claim.setCategory(0, 1 * 10 ** 18, 0, 0, true);

        vm.expectEmit(true, true, false, true);
        emit TampiyoClaim.Claimed(user, 0, 1 * 10 ** 18, 0);

        vm.prank(user);
        claim.claim(0);
    }
}
