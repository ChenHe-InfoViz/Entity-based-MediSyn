var assert = require('assert');
var should = require('should');
require('../index.js');

describe("Basic loading features", function() {
  it("should fail to load an empty file", function() {
    should(function() {
      require("./noway.tsv");
    }).throw;
  });

  it("should to load an empty file as an empty array", function() {
    require("./empty.tsv").should.eql([]);
  });

  it("should to load a simple file into an array", function() {
    require("./simple.tsv").should.eql([
      ["ZONE DES TERNES", "48.8781097", "2.2974723"],
      ["ZONE DE BUC", "48.7736", "2.1275"],
      ["BOIS COLOMBES", "48.917186", "2.252704"]
    ]);
  });
});
