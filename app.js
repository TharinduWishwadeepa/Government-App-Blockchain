"use strict";
const express = require("express");
//const dotenv = require('dotenv');
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const userRouter = require("./routes/userRoute");
//const { urlencoded } = require('express');
const app = express();
//parse URL encoded bodies (sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
//parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors());
app.use("/auth", userRouter);
const org1UserId = "appUser";
const channelName = "mychannel";
const chaincodeName = "blockchainid";

// Setting for Hyperledger Fabric
const { Gateway, Wallets } = require("fabric-network");

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

//database connection
const mongoose = require("mongoose");
const url =
  "mongodb+srv://user:7v0KZSKcqPPjvbqk@cluster0.w6k02d6.mongodb.net/?retryWrites=true&w=majority";
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. n${err}`);
  });
// end DB connection

app.get("/", function (req, res) {
  res.send("Hello, World!");
});

//insert
app.post("/addcitizen", async function (req, res) {
  const { NIC, fullname, birthdate, gender, address } = req.body;

  try {
    //------------------- start of contract setup -------------------
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(org1UserId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract{ chaincode name} from the network.
    const contract = network.getContract(chaincodeName);

    //------------------- End of contract setup -------------------

    //chaincode functions

    //check existance
    let exist = await contract.evaluateTransaction("citizenExists", NIC);
    if (exist.toString() == "true") {
      console.log("citizen exist");
      res.status(500);
    } else {
      try {
        console.log(
          "\n--> Submit Transaction: CreateCitizen, creates new citizen"
        );
        let result = await contract.submitTransaction(
          "addNewCitizenIDInfo",
          NIC,
          fullname,
          birthdate,
          gender,
          address
        );
        console.log("*** Result: committed - add citizen");
        res.send("200");
        if (`${result}` !== "") {
          console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        }
      } catch (error) {
        console.log(`*** Error: \n    ${error}`);
        res.status(500);
      }
    }
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.log("catched error: " + error);
  }
});

app.post("/addbirthinfo", async function (req, res) {
  const { NIC, fathername, mothername, birthplace, religion, nationality } =
    req.body;

  try {
    //------------------- start of contract setup -------------------
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(org1UserId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract{ chaincode name} from the network.
    const contract = network.getContract(chaincodeName);

    //------------------- End of contract setup -------------------

    //chaincode functions

    //check existance
    let exist = await contract.evaluateTransaction("citizenExists", NIC);
    if (exist.toString() == "true") {
      try {
        let result = await contract.submitTransaction(
          "addBirthInfo",
          NIC,
          fathername,
          mothername,
          birthplace,
          religion,
          nationality
        );
        console.log("*** Result: committed - add birth info to citizen");
        res.send("200");
        if (`${result}` !== "") {
          console.log(`*** Result: ${prettyJSONString(result)}`);
        }
      } catch (error) {
        console.log(`*** Error: \n    ${error}`);
        res.status(500);
      }
    } else {
      res.status(500);
    }
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.log("catched error: " + error);
  }
});

app.post("/addpassportinfo", async function (req, res) {
  const { NIC, passportid, passportissuedate, passportexpirydate } = req.body;

  try {
    //------------------- start of contract setup -------------------
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(org1UserId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract{ chaincode name} from the network.
    const contract = network.getContract(chaincodeName);

    //------------------- End of contract setup -------------------

    //chaincode functions

    //check existance
    let exist = await contract.evaluateTransaction("citizenExists", NIC);
    if (exist.toString() == "true") {
      try {
        let result = await contract.submitTransaction(
          "addPassportInfo",
          NIC,
          passportid,
          passportissuedate,
          passportexpirydate
        );
        console.log("*** Result: committed - add passport info to citizen");
        res.send("200");
        if (`${result}` !== "") {
          console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        }
      } catch (error) {
        console.log(`*** Error: \n    ${error}`);
        res.status(500);
      }
    } else {
      res.status(500);
    }
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.log("catched error: " + error);
  }
});

app.post("/adddrivinglicinfo", async function (req, res) {
  const {
    NIC,
    bloodgroup,
    drivinglicenseissuedate,
    drivinglicenseexpirydate,
    typeofvehicles,
  } = req.body;

  try {
    //------------------- start of contract setup -------------------
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(org1UserId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract{ chaincode name} from the network.
    const contract = network.getContract(chaincodeName);

    //------------------- End of contract setup -------------------

    //chaincode functions

    //check existance
    let exist = await contract.evaluateTransaction("citizenExists", NIC);
    if (exist.toString() == "true") {
      try {
        let result = await contract.submitTransaction(
          "addDrivingLicInfo",
          NIC,
          bloodgroup,
          drivinglicenseissuedate,
          drivinglicenseexpirydate,
          typeofvehicles
        );
        console.log("*** Result: committed - add passport info to citizen");
        res.send("200");
        if (`${result}` !== "") {
          console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        }
      } catch (error) {
        console.log(`*** Error: \n    ${error}`);
        res.status(500);
      }
    } else {
      res.status(500);
    }
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.log("catched error: " + error);
  }
});

//update
app.post("/changeidinfo", async function (req, res) {
  const { NIC, fullname, birthdate, gender, address } = req.body;

  try {
    //------------------- start of contract setup -------------------
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(org1UserId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract{ chaincode name} from the network.
    const contract = network.getContract(chaincodeName);

    //------------------- End of contract setup -------------------

    //chaincode functions

    //check existance
    let exist = await contract.evaluateTransaction("citizenExists", NIC);
    if (exist.toString() == "false") {
      console.log("citizen not exist");
      res.status(500);
    } else {
      try {
        let result = await contract.submitTransaction(
          "changeIDInfo",
          NIC,
          fullname,
          birthdate,
          gender,
          address
        );
        console.log("*** Result: committed - change id info of citizen");
        res.send("200");
        if (`${result}` !== "") {
          console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        }
      } catch (error) {
        console.log(`*** Error: \n    ${error}`);
        res.status(500);
      }
    }
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.log("catched error: " + error);
  }
});

app.post("/changebirthinfo", async function (req, res) {
  const { NIC, fathername, mothername, birthplace, religion, nationality } =
    req.body;

  try {
    //------------------- start of contract setup -------------------
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(org1UserId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract{ chaincode name} from the network.
    const contract = network.getContract(chaincodeName);

    //------------------- End of contract setup -------------------

    //chaincode functions

    //check existance
    let exist = await contract.evaluateTransaction("citizenExists", NIC);
    if (exist.toString() == "false") {
      console.log("citizen not exist");
      res.status(500);
    } else {
      try {
        let result = await contract.submitTransaction(
          "addBirthInfo",
          fathername,
          mothername,
          birthplace,
          religion,
          nationality
        );
        console.log("*** Result: committed - change birth info of citizen");
        res.send("200");
        if (`${result}` !== "") {
          console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        }
      } catch (error) {
        console.log(`*** Error: \n    ${error}`);
        res.status(500);
      }
    }
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.log("catched error: " + error);
  }
});

app.post("/changepassportinfo", async function (req, res) {
  const { NIC, passportid, passportissuedate, passportexpirydate } = req.body;

  try {
    //------------------- start of contract setup -------------------
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(org1UserId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract{ chaincode name} from the network.
    const contract = network.getContract(chaincodeName);

    //------------------- End of contract setup -------------------

    //chaincode functions

    //check existance
    let exist = await contract.evaluateTransaction("citizenExists", NIC);
    if (exist.toString() == "false") {
      console.log("citizen not exist");
      res.status(500);
    } else {
      try {
        let result = await contract.submitTransaction(
          "addPassportInfo",
          NIC,
          passportid,
          passportissuedate,
          passportexpirydate
        );
        console.log("*** Result: committed - modify passport info of citizen");
        res.send("200");
        if (`${result}` !== "") {
          console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        }
      } catch (error) {
        console.log(`*** Error: \n    ${error}`);
        res.status(500);
      }
    }
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.log("catched error: " + error);
  }
});

app.post("/changedrivinglicinfo", async function (req, res) {
  const {
    NIC,
    bloodgroup,
    drivinglicenseissuedate,
    drivinglicenseexpirydate,
    typeofvehicles,
  } = req.body;

  try {
    //------------------- start of contract setup -------------------
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(org1UserId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract{ chaincode name} from the network.
    const contract = network.getContract(chaincodeName);

    //------------------- End of contract setup -------------------

    //chaincode functions

    //check existance
    let exist = await contract.evaluateTransaction("citizenExists", NIC);
    if (exist.toString() == "false") {
      console.log("citizen not exist");
      res.status(500);
    } else {
      try {
        let result = await contract.submitTransaction(
          "addDrivingLicInfo",
          NIC,
          bloodgroup,
          drivinglicenseissuedate,
          drivinglicenseexpirydate,
          typeofvehicles
        );
        console.log(
          "*** Result: committed - change driving lic info of citizen"
        );
        res.send("200");
        if (`${result}` !== "") {
          console.log(`*** Result: ${prettyJSONString(result.toString())}`);
        }
      } catch (error) {
        console.log(`*** Error: \n    ${error}`);
        res.status(500);
      }
    }
    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.log("catched error: " + error);
  }
});

//get history of citizen information
app.get("/gethistory/:NIC", async function (req, res) {
  try {
    //------------------- start of contract setup -------------------
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(org1UserId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract{ chaincode name} from the network.
    const contract = network.getContract(chaincodeName);

    //------------------- End of contract setup -------------------

    //chaincode functions

    try {
      console.log("\n--> Submit Transaction: check history");
      let result = await contract.evaluateTransaction(
        "GetCitizenHistory",
        req.params.NIC
      );
      console.log("*** Result: check history");
      res.send(result).status(200);
      if (`${result}` !== "") {
        console.log(`*** Result: ${result}`);
      }
    } catch (error) {
      console.log(`*** Error: \n    ${error}`);
      res.status(500);
    }

    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.log("catched error: " + error);
  }
});

//view citizen in world state - latest update
app.get("/viewcitizen/:NIC", async function (req, res) {
  try {
    //------------------- start of contract setup -------------------
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(org1UserId);
    if (!identity) {
      console.log(
        'An identity for the user "appUser" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      return;
    }
    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: org1UserId,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract{ chaincode name} from the network.
    const contract = network.getContract(chaincodeName);

    //------------------- End of contract setup -------------------

    //chaincode functions

    try {
      console.log("\n--> Submit Transaction: view citizen in world state");
      let result = await contract.evaluateTransaction(
        "ReadCitizen",
        req.params.NIC
      );
      console.log("*** Result: view citizen in world state");
      res.send(result).status(200);
      console.log(result);
      if (`${result}` !== "") {
        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
      }
    } catch (error) {
      console.log(`*** Error: \n    ${error}`);
      res.status(500);
    }

    // Disconnect from the gateway.
    await gateway.disconnect();
  } catch (error) {
    console.log("catched error: " + error);
  }
});

app.listen(8080, () => {
  console.log("Server is listening");
});
