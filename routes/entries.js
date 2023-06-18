const express = require('express')
const router = express.Router()

const { registerIndividual, registerTeam, sendEmail, emailDumps, dumpTeam, dump, tagID, newMail, emailDump, emailDumpTeam } = require('../controllers/entries')


router.post('/register-individual', registerIndividual)
router.post('/register-team', registerTeam)
router.post('/email-dump', emailDump)
router.post('/email-dump-team', emailDumpTeam)
router.get('/dump', dump)
router.get('/dump-team', dumpTeam)
router.get('/send-email', sendEmail)
router.get('/tag-id', tagID)
router.get('/new-mail', newMail)
router.get('/email-dumps', emailDumps)


module.exports = router