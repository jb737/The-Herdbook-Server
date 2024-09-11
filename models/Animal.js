import mongoose from "mongoose";

const animalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    herdBookName: { type: String, required: true },
    sex: { type: String, required: true },
    details: { type: String },
    importantEvents: { type: String },
    veterinaryNotes: { type: String },
    ownerId: { type: mongoose.Types.ObjectId, required: true, ref: "HerdBookUser" },
    ownerEmail: { type: String, required: true }
});

const Animal = mongoose.model("HerdBookAnimal", animalSchema);

export default Animal;