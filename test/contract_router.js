var ContractRouter = require("../lib/contract_router"),
    Contract = require("../lib/contract"),
    settings = require("./test_settings.json");



describe("Contract router", function(){
  var contract,
      contractRouter;

  before(function(){
    contract = new Contract({
      address: settings.coinContract.address,
      abi: settings.coinContract.abi
    });

    contractRouter = new ContractRouter(contract);
  });

  it("creates routes", function(){
    contractRouter.routes.stack.length.should.be.equal(3);
    
    var paths = contractRouter.routes.stack.map(function(s){ return s.route.path; });

    paths.should.containEql("/balanceOf");
    paths.should.containEql("/issue");
    paths.should.containEql("/transferTo");
  });
});
