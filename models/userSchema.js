import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    MRN: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    // email: {
    //     type: String,
    //     required: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
}, {timestamps: true});

export const User = mongoose.model('harshita website', userSchema);