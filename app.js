var express = require('express');
var lightWallet = require('eth-lightwallet');
var Web3 = require('web3');
var HookedWeb3Provider = require('hooked-web3-provider');
var redis = require("redis");
var app = express();
var client
connection();
app.use(express.json())
app.get("/", function(req, res){
	res.send("Hello world");
})
app.get("/register", function(req,res){
    res.send("registered");
})
app.post("/api/register",function(req,res){
    register(req.body.email,req.body.password,client).then((value)=>{
        res.status(200).send({
            value});
    }).catch((err)=>{
        console.log(err);
        res.send({err : err.message
        });
    })
})

app.post("/api/login", function(req,res){
    login(req.body.email,req.body.password,client).then((value) => {
        res.status(200).send({
            value });
        }).catch((err) => {
        res.status(400).send({err});
    
})
});
app.post("/api/getAccountDetails",function(req,res){
    client.hgetall(req.body.email,function(err,result){
        console.log(req.body.email+"my email");
        if (err)return res.status(400).send({err});
        let seed = result.seed
        generateProvider(seed,1,result.password).then((result2) => {
            console.log(result2);
            let provider = result2.provider
            let accountDetails = result2.accountDetails
            let address = accountDetails.yourAddress;
            let privateKey = accountDetails.privateKey;
            let web3 = new Web3(provider);
            web3.eth.getBalance(address).then(balance => {
                res.status(200).send({address,
                    balance : web3.utils.fromWei(balance),
                    privateKey
})
            }).catch(err => {
                res.status(500).send(err.message);
            })
           
           
        }).catch((err) => {
            res.status(500).send({err});
            console.log(err);
        });
    
})
})
app.post("/api/deposit",function(req,res){
    client.hgetall(req.body.email,function(err,result){
        if (err)return res.status(400).send({err});
        deposit(result.seed,1,result.password,Web3).then((result)=>{
            console.log(result);
            res.status(200).send({hash:result});
        }).catch((err) => {
            console.log(err);
            res.status(200).send({err});
        });
    });
})


app.get("/login",function(req,res){
    res.send("login")
});

app.post("/api/sendEther",function(req,res){
    console.log(req.body.email);
    client.hgetall(req.body.email,function(err,result){
        if (err)return res.status(501).send({err});
            sendEthers(result.seed,1,result.password,req.body.reciepient,req.body.amount,Web3).then(result =>{
                res.status(200).send({hash: result});
            }).catch(err => {
                res.status(501).send({err});
            });
});
});


function connection(){
    app.listen(3000);
    client = redis.createClient({
        port:6379
    });
    client.on("error", function(err){
        console.log("Error "+ err);
    })
}
async function createKeystore(seed,password){
if (seed == undefined)throw new Error("light wallet cant accept seed");
return new Promise(function(resolve,reject){
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
}
async function generateAddresses(seed,noAddress,password){
    ks = await createKeystore(seed,password);
   return new Promise(function(resolve,reject){ ks.keyFromPassword(password, function(err, pwDerivedKey){
        if(err) reject("cant create key from password");
        ks.generateNewAddress(pwDerivedKey,noAddress);
        let addresses = ks.getAddresses();
        let yourAddress = addresses[0];
        let privateKey = ks.exportPrivateKey(yourAddress,pwDerivedKey)
        resolve({ks,yourAddress,privateKey});            
    })
   })
   
}

async function generateProvider(seed,noAddress,password){
   let accountDetails = await generateAddresses(seed,noAddress,password)
    accountDetails.ks.passwordProvider = function (callback) {
          callback(null, password);
    };

    provider = new HookedWeb3Provider({
          host: "http://localhost:7545",
          transaction_signer: ks
    });

   return {provider,accountDetails};
}

async function sendEthers(seed,noAddress,password,to,amount,web3Func){
    let fullObject = await generateProvider(seed,noAddress,password);
    let provider = fullObject.provider
    let from = fullObject.accountDetails.yourAddress;
    return new Promise(function(resolve,reject){
       let  web3 = new web3Func(provider);
        value =  web3.utils.toWei(amount.toString());
        web3.eth.sendTransaction({
            from,
            to,
            value,
            gas: 21000
        }, function(error, result){
            if(error)
            {  
                console.log(error);	
               reject("cant send transaction");
            }
            else
            {
                resolve(result)
            }
        })
    })
};

async function  deposit(seed,noAddress,password,web3Func){
    let fullObject = await generateProvider(seed,noAddress,password);
    let provider = fullObject.provider;
    let to = fullObject.accountDetails.yourAddress;
    let  web3 = new web3Func(provider);
    let from = await web3.eth.getAccounts();
    let value =  web3.utils.toWei("10");
    return new Promise(async function(resolve,reject){
        web3.eth.sendTransaction({
            from: from[0],
            to,
            value,
            gas: 21000
        }, function(error, result){
            if(error)
            {	
               reject("cant send transaction");
            }
            else
            {
                resolve(result)
            }
        })
    });
};

function register(email,password,redisClient){
    return new Promise(function(resolve,reject){
    redisClient.hgetall(email,function(err,result){
        if (err)reject(err);
        if(result != null)reject("name in use");
        let  seed = lightWallet.keystore.generateRandomSeed();
       console.log(seed);
        redisClient.HMSET(email,{
            password,
            seed
       },function(err,result){
           if(err)reject(err);
           resolve("successfully registered");
             
       });
    });
})
}

async function login(email,password,redisClient){
    return new Promise(function(resolve,reject){
    redisClient.hgetall(email,function(err,result){
        if (err)reject(err);
        if(result == null)reject("invalid email");
        //console.log(password)
       // console.log(result.password);
        passwordCheck = result.password;
        if(password != passwordCheck)reject("wrong password");
        resolve("login successful")
    });
    });
}

exports.sendEthers = sendEthers
exports.generateAddresses = generateAddresses
exports.generateProvider = generateProvider
exports.createKeystore  = createKeystore
exports.register = register
exports.login = login
exports.deposit = deposit
