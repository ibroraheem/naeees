const mongoose = require('mongoose');

const individualSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    nameOfSchool: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    instagram: {
        type: String,
    },
    twitter: {
        type: String,
    },
    linkedIn: {
        type: String,
    },
    idCard: {
        type: String,
        required: true
    },
    projectTitle: {
        type: String,
        required: true
    },
    projectDescription: {
        type: String,
        required: true
    },
    projectCategory: {
        type: String,
    },
    tagID: {
        type: String,
    }
},
    { timestamps: true });

const Individual = mongoose.model('Individual', individualSchema);

module.exports = Individual;
