const airContract = artifacts.require("airContract");

module.exports = function (deployer) {
  deployer.deploy(airContract);
};
