const express = require('express');
const { PickupAndDeliver, SendPackageAtConvenience, signup, generateOtp } = require('../../controllers/Auth/userAuthController');
const router = express.Router();

router.post('/delivery',PickupAndDeliver)
router.post('/sendpackage',SendPackageAtConvenience)
router.post('/signup',signup)
router.post('/generateOtp',generateOtp)

module.exports = router;