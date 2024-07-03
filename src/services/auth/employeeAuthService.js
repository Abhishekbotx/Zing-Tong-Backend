const { StatusCodes } = require("http-status-codes");
const ServiceError = require("../../utils/errors/ServiceError");
const UserAuthRepository = require("../../repository/Auth/userAuthRepository");
const { calculateDeliveryCharges } = require("../../utils/calculateDeliveryCharges");
const { OTP } = require("../../models");
const otpgenerator=require('otp-generator');
const User = require("../../models/User");
const bcrypt=require('bcryptjs');
const EmployeeAuthRepository = require("../../repository/Auth/employeeAuthRepository");
const employeeAuthRepository = new EmployeeAuthRepository()
class EmployeeAuthService {

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
            const userExists = await employeeAuthRepository.getEmployeeByEmail(email);
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

            const user = await employeeAuthRepository.createEmployee({ fullName: fullName, email: email, password: hashedPassword, image: imageSvg });
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
            const adminDetails = await employeeAuthRepository.getUserByEmail(email);
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
                email, otp,role:'Employee'
            }
            const otpBody = await OTP.create(payload)
            return otpBody

        } catch (error) {
            console.log("Something went wrong in the service layer");
            throw error
        }
    }

    async forgetPasswordEmployee(email) {
        try {
            if (!email) {
                throw new ServiceError(
                    'Validation Error',
                    'enter email  properly.',
                    StatusCodes.BAD_REQUEST
                );
            }
            console.log('after validation');
            const adminDetails = await employeeAuthRepository.getEmployeeByEmail(email);
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

            const adminDetails = await employeeAuthRepository.getEmployeeByToken(token);
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

    
    async getAllDeliveries() {
        try {

            const response = await employeeAuthRepository.getAllDeliveries();
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
    async getDeliveryById(id) {
        try {
            console.log('in delivery id:');
            const response = await employeeAuthRepository.getDeliveryById(id);
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

    async getEmployeeByEmail(email) {
        try {
            console.log('email in controller', email);
            const Admin = await employeeAuthRepository.getEmployeeByEmail(email)
            console.log('reviews in services', Admin)
            return Admin

        } catch (error) {
            console.log('error in addAsEmployee adminservice:', error);
            throw error;
        }
    }




}
module.exports = EmployeeAuthService