var express = require('express');
var lightWallet = require('eth-lightwallet');
var Web3 = require('web3');
var HookedWeb3Provider = require('hooked-web3-provider');
var redis = require("redis");
var app = express();
var client

app.use(express.json())
app.get("/", function(req, res){
	res.send("Hello world");
})
app.get("/register", function(req,res){
    res.send("registered");
})
app.post("/register",function(req,res){
    res.send("registered")
})

app.get("/login", function(req,res){
    res.send("login");
})
app.post("/login",function(req,res){
    res.send("login")
})


app.post("/createAddress",async function(req,res){
    no_of_address = req.body.noAddress
    password = req.body.password
    console.log(no_of_address);
    console.log(password);
    try{
    seed = lightWallet.keystore.generateRandomSeed();
    new_addresses = await generate_addresses(seed,no_of_address,password)
    res.send(new_addresses);

    }
    catch(err){
        res.send(err);
    }
});
app.post("sendEthers",function(req,res){
    res.send("ethers sent");
});
function connection(){
    client = redis.createClient({
        port:6380
    });
    client.on("error", function(err){
        console.log("Error "+ err);
    })
}
async function createKeystore(seed,password){
if (seed == undefined)throw new Error("light wallet cant accept seed");
result =  new Promise(function(resolve,reject){
    lightWallet.keystore.createVault({
        password: password,
        seedPhrase: seed,
        hdPathString : "m/0'/0'/0'"
    }, function (err, ks) {
        if (err){
            console.log(err);
            reject("cannot create vault");            
    }
    resolve(ks);
    })
})
tobi = await result 
return tobi
}
async function generateAddresses(seed,noAddress,password){
    ks = await createKeystore(seed,password);
   return new Promise(function(resolve,reject){ ks.keyFromPassword(password, function(err, pwDerivedKey){
        if(err) reject("cant create key from password");
        ks.generateNewAddress(pwDerivedKey,noAddress);
        resolve(ks);            
    })
   })
   
}

async function generateProvider(seed,noAddress,password){
   ks = await generateAddresses(seed,noAddress,password)

    ks.passwordProvider = function (callback) {
          callback(null, password);
    };

    provider = new HookedWeb3Provider({
          host: "http://localhost:7545",
          transaction_signer: ks
    });
    console.log(provider);

   return provider;
}

seed = lightWallet.keystore.generateRandomSeed();
fake_password = 12345
no_address = 2
name = "arrowsoft2233"

async function f() {

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve("done!"), 1000)
    });
  
    let result = await promise; // wait till the promise resolves (*)
  
    return result
  }
  
  async function j(){
        gg = await f()
        console.log(gg);
  }
j()
