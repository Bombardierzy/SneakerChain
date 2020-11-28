const truffleAssert = require("truffle-assertions");

const CryptoSneaker = artifacts.require("CryptoSneaker");

contract("CryptoSneaker", (accounts) => {
  const admin = accounts[0];
  const amount = 1000000;

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
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);

    const request = await deployed.requestedManufacturers.call(manufacturerCandidateArgs.from);
    assert.equal(request.toNumber(), amount);
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
      deployed.requestManufacturerRole({...manufacturerCandidateArgs, value: 0}),
      "Request amount must be greater than 0"
    );
  });

  it("should allow admin to accept manufacturer request", async () => {
    const candidate = manufacturerCandidateArgs.from;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);

    const result = await deployed.approveManufacturer(candidate, amount, {from: admin});
    const role = await deployed.MANUFACTURER_ROLE();
    truffleAssert.eventEmitted(result, "RoleGranted", {
      account: candidate,
      role,
    });
    assert(await deployed.hasRole(role, candidate));
  });
  
  // TODO: check if valid amount of ether is returned to requester if admin did not specified all of it
  
  it("should forbid other users than admin to accept manufacturer", async () => {
    const candidate = manufacturerCandidateArgs.from;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);
    
    const unknownAccount = accounts[3];
    truffleAssert.reverts(
      deployed.approveManufacturer(candidate, amount, {from: unknownAccount}),
      "Requires admin role"
    );
  });
  
  it("should allow manufacturer to mint a sneaker token", async () => {
    const {from} = manufacturerCandidateArgs;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);
    await deployed.approveManufacturer(from, 0);
    
    const result = await deployed.mint(sneakerModelId, sneakerName, sneakerSize, {from});
    truffleAssert.eventEmitted(result, "Transfer", {to: from});

    const {logs: [{args: {tokenId}}]} = result;
    expect(tokenId.toNumber()).to.be.a("number");
    
    const sneaker =  await deployed.sneakers(tokenId.toNumber());
    const {name, size, manufacturer, modelID} = sneaker;
    expect(manufacturer).to.equal(from);
    expect(modelID.toNumber()).to.equal(sneakerModelId);
    expect(name).to.equal(sneakerName);
    expect(size.toNumber()).to.equal(sneakerSize);
  });
  
  it("should forbid manufacturer from creating a sneaker token with repeating modelID", async () => {
    const {from} = manufacturerCandidateArgs;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);
    await deployed.approveManufacturer(from, 0);
    
    await deployed.mint(sneakerModelId, sneakerName, sneakerSize, {from});
    truffleAssert.reverts(
      deployed.mint(sneakerModelId, sneakerName, sneakerSize, {from}),
      "Given manufacturer already has created a sneaker with given model id"
    );
  });
  
  it("should forbid manufacturer from creating a sneaker token with too long name", async () => {
    const {from} = manufacturerCandidateArgs;
    await deployed.requestManufacturerRole(manufacturerCandidateArgs);
    await deployed.approveManufacturer(from, 0);
    
    truffleAssert.reverts(
      deployed.mint(sneakerModelId,  "this is way to long name to be representing sneaker, storage is expensive in blockchain world", sneakerSize, {from}),
      "Sneaker name is too long, expected up to 50 characters"
    );
  });
});
