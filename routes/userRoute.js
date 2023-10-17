//main codes related to routes will be written here

const router = require("express").Router();
const User = require("../userSchema");
const Government = require("../governmentSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//user register code
router.post("/register", async (req, res) => {
  try {
    var emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).json("Email Already Exist");
    }
    var hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
      role: req.body.role,
    });

    await user
      .save()
      .then(() => {
        console.log("Document saved to sample collection");
      })
      .catch((error) => {
        console.error("Error saving document to sample collection:", error);
      });
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }

  res.json(User);
});

//user login code
router.post("/login", async (req, res) => {
  try {
    var userData = await User.findOne({ email: req.body.email });
    if (!userData) {
      return res.status(400).json("Email Not Exist");
    }
    var validPassword = await bcrypt.compare(
      req.body.password,
      userData.password
    );
    if (!validPassword) {
      return res.status(400).json("Password missmatached");
    }
    // Update the lastLogin,isActive field with the current date and time
    userData.lastLogin = new Date();
    userData.isActive = true;
    await userData.save();
    var userToken = jwt.sign(
      {
        email: userData.email,
        role: userData.role,
        id: userData._id,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin,
        isActive: userData.isActive,
      },
      "(q6B,;fpCP{ff/74bXA7^xC4Dk~p",
      {
        expiresIn: "1h",
      }
    );
    res.setHeader("auth", userToken);
    res.header("auth", userToken).send(userToken);
  } catch (error) {
    res.status(400).json(error);
  }
});

const validUser = (req, res, next) => {
  var token = req.header("auth");
  res.token = token;
  const decoded = jwt.verify(res.token, "(q6B,;fpCP{ff/74bXA7^xC4Dk~p");
  req.decodedToken = decoded;
  next();
};

router.post("/createGov", async (req, res) => {
  try {
    // Check if the correct JSON key name is used
    if (!req.body.password) {
      // Send an error response and terminate the request flow
      return res.status(400).json({ error: "Need More Data!" });
    }

    if (!req.body.email) {
      return res.status(400).json({ error: "Need More Data!" });
    }

    if (!req.body.name) {
      return res.status(400).json({ error: "Need More Data!" });
    }
    if (!req.body.role) {
      return res.status(400).json({ error: "Need More Data!" });
    }

    var emailExist = await Government.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).send("Email Already registered!");
    }
    var hash = await bcrypt.hash(req.body.password, 10);
    const government = new Government({
      email: req.body.email,
      name: req.body.name,
      password: hash,
      role: req.body.role,
    });
    await government
      .save()
      .then(() => {
        console.log("New Gov Organization Added!");
      })
      .catch(() => {
        console.log("Error Adding New Gov Organization to Database!");
      });

    res.send(government);
  } catch (error) {
    res.status(405).send("Something Went Wrong! " + error.message);
  }
});

//getall Code
router.get("/getAll", validUser, async (req, res) => {
  if (req.decodedToken.role == "DRP") {
    const token = jwt.sign({ role: "DRP" }, "(q6B,;fpCP{ff/74bXA7^xC4Dk~p");
    const users = await User.find().maxTimeMS(30000);
    return res.json({ token, users });
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
});

router.delete("/deleteUser/:id", validUser, async (req, res) => {
  try {
    if (req.decodedToken.role === "DRP") {
      const { id } = req.params;
      await User.findByIdAndRemove(id);
      res.sendStatus(204);
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (error) {
    console.error("Error deleting user", error);
    res.sendStatus(500);
  }
});

// Update isActive status
router.put("/updateIsActive", validUser, async (req, res) => {
  try {
    const userId = req.decodedToken.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = false;
    await user.save();

    // Update isActive status for users based on lastLogin time
    const currentTime = new Date();

    //get the list of users who's last login time is
    const usersToUpdate = await User.find({
      lastLogin: { $lt: new Date(currentTime - 60 * 60 * 1000) },
    });

    // Update the isActive status for each user to false
    usersToUpdate.forEach(async (user) => {
      user.isActive = false;
      await user.save();
    });

    res.json({ message: "isActive status updated successfully" });
  } catch (error) {
    console.log("Error updating isActive status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
