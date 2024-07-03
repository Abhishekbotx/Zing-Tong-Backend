const { StatusCodes } = require("http-status-codes");
const UserAuthService = require("../../services/auth/userAuthService");
const userAuthService = new UserAuthService()
const signup = async (req, res) => {
    try {
        const { email, password, fullName, otp,confirmPassword } = req.body;
        const response = await userAuthService.signup({ email, password, confirmPassword, fullName, otp });
        console.log('response in controller:', response);

        const options = {
            expires: new Date(Date.now() + 20 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        };



        if (response) {
            return res.cookie("adminToken", response.token, options).status(200).json({
                success: true,
                message: `Congratulations your account was created  Successfully`,

            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'unable to signup, something went wrong'
            });
        }
    } catch (error) {
        if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}

const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await userAuthService.signIn({ email, password });
        console.log('response in controller:', response);

        const options = {
            expires: new Date(Date.now() + 20 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        };


        // res.cookie('adminToken', response.toString(), options).status(200).json({
        //     success: true,
        //     message: 'Admin login successful',
        //     token:response,
        //     user:email

        // });

        if (response.success) {
            return res.cookie("userToken", response.token.toString(), options).status(200).json({
                success: true,
                token: response.token,
                message: `User Login Success`,
                user: email,
                adminId: response.id
            });
        } else {
            return res.status(401).json({
                success: false,
                message: response.message
            });
        }
    } catch (error) {
        if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}


const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await userAuthService.forgetPasswordAdmin(email);
        console.log('response in controller:', response);

        // const options = {
        //     expires: new Date(Date.now() + 500001000),
        //     httpOnly: true,
        //     sameSite: 'none',
        //     secure: true
        // };


        res.cookie('token', response.toString()).status(200).json({
            success: true,
            message: 'Admin login successful',

        });
    } catch (error) {
        if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}
const verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const response = await userAuthService.verifyOtp(otp);

        console.log('response in controller:', response);

        // const options = {
        //     expires: new Date(Date.now() + 500001000),
        //     httpOnly: true,
        //     sameSite: 'none',
        //     secure: true
        // };


        res.cookie('token', response.toString()).status(200).json({
            success: true,
            message: 'otp verification successful',

        });
    } catch (error) {
        if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}

const generateOtp = async (req, res) => {
    try {
        // console.log(req.body);

        const { email } = req.body;
        if (!email) {
            throw new AppError(
                'AppError',
                'Email not found',
                'Unable to fetch email',
                StatusCodes.NOT_ACCEPTABLE
            )
        }
        const otp = await userAuthService.createOtp(email)
        console.log('otpresponse:', otp)
        return res.json({
            data: otp,
            message: "otp created successfully"
        })
    } catch (error) {
        if (error.name === 'AppError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        }
        console.log("Something went wrong in the controller");
        throw error
    }
}


const signout = async (req, res) => {
    try {
        console.log('Request cookies:', req.cookies.token)
        const options = {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        };
        // console.log('Request token :',req.token)
        // const adminId = req.cookies.token.id   

        /*
         const options = {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        success: true,
        message: "User logged out successfully",
      });
        */
        console.log('logging before authadminservice');
        // const adminDetails = await adminAuthService.signOut(req.cookies.token)
        // const options = {
        //     httpOnly: true,
        //     secure: true,
        // };
        return res
            .status(200)
            .clearCookie("token", options)
            // .clearCookie("refreshToken", options)
            .json({
                success: true,
                message: "User logged out successfully",
            })
    } catch (error) {
        if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}



const getProfile = async (req, res) => {
    try {
        const { email } = req.body;
        // console.log('token in getprofile controller.js', token);
        console.log('req.body', req.body)
        const response = await adminAuthService.getAdmin(email);

        console.log(response)
        res.json({
            success: true,
            message: 'status changed to Active employee successfully',
            data: response
        });
    } catch (error) {
        if (error.name == 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explaination,
                data: {}
            });
        } else {
            console.error('Error in controller:', error.name);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
};



// const getAllSubAdmin = async (req, res) => {
//     try {
//         console.log('entered in controller of subadmin');
//         const response = await adminAuthService.getAllSubAdmin();
//         return res.status(StatusCodes.CREATED).json({
//             message: 'subAdmin created successfully',
//             success: true,
//             data: response
//         });
//     } catch (error) {

//         if (error.name == 'ServiceError') {
//             return res.status(error.statusCode).json({
//                 message: error.message,
//                 success: false,
//                 error: error.explaination,
//                 data: {}
//             });
//         }
//         else {
//             console.error('Error in controller:', error);
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 message: error.message || 'Internal Server Error',
//                 success: false,
//                 error: error.explanation || 'Unknown error occurred',
//                 data: {}
//             });
//         }
//     }
// }

const PickupAndDeliver = async (req, res) => {
    try {
        console.log('entry in pickupanddelivery');
        const data = req.body
        const response = await userAuthService.pickupAndDeliver(data)
        console.log('response:', response);
        return res.status(StatusCodes.OK).json({
            success: true,
            response: response
        })
    } catch (error) {

        if (error.name == 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explaination,
                data: {}
            });
        }
        else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}

const SendPackageAtConvenience = async (req, res) => {
    try {
        const data = req.body
        const response = await userAuthService.SendPackageAtConvenience(data)
        return res.status(StatusCodes.OK).json({
            success: true,
            response: response
        })
    } catch (error) {

        if (error.name == 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explaination,
                data: {}
            });
        }
        else {
            console.error('Error in controller:', error);
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}



module.exports = {
    signin,
    signup,
    PickupAndDeliver,
    SendPackageAtConvenience,
    generateOtp,
    signout,
    forgetPassword,
    verifyOtp
}