const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
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
    teamName: {
        type: String,
        required: true
    },
    tagID: {
        type: String,
    },
    members: [
        {
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
            isCaptain: {
                type: Boolean,
                required: true
            },
        }
    ],
    idCards: [
        {
            memberName: {
                type: String,
                required: true
            }
        }
    ],
    isQualified: {
        type: Boolean,
        default: false
    },
},

    { timestamps: true });

const Team = mongoose.model('Team', TeamSchema);

module.exports = Team;