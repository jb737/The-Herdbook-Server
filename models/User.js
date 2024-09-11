import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    herdBookName: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    animals: [{ type: mongoose.Types.ObjectId, required: true, ref: "HerdBookAnimal"}]
});

const User = mongoose.model("HerdBookUser", userSchema);

export default User;

