const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    otp: { type: Number },
    deletedAt: { type: Date},
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;







