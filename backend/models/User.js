import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  password: { type: String, default: "" },
  googleId: { type: String, default: "" },
  googleProfile: { type: Object, default: {} },
});

export default mongoose.model("User", userSchema);
