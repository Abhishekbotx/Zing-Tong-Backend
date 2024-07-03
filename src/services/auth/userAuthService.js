const { StatusCodes } = require("http-status-codes");
const ServiceError = require("../../utils/errors/ServiceError");
const UserAuthRepository = require("../../repository/Auth/userAuthRepository");
const { calculateDeliveryCharges } = require("../../utils/calculateDeliveryCharges");
const { OTP } = require("../../models");
const otpgenerator=require('otp-generator');
const User = require("../../models/User");
const bcrypt=require('bcryptjs')
const userAuthRepository = new UserAuthRepository()
class UserAuthService {

    async signup(data) {
        try {
            const { fullName, email, password, confirmPassword, otp } = data
            const otpNumber = Number(otp)
            console.log('logging otp:', otp);
            if (password !== confirmPassword) {
                throw new ServiceError(
                    'Password not Matching',
                    'Password and confirmPassword not Matching .',
                    StatusCodes.BAD_REQUEST
                );
            }
            console.log('data in services:', data)
            console.log("before finding email in service");
            const userExists = await userAuthRepository.getUserByEmail(email);
            if (userExists) {
                throw new ServiceError(
                    'User Already Present',
                    'User is already registered with this email. Please use a different email.',
                    StatusCodes.BAD_REQUEST
                );
            }

            const otpResponse = await OTP.findOne({ email: email }).sort({ createdAt: -1 }).limit(1);
            console.log('logging otp response:', otpResponse);
            // console.log('otp:', otp)
            if (!otpResponse || otpResponse.otp !== otpNumber) {
                throw new ServiceError(
                    'Invalid OTP',
                    'The OTP provided is invalid or has expired.',
                    StatusCodes.BAD_REQUEST
                );
            }
            console.log("after user find");
            const imageSvg = `https://api.dicebear.com/5.x/initials/svg?seed= ${fullName}`

            console.log('before hashing password')
            const hashedPassword = await bcrypt.hash(password, 10)
            console.log(hashedPassword);

            const user = await User.create({ fullName: fullName, email: email, password: hashedPassword, image: imageSvg });
            return user;
        } catch (error) {
            console.error("Something went wrong in the service layer:", error);
            throw error
        }
    }

    async signIn({ email, password }) {
        try {
            if (!email || !password) {
                throw new ServiceError(
                    'Validation Error',
                    'fill all details properly.',
                    StatusCodes.BAD_REQUEST
                );
            }
            console.log('after validation');
            const adminDetails = await authRepository.getUserByEmail(email);
            if (!adminDetails) {
                throw new ServiceError(
                    'Invalid Credentials',
                    'Email is not registerd as Admin or SubAdmin.',
                    StatusCodes.UNAUTHORIZED
                );
            }
            console.log('before bcrypt');
            const passwordcheck = await bcrypt.compare(password, adminDetails.password)
            console.log('before bcrypt');
            if (!passwordcheck) {
                throw new ServiceError(
                    'Password not Matching',
                    'Password and confirmPassword not Matching .',
                    StatusCodes.UNAUTHORIZED
                );
            }

            const payload = { email: adminDetails.email, id: adminDetails._id, role: adminDetails.accountType }
            console.log('beforer token generation');
            const token = createToken(payload, ADMIN_JWT_KEY, '1h');
            console.log('after token generation');
            // adminDetails.token =token
            // adminDetails.save()

            // console.log(adminDetails)
            // console.log('before returning token');
            return { token: token, success: true, id: adminDetails._id }
        } catch (error) {
            console.error("Something went wrong in the sign-in process:", error);
            throw error;
        }
    }

    async createOtp(email) {

        try {
            let otp = otpgenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });

            let result = await OTP.find({ email: email, otp: otp,role:'Employee' });

            while (result.length > 0) {
                otp = otpgenerator.generate(6, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false
                });
                result = await OTP.find({ email: email, otp: otp });
            }
            console.log('no result found', result)
            const payload = {
                email, otp,role:'User'
            }
            const otpBody = await OTP.create(payload)
            return otpBody

        } catch (error) {
            console.log("Something went wrong in the service layer");
            throw error
        }
    }

    async forgetPasswordAdmin(email) {
        try {
            if (!email) {
                throw new ServiceError(
                    'Validation Error',
                    'enter email  properly.',
                    StatusCodes.BAD_REQUEST
                );
            }
            console.log('after validation');
            const adminDetails = await authRepository.getAdminByEmail(email);
            if (!adminDetails) {
                throw new ServiceError(
                    'Email not registered as Admin or SubAdmin ',
                    'Email is not registerd as Admin or SubAdmin.',
                    StatusCodes.UNAUTHORIZED
                );
            }

            let otp = otpgenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });

            let result = await OTP.find({ email: email, otp: otp });

            while (result.length > 0) {
                otp = otpgenerator.generate(6, {
                    upperCaseAlphabets: false,
                    lowerCaseAlphabets: false,
                    specialChars: false
                });
                result = await OTP.find({ email: email, otp: otp });
            }
            console.log('no result found', result)
            const payload = {
                email, otp
            }
            const otpBody = await OTP.create(payload)
            if (!otpBody) {
                throw new ServiceError(
                    'otp not generated ',
                    'otp was not generated.',
                    StatusCodes.EXPECTATION_FAILED
                );
            }

            return 'otp generated successfully'


            // console.log(adminDetails)
            // console.log('before returning token');
            return token
        } catch (error) {
            console.error("Something went wrong in the sign-in process:", error);
            throw error;
        }
    }
    async verifyOtp(otp, email) {
        try {

            const response = await OTP.findOne({ otp: otp, email: email });
            if (!verifyOtp) {
                throw new ServiceError(
                    'Invalid otp',
                    'Otp is invalid.',
                    StatusCodes.UNAUTHORIZED
                );
            }

            return 'otp verified'


            // console.log(adminDetails)
            // console.log('before returning token');
            return 'adminToken reset successful'
        } catch (error) {
            console.error("Something went wrong in the sign-in process:", error);
            throw error;
        }
    }


    async signOut(token) {
        try {

            const adminDetails = await authRepository.getAdminByToken(token);
            if (!adminDetails) {
                throw new ServiceError(
                    'Invalid Credentials',
                    'Email is not registerd as Admin or SubAdmin.',
                    StatusCodes.UNAUTHORIZED
                );
            }
            adminDetails.token = ''


            // console.log(adminDetails)
            // console.log('before returning token');
            return 'adminToken reset successful'
        } catch (error) {
            console.error("Something went wrong in the sign-in process:", error);
            throw error;
        }
    }

    
    async getAllUsers() {
        try {

            const response = await userAuthRepository.getAllUsers();
            if (!response) {
                throw new ServiceError(
                    'Unable to fetch users',
                    'Error in fetching users',
                    StatusCodes.BAD_REQUEST
                );
            }
            return response;
        } catch (error) {
            console.error("Something went wrong in the service layer:", error);
            throw error
        }
    }

    async getUserByEmail(email) {
        try {
            console.log('email in controller', email);
            const Admin = await userAuthRepository.getUserByEmail(email)
            console.log('reviews in services', Admin)
            return Admin

        } catch (error) {
            console.log('error in addAsEmployee adminservice:', error);
            throw error;
        }
    }


    async pickupAndDeliver(data) {
        try {
            const { PickupPoint, ContactNumber1, OrderNumber, ContactPerson, PBFM, Price, DroppingPoint, ContactNumber2, AdditionalDetails } = data

            const AmountToPay = await calculateDeliveryCharges(parseInt(Price), 20, '2024-07-02T19:30:00')


            // const Payment = await Payment()

            // if (!Payment.success) {
            //     throw new ServiceError(
            //         'Payment was not recieved',
            //         'If your payment was deducted it will refelect in your account in 2-3 working days.',
            //         StatusCodes.BAD_REQUEST
            //     );
            // }

            const response = await userAuthRepository.createPickupAndDelivery({
                PickupPoint: PickupPoint,
                ContactNumber1,
                Order: OrderNumber,
                ContactPerson,
                PBFM,
                Price,
                DroppingPoint,
                ContactNumber2,
                AdditionalDetails,
                AmountToPay: AmountToPay

            })
            return response // Have to put all the entries ↗️

        } catch (error) {
            throw error
        }
    }


    async  SendPackageAtConvenience(data) {
    try {
        const { PickupPoint, ContactPerson, ContactNumber1, AdditionalDetails1, DroppingPoint, ContactNumber2, AdditionalDetails2 } = data;
        console.log('data in services:',data);
        const basePrice = 50; // Example base price
        const distance = 10;  // Example distance, replace with actual logic to calculate distance
        const dateTime = new Date().toISOString();  // Current date and time

        const AmountToPay = calculateDeliveryCharges(basePrice, distance, dateTime);
        console.log('amount to pay:',AmountToPay);

        // const Payment = await processPayment(AmountToPay); // Implement your payment logic

        // if (!Payment.success) {
        //     throw new ServiceError(
        //         'Payment was not received',
        //         'If your payment was deducted it will reflect in your account in 2-3 working days.',
        //         StatusCodes.BAD_REQUEST
        //     );
        // }

        const response = await userAuthRepository.SendPackageAtConvenience({
            PickupPoint,
            // PickupPincode,
            ContactPerson,
            ContactNumber1,
            AdditionalDetails1,
            DroppingPoint,
            ContactNumber2,
            AdditionalDetails2,
            AmountToPay
        });

        console.log('reesponse in sendpackage services:',response);

        return response;

    } catch (error) {
        throw error;
    }
}
}
module.exports = UserAuthService