import express, { response } from "express";
import Animal from "../models/Animal.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const animalsRouter = express.Router();

animalsRouter.get("/", async (_, res) => {
    try {
        const animals = await Animal.find();
        return res.send(animals);
    } catch (error) {
        return res.status(500).send(error);
    }
});

animalsRouter.post("/", async(req, res) => {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        const user = await User.findById(req.body.ownerId);

        if(!user) {
            return res.status(404).send("Usr not found")
        }

        const newAnimal = new Animal({
            name: req.body.name,
            herdBookName: req.body.herdBookName,
            sex: req.body.sex,
            details: req.body.details,
            importantEvents: req.body.importantEvents,
            veterinaryNotes: req.body.veterinaryNotes,
            ownerEmail: user.email,
            ownerId: req.body.ownerId,
        });

        await newAnimal.save({session});

        user.animals.push(newAnimal);

        await user.save({session});

        await session.commitTransaction();

        return res.status(201).send(newAnimal);
    } catch (error) {
        return res.status(500).send(error);
    }
});

animalsRouter.get("/:animalId", async (req, res) => {
try {
    const animal = await Animal.findById(req.params.animalId);

    if(!animal) {
        return res.status(404).send("Animal not found");
    }

    return res.send(animal);
} catch (error) {
    return res.status(500).send(error);
}


    /* const animalId = req.params.animalId;
    const animal = DUMMY_ANIMALS.find((a) => a.id == animalId);

    if(!animal) res.status(404).send("Animal not found");

    res.send(animal); */
});

animalsRouter.put("/:animalId", async (req, res) => {
   try {
    const animalId = req.params.animalId;
    const animal = await Animal.findByIdAndUpdate(animalId, {
        name: req.body.name,
        sex: req.body.sex,
        details: req.body.details,
        importantEvents: req.body.importantEvents,
        veterinaryNotes: req.body.veterinaryNotes,
    }, {
        new: true,
    });

    if(!animal) {
        return res.status(404).send("Animal not found");
    }

    return res.send(animal);

   } catch (error) {
    return res.status(500).send(error);
   }
});

animalsRouter.delete("/:animalId", async (req, res) => {
 try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const animal = await Animal.findByIdAndDelete(req.params.animalId).session(session);

    if(!animal) {
        return res.status(404).send("Animal not found");
    }

    const user = await User.findById(animal.ownerId);

    if(!user) {
        return res.status(404).send("Usr not found")
    }

    user.animals.pull(animal);

    await user.save({ session });
    await session.commitTransaction();

    return res.send(animal);
    
 } catch (error) {
    return res.status(500).send(error);
 }
});

export default animalsRouter;