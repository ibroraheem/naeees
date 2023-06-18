const Individual = require('../models/individual');
const Team = require('../models/team');
const Admin = require('../models/admin');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

require('dotenv').config()

const registerIndividual = async (req, res) => {
    try {
        const { name, email, nameOfSchool, department, level, phoneNumber, instagram, twitter, linkedIn, idCard, projectDescription, projectTitle, projectCategory } = req.body
        const Email = email.toLowerCase()
        const individual = await Individual.findOne({ email: Email })
        if (individual) return res.status(400).json({ message: 'Email already exists' })
        const newIndividual = new Individual({
            name, email: Email, nameOfSchool, department, level, phoneNumber, instagram, twitter, linkedIn, idCard, projectDescription, projectTitle, projectCategory
        })
        await newIndividual.save()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: Email,
            subject: 'Confirmation of Registration',
            html: `
            <p>Dear ${name},</p>
            <p>This is to notify you that you have registered successfully for the NAEEES Hackathon 2023</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })

        const mailOptions2 = {
            from: process.env.EMAIL,
            to: 'naeeshackathon@gmail.com',
            subject: 'Notification of Registration',
            html: `
            <p>Dear EPEX Admin,</p>
            <p>A new individual has registered for NAEEES Hackathon 2023. With the following details:</p>
            <p>Name: ${name}</p>
            <p>Email: ${Email}</p>
            <p>Name of School: ${nameOfSchool}</p>
            <p>Phone Number: ${phoneNumber}</p>
            <p>Project Title: ${projectTitle}</p>
            <p>Project Description: ${projectDescription}</p>
            <p>Project Category: ${projectCategory}</p>
            <p>Regards,</p>
            <p>NAEEES Hackathon Team</p>`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })
        transporter.sendMail(mailOptions2, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })

        res.status(201).json({ message: 'Registration Success!', email: newIndividual.email })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error.message })
    }
}

const registerTeam = async (req, res) => {
    try {
        const { teamName, projectTitle, projectCategory, projectDescription, members } = req.body
        const team = await Team.findOne({ teamName: teamName })
        if (team) return res.status(400).json({ message: 'Team Name already exists' })
        const newTeam = new Team({
            teamName, projectTitle, projectCategory, projectDescription, members
        })
        await newTeam.save()


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            secure: true
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: members[0].email,
            subject: 'Registration Successful',
            html: `<h1>Registration Successful</h1>
            <p>Dear ${members[0].name},</p>
            <p>Your registration was successful. You will be contacted with further instructions.</p>
            <p>Regards,</p>
            <p>NAEEES Hackathon Team</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
            }
        })


        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email Sent: ' + info.response)
            }
        })

        res.status(201).json({ message: 'Registration Success!', teamName: newTeam.teamName })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error.message })
    }
}

const viewRegistrations = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id)
        if (!admin) return res.status(400).json({ message: 'Invalid Authentication' })
        const individuals = await Individual.find()
        const teams = await Team.find()
        let registrations = [...individuals, ...teams]
        res.status(200).json({ message: 'Success', registrations })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const viewIndividuals = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id)
        if (!admin) return res.status(400).json({ message: 'Invalid Authentication' })
        const individuals = await Individual.find()
        res.status(200).json({ message: 'Success', individuals })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const viewTeams = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id)
        if (!admin) return res.status(400).json({ message: 'Invalid Authentication' })
        const teams = await Team.find()
        res.status(200).json({ message: 'Success', teams })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const deleteIndividual = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id)
        if (!admin) return res.status(400).json({ message: 'Invalid Authentication' })
        const individual = await Individual.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Success', individual })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const updateIndividual = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id)
        if (!admin) return res.status(400).json({ message: 'Invalid Authentication' })
        const { name, email, nameOfSchool, department, level, phoneNumber, instagram, idCard, projectTitle, projectDescription, twitter, linkedIn } = req.body
        const Email = email.toLowerCase()
        const individual = await Individual.findByIdAndUpdate(req.params.id, {
            name, email: Email, nameOfSchool, department, level, phoneNumber, instagram, idCard, projectTitle, projectDescription, twitter, linkedIn
        }, { new: true })
        res.status(200).json({ message: 'Success', individual })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const deleteTeam = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id)
        if (!admin) return res.status(400).json({ message: 'Invalid Authentication' })
        const team = await Team.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'Success', team })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const updateTeam = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id)
        if (!admin) return res.status(400).json({ message: 'Invalid Authentication' })
        const { teamName, captainName, captainEmail, captainLevel, captainPhone, captainIdcard, captainInstagram, captainLinkedin, captainTwitter, captainSchool, members } = req.body
        const team = await Team.findByIdAndUpdate(req.params.id, {
            teamName, captainName, captainEmail, captainLevel, captainPhone, captainIdcard, captainInstagram, captainLinkedin, captainTwitter, captainSchool, members
        }, { new: true })
        res.status(200).json({ message: 'Success', team })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const viewIndividual = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id)
        if (!admin) return res.status(400).json({ message: 'Invalid Authentication' })
        const individual = await Individual.findById(req.params.id)
        res.status(200).json({ message: 'Success', individual })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const viewTeam = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const admin = await Admin.findById(decoded.id)
        if (!admin) return res.status(400).json({ message: 'Invalid Authentication' })
        const team = await Team.findById(req.params.id)
        res.status(200).json({ message: 'Success', team })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const dump = async (req, res) => {
    try {
        var individual = await Individual.find()
        if (!individual) return res.status(400).json({ message: 'No Individual' })
        const data = individual.map((item) => {
            return {
                name: item.name,
                email: item.email,
                nameOfSchool: item.nameOfSchool,
                department: item.department,
                level: item.level,
                phoneNumber: item.phoneNumber,
            }
        })
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: "halimatabdullahi86@gmail.com",
            subject: "Individual Registration",
            html: `
             <table border="1" style="border-collapse: collapse; width: 100%; height: 100px;" cellpadding="5">
            <thead>
                <tr>

                    <th>Name</th>
                    <th>Email</th>
                    <th>Level</th>
                    <th>Phone</th>
                    <th>School</th>
                </tr>
            </thead>
            <tbody>
            ${data.map((item) => {
                return `<tr>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.level}</td>
                <td>${item.phoneNumber}</td>
                <td>${item.nameOfSchool}</td>
                </tr>`
            }).join('')}
            </tbody>
        </table>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ msg: error.message })
            }
            console.log('Email sent: ' + info.response)
            res.status(200).json({ message: 'Success' })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const dumpTeam = async (req, res) => {
    try {
        var team = await Team.find()
        if (!team) return res.status(400).json({ message: 'No Team' })
        const data = team.map((item) => {
            return {
                teamName: item.teamName,
                captainName: item.members[0].name,
                captainEmail: item.members[0].email,
                captainLevel: item.members[0].level,
                captainPhone: item.members[0].phoneNumber,
                captainSchool: item.members[0].nameOfSchool
            }
        })
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: "halimatabdullahi86@gmail.com",
            subject: 'Team Registrations so far',
            html: `
            <table border="1" style="border-collapse: collapse; width: 100%; height: 100px;" cellpadding="5">
            <thead>
                <tr>
                    <th>Team Name</th>
                    <th>Captain Name</th>
                    <th>Captain Email</th>
                    <th>Captain Level</th>
                    <th>Captain Phone</th>
                    <th>Captain School</th>
                </tr>
            </thead>
            <tbody>
                ${data.map((item) => {
                return `<tr>
                        <td>${item.teamName}</td>
                        <td>${item.captainName}</td>
                        <td>${item.captainEmail}</td>
                        <td>${item.captainLevel}</td>
                        <td>${item.captainPhone}</td>
                        <td>${item.captainSchool}</td>
                    </tr>`
            }).join('')}
            </tbody>

        </table>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
                return res.status(500).json({ msg: error.message })
            }
            console.log('Email sent: ' + info.response)
            res.status(200).json({ message: 'Success' })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const emailDump = async (req, res) => {
    try {
        const individual = await Individual.find()
        //send email to all individuals
        const data = individual.map((item) => {
            return {
                name: item.name,
                email: item.email,
                nameOfSchool: item.nameOfSchool,
                department: item.department,
                level: item.level,
                phoneNumber: item.phoneNumber,
            }
        })
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: `${data.map((item) => item.email)}`,
            subject: 'Confirmation of Registration and Further Instructions',
            html: `<p>This is to notify you of your successful application to participate in the first stage of EPEX 2023.</p>
            <p> You are hereby required to IMMEDIATELY do the following:<br></p>
            <p><ol>
            <li>Take a snapshot of yourself and post on Instagram, Twitter or LinkedIn with the following caption “I have just been shortlisted to participate in the Engineering Projects Exhibition organized by the NUESA University of Ilorin Chapter tagged EPEX 2023, and I am excited to showcase my innovative skills” with the hashtags #EPEX2023, #EPEXSERIES, #EPEXNUESAUNILORIN, #UNILORIN, #epex, #tech, #exhibition.
            Also, post the EPEX flyer attached to the email, together with the link to the prospectus alongside with your picture, and tag @epexseries on any of the media.</li> <br>
            <li>Join the WhatsApp group for the participants through this <a href="https://chat.whatsapp.com/JbJBueP6xJ8D7LgJM8ZLRp">link</a> </li></p>
            <p>It is important to note that your performance at the virtual preliminary stages will qualify you for the physical final stage, so we encourage you to give the preliminary stages your best effort.</p>
            <p>Here’s the link to the prospectus and the EPEX flyer attached:<br>
            <a href="bit.ly/EPEX_2023_Info_Packet">bit.ly/EPEX_2023_Info_Packet</a></p>
            <p>Further Information would be communicated to you. <br>
            Once again, welcome to the Engineering Projects Exhibition 2023. We are glad to have you!<p>
            <p>EPEX 2023 ORGANIZING COMMITTEE…</p>`,
            attachments: [{
                filename: 'flyer.jpg',
                path: './images/flyer.jpg',
                cid: 'flyer'
            }]
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
                res.status(200).json({ message: 'Success' })
            }
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const emailDumpTeam = async (req, res) => {
    try {
        const team = await Team.find()
        //send email to all 1st members
        const data = team.map((item) => {
            return {
                teamName: item.teamName,
                captainName: item.members[0].name,
                captainEmail: item.members[0].email,
                captainLevel: item.members[0].level,
                captainPhone: item.members[0].phoneNumber,
                captainSchool: item.members[0].nameOfSchool
            }
        })
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: `${data.map((item) => item.captainEmail)}`,
            subject: 'Confirmation of Registration and Further Instructions',
            html: `<p>This is to notify you of your successful application to participate in the first stage of EPEX 2023.</p>
            <p> You are hereby required to IMMEDIATELY do the following:<br></p>
            <p><ol>
            <li>Take a snapshot of yourself and post on Instagram, Twitter or LinkedIn with the following caption “I have just been shortlisted to participate in the Engineering Projects Exhibition organized by the NUESA University of Ilorin Chapter tagged EPEX 2023, and I am excited to showcase my innovative skills” with the hashtags #EPEX2023, #EPEXSERIES, #EPEXNUESAUNILORIN, #UNILORIN, #epex, #tech, #exhibition.
            Also, post the EPEX flyer attached to the email, together with the link to the prospectus alongside with your picture, and tag @epexseries on any of the media.</li> <br>
            <li>Join the WhatsApp group for the participants through this <a href="https://chat.whatsapp.com/JbJBueP6xJ8D7LgJM8ZLRp">link</a> </li></p>
            <p>It is important to note that your performance at the virtual preliminary stages will qualify you for the physical final stage, so we encourage you to give the preliminary stages your best effort.</p>
            <p>Here’s the link to the prospectus and the EPEX flyer attached:<br>
            <a href="bit.ly/EPEX_2023_Info_Packet">bit.ly/EPEX_2023_Info_Packet</a></p>
            <p>Further Information would be communicated to you. <br>
            Once again, welcome to the Engineering Projects Exhibition 2023. We are glad to have you!<p>
            <p>EPEX 2023 ORGANIZING COMMITTEE…</p>`,
            attachments: [{
                filename: 'flyer.jpg',
                path: './images/flyer.jpg',
                cid: 'flyer'
            }]
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
                res.status(200).json({ msg: 'Emails sent' })
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const sendEmail = async (req, res) => {
    try {
        //send email to all individual and first members of teams mark email as broadcast or campaign so that it doesn't go to spam
        const individual = await Individual.find()
        const team = await Team.find()
        const data = individual.map((item) => {
            return {
                name: item.name,
                email: item.email,
                level: item.level,
                phoneNumber: item.phoneNumber,
                nameOfSchool: item.nameOfSchool
            }
        })
        const data2 = team.map((item) => {
            return {
                teamName: item.teamName,
                captainName: item.members[0].name,
                captainEmail: item.members[0].email,
                captainLevel: item.members[0].level,
                captainPhone: item.members[0].phoneNumber,
                captainSchool: item.members[0].nameOfSchool
            }
        })
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: `${data.map((item) => item.email)}, ${data2.map((item) => item.captainEmail)}`,
            subject: 'Confirmation of Registration and Further Instructions',
            html: `<p>This is to notify you of your successful application to participate in the first stage of EPEX 2023.</p>
            <p> You are hereby required to IMMEDIATELY do the following:<br></p>
            <p><ol>
            <li>Take a snapshot of yourself and post on Instagram, Twitter or LinkedIn with the following caption “I have just been shortlisted to participate in the Engineering Projects Exhibition organized by the NUESA University of Ilorin Chapter tagged EPEX 2023, and I am excited to showcase my innovative skills” with the hashtags #EPEX2023, #EPEXSERIES, #EPEXNUESAUNILORIN, #UNILORIN, #epex, #tech, #exhibition.
            Also, post the EPEX flyer attached to the email, together with the link to the prospectus alongside with your picture, and tag @epexseries on any of the media.</li> <br>
            <li>Join the WhatsApp group for the participants through this <a href="https://chat.whatsapp.com/JbJBueP6xJ8D7LgJM8ZLRp">link</a> </li></p>
            <p>It is important to note that your performance at the virtual preliminary stages will qualify you for the physical final stage, so we encourage you to give the preliminary stages your best effort.</p>
            <p>Here’s the link to the prospectus and the EPEX flyer attached:<br>
            <a href="bit.ly/EPEX_2023_Info_Packet">bit.ly/EPEX_2023_Info_Packet</a></p>
            <p>Further Information would be communicated to you. <br>
            Once again, welcome to the Engineering Projects Exhibition 2023. We are glad to have you!<p>
            <p>EPEX 2023 ORGANIZING COMMITTEE…</p>`,
            attachments: [{
                filename: 'flyer.jpg',
                path: './images/flyer.jpg',
                cid: 'flyer'
            }]
        }
        //use delay to send email to avoid spam and also to avoid crashing the server
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
        for (let i = 0; i < data.length; i++) {
            await delay(5000)
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log('Email sent: ' + info.response)
                }
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}

const tagID = async (req, res) => {
    try {
        //Generate EPEX ID for each participant (both individual and team) according to the order of registration (join them together) in this format EPEX-23-001 and save to tagID
        const individual = await Individual.find()
        const team = await Team.find()
        //join the two arrays together
        const data = individual.concat(team)
        //sort the array according to the order of registration
        const sortedData = data.sort((a, b) => a.createdAt - b.createdAt)
        //generate EPEX ID for each participant EPEX-23-001 make sure it is 3 digits
        const tagID = sortedData.map((item, index) => {
            if (index < 9) {
                return `EPEX-23-00${index + 1}`
            } else if (index < 99) {
                return `EPEX-23-0${index + 1}`
            } else {
                return `EPEX-23-${index + 1}`
            }
        })
        //update the tagID of each participant
        for (let i = 0; i < sortedData.length; i++) {
            sortedData[i].tagID = tagID[i]
            await sortedData[i].save()
        }
        return res.status(200).json({ msg: 'EPEX ID tagged' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}




const newMail = async (req, res) => {
    try {
        //send email for each participant (both individual and team) with their EPEX ID and further instructions
        const team = await Team.find()
        const individual = await Individual.find()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: individual[17].email,
            subject: 'Confirmation of Registration and Submission Requirements',
            html: `<p>Dear ${individual[17].name},</p>
                <p>We are thrilled to have you join us in showcasing your innovative ideas and projects at the Engineering Projects Exhibition 2023 (EPEX 2023).</p>
            <p>This Email is to confirm your application and to provide you with further instructions to submit your project materials.</p>
            <p>To participate in the preliminary stage, you're required to submit the following on or before 10th June 2023:</p>
            <p><ol>
            <li>Project Abstract</li>
            <li>Problem Description</li>
            <li>A detailed visual representation of your project (showing the design or physical snapshot if available)</li></ol></p>
            <p>You are to submit the above requirements to the following email address: <a href="mailto:epex.nuesaunilorin@gmail.com">epex.nuesaunilorin@gmail.com</a>, using the subject: [Project Title] - [Team Name/Participant name] - [EPEX ID].</p>
            <p>Please note that you hae been assigned a unique EPEX ID which is ${individual[17].tagID}. This ID is to be used in all correspondence with the EPEX 2023 Organizing Committee.</p>
            <p>Thank you once again for your participation, and we look forward to seeing your project. at the exhibition</p>
            <p>Best Regards,</p>
            <p>EPEX 2023 Organizing Committee</p>`
        }
        const mailOptions2 = {
            from: process.env.EMAIL,
            to: team[13].members[0].email,
            subject: 'Confirmation of Registration and Submission Requirements',
            html: `<p>Dear ${team[13].teamName},</p>
                <p>We are thrilled to have you join us in showcasing your innovative ideas and projects at the Engineering Projects Exhibition 2023 (EPEX 2023).</p>
            <p>This Email is to confirm your application and to provide you with further instructions to submit your project materials.</p>
            <p>To participate in the preliminary stage, you're required to submit the following on or before 10th June 2023:</p>
            <p><ol>
            <li>Project Abstract</li>
            <li>Problem Description</li>
            <li>A detailed visual representation of your project (showing the design or physical snapshot if available)</li></ol></p>
            <p>You are to submit the above requirements to the following email address: <a href="mailto:epex.nuesaunilorin@gmail.com">epex.nuesaunilorin@gmail.com</a>, using the subject: [Project Title] - [Team Name/Participant name] - [EPEX ID].</p>
            <p>Please note that you hae been assigned a unique EPEX ID which is ${team[13].tagID}. This ID is to be used in all correspondence with the EPEX 2023 Organizing Committee.</p>
            <p>Thank you once again for your participation, and we look forward to seeing your project. at the exhibition</p>
            <p>Best Regards,</p>
            <p>EPEX 2023 Organizing Committee</p>`
        }
        transporter.sendMail(mailOptions2, (error, info) => {
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent: ' + info.response)
                res.status(200).json({ msg: 'Email sent' })
            }
        })
        // transporter.sendMail(mailOptions2, (error, info) => {
        //     if (error) {
        //         console.log(error)
        //     } else {
        //         console.log('Email sent: ' + info.response)
        //         res.status(200).json({ msg: 'Email sent' })
        //     }
        // })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }
}


//send email to all participants (both individual and team) one after the other
const emailDumps = async (req, res) => {
    try {
        const team = await Team.find()
        const individual = await Individual.find()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        for (let i = 0; i < individual.length; i++) {
            const mailOptions = {
                from: process.env.EMAIL,
                to: individual[i].email,
                subject: 'Confirmation of Registration and Submission Requirements',
                html: `<p>This is to notify you of your successful application to participate in the first stage of EPEX 2023.</p>
                <p> You are hereby required to IMMEDIATELY do the following:<br></p>
                <p><ol>
                <li>Take a snapshot of yourself and post on Instagram, Twitter or LinkedIn with the following caption “I have just been shortlisted to participate in the Engineering Projects Exhibition organized by the NUESA University of Ilorin Chapter tagged EPEX 2023, and I am excited to showcase my innovative skills” with the hashtags #EPEX2023, #EPEXSERIES, #EPEXNUESAUNILORIN, #UNILORIN, #epex, #tech, #exhibition.
                Also, post the EPEX flyer attached to the email, together with the link to the prospectus alongside with your picture, and tag @epexseries on any of the media.</li> <br>
                <li>Join the WhatsApp group for the participants through this <a href="https://chat.whatsapp.com/JbJBueP6xJ8D7LgJM8ZLRp">link</a> </li></p>
                <p>It is important to note that your performance at the virtual preliminary stages will qualify you for the physical final stage, so we encourage you to give the preliminary stages your best effort.</p>
                <p>Here’s the link to the prospectus and the EPEX flyer attached:<br>
                <a href="bit.ly/EPEX_2023_Info_Packet">bit.ly/EPEX_2023_Info_Packet</a></p>
                <p>Further Information would be communicated to you. <br>
                Once again, welcome to the Engineering Projects Exhibition 2023. We are glad to have you!<p>
                <p>EPEX 2023 ORGANIZING COMMITTEE…</p>`,
                attachments: [{
                    filename: 'flyer.jpg',
                    path: './images/flyer.jpg',
                    cid: 'flyer'
                }]
            }

            for (let i = 0; i < team.length; i++) {
                const mailOptions2 = {
                    from: process.env.EMAIL,
                    to: team[i].members[0].email,
                    subject: 'Confirmation of Registration and Submission Requirements',
                    html: `<p>This is to notify you of your successful application to participate in the first stage of EPEX 2023.</p>
                    <p> You are hereby required to IMMEDIATELY do the following:<br></p>
                    <p><ol>
                    <li>Take a snapshot of yourself and post on Instagram, Twitter or LinkedIn with the following caption “I have just been shortlisted to participate in the Engineering Projects Exhibition organized by the NUESA University of Ilorin Chapter tagged EPEX 2023, and I am excited to showcase my innovative skills” with the hashtags #EPEX2023, #EPEXSERIES, #EPEXNUESAUNILORIN, #UNILORIN, #epex, #tech, #exhibition.
                    Also, post the EPEX flyer attached to the email, together with the link to the prospectus alongside with your picture, and tag @epexseries on any of the media.</li> <br>
                    <li>Join the WhatsApp group for the participants through this <a href="https://chat.whatsapp.com/JbJBueP6xJ8D7LgJM8ZLRp">link</a> </li></p>
                    <p>It is important to note that your performance at the virtual preliminary stages will qualify you for the physical final stage, so we encourage you to give the preliminary stages your best effort.</p>
                    <p>Here’s the link to the prospectus and the EPEX flyer attached:<br>
                    <a href="bit.ly/EPEX_2023_Info_Packet">bit.ly/EPEX_2023_Info_Packet</a></p>
                    <p>Further Information would be communicated to you. <br>
                    Once again, welcome to the Engineering Projects Exhibition 2023. We are glad to have you!<p>
                    <p>EPEX 2023 ORGANIZING COMMITTEE…</p>`,
                    attachments: [{
                        filename: 'flyer.jpg',
                        path: './images/flyer.jpg',
                        cid: 'flyer'
                    }]
                }
                transporter.sendMail(mailOptions2, (error, info) => {
                    if (error) {
                        console.log(error)
                    }
                    else {
                        console.log('Email sent: ' + info.response)
                    }
                })
            }
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: error.message })
    }

}
module.exports = { registerIndividual, emailDumps, tagID, sendEmail, newMail, emailDump, emailDumpTeam, dumpTeam, dump, registerTeam, viewIndividuals, viewTeams, deleteIndividual, updateIndividual, deleteTeam, updateTeam, viewIndividual, viewTeam, viewRegistrations }