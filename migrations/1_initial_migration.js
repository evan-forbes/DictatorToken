const Migrations = artifacts.require("Migrations");
const DictatorDollar = artifacts.require("DictatorDollar");

module.exports = async function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(DictatorDollar, "8000000000000000000000000");
};
