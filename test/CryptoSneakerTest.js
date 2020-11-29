const truffleAssert = require("truffle-assertions");
const BN = require('bn.js');

const CryptoSneaker = artifacts.require("CryptoSneaker");

contract("CryptoSneaker", (accounts) => {
  const admin = accounts[0];
  const amount = web3.utils.toWei("1", "ether");

  const manufacturerCandidateArgs = {
    from: accounts[1],
    gas: 500000,
    value: amount,
  };

  const sneakerModelId = 1337;
  const sneakerName = "Travis Scott - Yeezy gold";
  const sneakerSize = 46;

  let deployed;

  beforeEach(async () => {
    deployed = await CryptoSneaker.new();
  });

  it("should create a request to acquire manufacturer role by non manufacturers", async () => {
    const result = await deployed.requestManufacturerRole(manufacturerCandidateArgs);
    const {from: manufacturer} = manufacturerCandidateArgs;
    truffleAssert.eventEmitted(result, "ManufacturerRequest", {manufacturer});

    const request = await deployed.requestedManufacturers.call(
      manufacturerCandidateArgs.from
    );
    assert.equal(request, amount);
  });

  it("should throw if manufacturer requests manufacturer role again", async () => {
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);

    truffleAssert.reverts(
      deployed.requestManufacturerRole(manufacturerCandidateArgs),
      "Already pending request"
    );
  });

  it("should throw if manufacturer requests without sending positive value with transaction", async () => {
    truffleAssert.reverts(
      deployed.requestManufacturerRole({
        ...manufacturerCandidateArgs,
        value: 0,
      }),
      "Request amount must be greater than 0"
    );
  });

  it("should allow admin to accept manufacturer request", async () => {
    const candidate = manufacturerCandidateArgs.from;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);

    const result = await deployed.approveManufacturer(candidate, amount, {
      from: admin,
    });
    const role = await deployed.MANUFACTURER_ROLE();
    truffleAssert.eventEmitted(result, "RoleGranted", {
      account: candidate,
      role,
    });
    assert(await deployed.hasRole(role, candidate));
    truffleAssert.eventEmitted(result, "ManufacturerApproved", { manufacturer: candidate });
    const [approved, roleGranted] = result.logs;
    
    expect(approved.args.amount.cmp(new BN(amount))).equal(0);
  });

  it("should return excess ether to the requester if admin didn't specify all amount", async () => {
    const candidate = manufacturerCandidateArgs.from;
    const amount = web3.utils.toWei("0.5", "ether");
    const halfAmount = web3.utils.toWei("0.25", "ether");
    await deployed.requestManufacturerRole({...manufacturerCandidateArgs, value: amount});
    
    const balanceBefore = await web3.eth.getBalance(candidate);
    await deployed.approveManufacturer(candidate, halfAmount, {
      from: admin,
    });
    const balanceAfter = await web3.eth.getBalance(candidate);
    
    const a = new BN(balanceBefore);
    const b = new BN(balanceAfter);
    
    assert(b.sub(a).eq(new BN(halfAmount)));
  });

  it("should forbid other users than admin to accept manufacturer", async () => {
    const candidate = manufacturerCandidateArgs.from;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);

    const unknownAccount = accounts[3];
    truffleAssert.reverts(
      deployed.approveManufacturer(candidate, amount, { from: unknownAccount }),
      "Requires admin role"
    );
  });

  it("should allow manufacturer to mint a sneaker token", async () => {
    const { from } = manufacturerCandidateArgs;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);
    await deployed.approveManufacturer(from, 0);

    const result = await deployed.mint(
      sneakerModelId,
      sneakerName,
      sneakerSize,
      { from }
    );
    truffleAssert.eventEmitted(result, "Transfer", { to: from });

    const {
      logs: [
        {
          args: { tokenId },
        },
      ],
    } = result;
    expect(tokenId.toNumber()).to.be.a("number");

    const sneaker = await deployed.sneakers(tokenId.toNumber());
    const { name, size, manufacturer, modelID } = sneaker;
    expect(manufacturer).to.equal(from);
    expect(modelID.toNumber()).to.equal(sneakerModelId);
    expect(name).to.equal(sneakerName);
    expect(size.toNumber()).to.equal(sneakerSize);
  });

  it("should forbid manufacturer from creating a sneaker token with already existing modelID", async () => {
    const { from } = manufacturerCandidateArgs;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);
    await deployed.approveManufacturer(from, 0);

    await deployed.mint(sneakerModelId, sneakerName, sneakerSize, { from });
    truffleAssert.reverts(
      deployed.mint(sneakerModelId, sneakerName, sneakerSize, { from }),
      "Given manufacturer already has created a sneaker with given model id"
    );
  });

  it("should forbid manufacturer from creating a sneaker token with too long name", async () => {
    const { from } = manufacturerCandidateArgs;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);
    await deployed.approveManufacturer(from, 0);

    truffleAssert.reverts(
      deployed.mint(
        sneakerModelId,
        "this is way to long name to be representing sneaker, storage is expensive in blockchain world",
        sneakerSize,
        { from }
      ),
      "Sneaker name is too long, expected up to 50 characters"
    );
  });

  it("should transfer token ownership to another account", async () => {
    const { from } = manufacturerCandidateArgs;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);
    await deployed.approveManufacturer(from, 0);

    const {
      logs: [
        {
          args: { tokenId },
        },
      ],
    } = await deployed.mint(sneakerModelId, sneakerName, sneakerSize, { from });

    const [token] = await deployed.getSneakersByOwner(from);

    const otherAccount = accounts[3];

    await deployed.transferFrom(from, otherAccount, token.toNumber(), { from });

    const fromTokens = await deployed.getSneakersByOwner(from);
    const [otherToken] = await deployed.getSneakersByOwner(otherAccount);

    expect(fromTokens).to.be.an("array").that.is.empty;
    expect(otherToken.toNumber()).to.equal(token.toNumber());
  });

  it("should forbid transferring token by a person that does not own it", async () => {
    const { from } = manufacturerCandidateArgs;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);
    await deployed.approveManufacturer(from, 0);

    const {
      logs: [
        {
          args: { tokenId },
        },
      ],
    } = await deployed.mint(sneakerModelId, sneakerName, sneakerSize, { from });

    const otherAccount = accounts[3];

    truffleAssert.reverts(
      deployed.transferFrom(otherAccount, otherAccount, tokenId.toNumber(), { otherAccount }),
      "ERC721: transfer caller is not owner nor approved"
    );
  });
});
