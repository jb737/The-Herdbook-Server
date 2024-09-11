import express from "express";
import User from "../models/User.js";
import Animal from "../models/Animal.js";

const usersRouter = express.Router();

usersRouter.get("/:userId/animals", async (req, res) => {
    const userId = req.params.userId;

    try {
    const userAnimals = await Animal.find({
        ownerId: userId,
    });
        return res.send(userAnimals);
    } catch (error) {
        return res.status(500).send(error);
    }
    
});

usersRouter.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        if(!user) res.status(404).send("user not found");
    
        return res.send({ id: user.id, herdBookName: user.herdBookName, email: user.email });
    } catch (error) {
        return res.status(500).send(error);
    }

   
});

usersRouter.post("/", async (req, res) => {
    const {herdBookName, firstname, lastName, email, password, confirmPassword} = req.body;


    // Uncomment and use the validation if needed
    // const validationErrors = userRequestValidator(newUser);
    // if (validationErrors.length > 0) {
    //     res.status(400).send(validationErrors.join(", "));
    //     return;
    // }

    if(password !== confirmPassword) {
        return res.status(400).send("Passwords must match");
    }

try {
    const user = await User.findOne({ email: email });

    if (user) {
        res.status(400).send("User with provided e-mail already exists");
        return;
    }

    const newUser = new User({
    herdBookName,
    firstname,
    lastName,
    email, 
    password,
    });
  
 await newUser.save();

    return res.status(201).send({ id: newUser.id });

} catch (error) {
     res.status(500).send(error);
     return;
}

});

usersRouter.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password,
        });

        if(!user) {
            return res.status(401).send("Invalid Credentials");
        }

        return res.send({ id: user.id });

    } catch (error) {
        return res.status(500).send(error);
    }
});

export default usersRouter;