const MedicalImageTransfer = artifacts.require("MedicalImageTransfer");

module.exports = function (deployer) {
  deployer.deploy(MedicalImageTransfer);
};
