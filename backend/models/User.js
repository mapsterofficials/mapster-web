import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  password: { type: String, default: "" },
  googleId: { type: String, default: "" },
  googleProfile: { type: Object, default: {} },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

export default mongoose.model("User", userSchema);
