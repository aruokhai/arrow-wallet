var chai = require('chai');
var lightwallet = require('eth-lightwallet');
var sinon = require('sinon');
var app = require('./../app');
var Web3 = require('web3');
var redis = require("redis");
var HookedWeb3Provider = require('hooked-web3-provider');

var expect = chai.expect;
describe('Basic function', function() {
    describe('app.js unit test', function() {
     before(async function(){
        userMap = new Map();
        web3Fake =  sinon.fake(function(provider){
           this.provider = provider
           this.utils = {
              toWei : function(amount) {
                 return amount+"";
              }
            }
            this.eth = {
               sendTransaction : function(obj,callback){
                  callback(null,obj.from);
               }
            
           }
        });
        redisFake = {
         hgetall: function(name, callback){
             let result = userMap.get(name)
             if (result) callback(null,result);
             else callback(null,null);
         },
         HMSET: function(name,obj,callback){
            let result = userMap.set(name,obj);
            if (result)callback(null,result);
            else callback("cant set this",null);
         }
        }
        seed = "dress outdoor unique pumpkin chair excess hedgehog quick blanket kitten tooth addict"
        fake_password = 12345
        no_address = 2
        name = "arrowsoft2233"
     });     
     it('should create keystore',async function() {
      keystore =  await app.createKeystore(seed,fake_password);
      expect(keystore).to.have.property('salt');
     });
    it('should generare addresses',async function() {
      keystoreObject = await app.generateAddresses(seed,no_address,fake_password);
      expect(keystoreObject.ks.addresses).to.have.length(2);
   });

      it('should generate provider ',async  function() {
         fullObj = await app.generateProvider(seed,no_address,fake_password);
         expect(fullObj.provider).to.have.property('host');

      });
      
      it('should send ethers',async function(){
            to = "0xD25cF0Be287B68a49Dd2bEcA5d408F4A95269999";
            result = await app.sendEthers(seed,no_address,fake_password,to,10,web3Fake);
            expect(result).to.be.a('string');
            expect(web3Fake.lastArg).to.be.an('object');
      });
      
      it('should register user',async function(){
            result = await app.register(name,fake_password,redisFake);
            expect(result).to.equal("successfully registered");     
      })
      it('should login user',async function(){
         await app.register(name,fake_password,redisFake);
         result = await app.login(name,fake_password,redisFake);
         expect(result).to.equal("login successful");
      }); 
     afterEach(async function(){
         userMap = new Map();     
    });
  });
  describe("app.js integeration test", function(){
     before(function(done){   
     seed = "dress outdoor unique pumpkin chair excess hedgehog quick blanket kitten tooth addict"
      fake_password = 12345
      no_address = 1
      name = "arrowsoft2233"
      lightwallet.keystore.createVault({
         password: fake_password,
         seedPhrase: seed,
         hdPathString : "m/0'/0'/0'"

      }, function (err, ks) {
           ks.keyFromPassword(fake_password, function (err, pwDerivedKey) {
             if(err)
             {
                throw new Error(err);
             }
             else
             {
                ks.generateNewAddress(pwDerivedKey,1);
               console.log(ks.getAddresses());
                ks.passwordProvider = function (callback) {
                     callback(null, password);
                };
   
                var provider = new HookedWeb3Provider({
                    host: "http://localhost:7545",
                    transaction_signer: ks
               });
   
                var web3 = new Web3(provider);
   
                var from = "0xD25cF0Be287B68a49Dd2bEcA5d408F4A95269999"

               var to = "364e758fbfc7c5bd98673ca6094934a57bc5f357"
               var value = web3.utils.toWei("10", "ether");
   
                web3.eth.sendTransaction({
                   from: from,
                   to: to,
                   value: value,
                   gas: 21000
                }, function(error, result){
                   if(error)
                   {	
                      console.log(error);
                   }
                   else
                   {
                      done()
                   }

                })
             }
           });

     }) ;
   })

     it('should send ethers',async function(){
      to = "0xD25cF0Be287B68a49Dd2bEcA5d408F4A95269999";
      result = await app.sendEthers(seed,no_address,fake_password,to,10,Web3);
      expect(result).to.be.a('string');
});
it('should deposit ethers',async function(){
   result = await app.deposit(seed,no_address,fake_password,Web3);
   expect(result).to.be.a('string');
});

  })
})