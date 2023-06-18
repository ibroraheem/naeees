const express = require('express')
const router = express.Router()

const { register, login } = require('../controllers/admin')
const { viewIndividuals, viewTeams, deleteIndividual, updateIndividual, deleteTeam, updateTeam, viewIndividual, viewTeam, viewRegistrations } = require('../controllers/entries')

router.post('/register', register)
router.post('/login', login)
router.get('/view-individuals', viewIndividuals)
router.get('/view-teams', viewTeams)
router.get('/view-individual/:id', viewIndividual)
router.get('/view-team/:id', viewTeam)
router.delete('/delete-individual/:id', deleteIndividual)
router.delete('/delete-team/:id', deleteTeam)
router.patch('/update-individual/:id', updateIndividual)
router.patch('/update-team/:id', updateTeam)
router.get('/view-registrations', viewRegistrations)


module.exports = router