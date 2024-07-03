const express = require('express');
const { getAllDeliveries, getDeliveryById, signup, signin, generateOtp } = require('../../controllers/Auth/employeeAuthController');
const { PackagingApproval, deliveryAcceptance } = require('../../controllers/employeeController');

const router = express.Router();
router.post(
    '/signup',
    signup
)

router.post(
    '/generateOtp',
    generateOtp)
router.post(
    '/signin',
    signin)

router.get(
    '/getAllDeliveries',
    // ValidateMiddleware(EmployeeSignupValidation),
    getAllDeliveries
);
router.post(
    '/deliveryAcceptance',
    // ValidateMiddleware(EmployeeSignupValidation),
    deliveryAcceptance
);
router.post(
    '/getDelivery',
    // ValidateMiddleware(EmployeeSignupValidation),
    getDeliveryById
);
router.post(
    '/packagingApprove',
    // ValidateMiddleware(EmployeeSignupValidation),
    PackagingApproval
);
router.post(
    '/onTheRoadApprove',
    // ValidateMiddleware(EmployeeSignupValidation),
    PackagingApproval
);
router.post(
    '/DeliveredApprove',
    // ValidateMiddleware(EmployeeSignupValidation),
    PackagingApproval
);
// router.post(
//     '/signin',
//     signin
// );
// // router.post(
// //     '/customerCheckIn',
// //     ValidateMiddleware(CustomerValidation),
// //     isAuthenticatedMid,
// //     cutomerCheckIn
// // );

// router.post(
//     '/generateOtp', 

//     generateOtp
// );
// router.post(
//     '/resetPassword/:token', 
//     resetPassword
// );
// router.post(
//     '/forgetPassword', forgetPasswordEmployee 

// );
// router.put(
//     '/updateProfile',isAuthenticatedMid, updateProfile

// );
// router.put(
//     '/updateDisplayPicture',isAuthenticatedMid, updateDisplayPicture

// );

// router.post( 
//     '/checkCustomerExists',isAuthenticatedMid, userExists

// );      
// router.post(
//     '/documentsVerify',documentsVerified 

// ); 
// router.post(
//     '/loanApproval',loanApproval

// );
// router.post(
//     '/loanSanctioned',loanSanctioned 

// );
// router.get(
//     '/getAllCustomers',isAuthenticatedMid, getAllCustomers

// );
// router.post(
//     '/getCustomerByEmployeeId',isAuthenticatedMid || isAuthenticatedMidAdmin, getCustomersByEmployeeId

// );
// router.post( 
//     '/updatePassword',isAuthenticatedMid,updatePassword

// );  

// router.post(
//     '/getEmployee',isAuthenticatedMid,getEmployeeProfile
// )
// router.post( 
//     '/getCustomerProfile',isAuthenticatedMid,getCustomerByItsId 

// );

// router.post(
//     '/uploadFetchReport',uploadCibilReport 

// );
// router.post(
//     '/checkIn',ValidateMiddleware(CheckInValidation),customerCheckIn

// ); 




module.exports = router;