const MedicalImageTransfer = artifacts.require("./MedicalImageTransfer.sol");

contract("MedicalImageTransfer", accounts => {
  var medicalImageTransferInstance;
  it("test add new user", () => {
    return MedicalImageTransfer.deployed().then(instance => {
      medicalImageTransferInstance = instance;
      const name = "Bao";
      const role = 0;
      return medicalImageTransferInstance.addNewUser(name, role, { from: accounts[0] });
    }).then(() => {
      return medicalImageTransferInstance.userSchema(accounts[0]);
    })
      .then((user) => {
        assert.equal(user[1], accounts[0], "correct user on-chain address");
        assert.equal(user[2], "Bao", "correct user name");
        assert.equal(user[3], 0, "correct user role");
      });
  })
});
