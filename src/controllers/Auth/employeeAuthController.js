const { StatusCodes } = require("http-status-codes");
const EmployeeAuthService = require("./../../services/auth/employeeAuthService");
const employeeAuthService=new EmployeeAuthService()
const signup = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            confirmPassword,
            otp,
        } = req.body

        const response = await employeeAuthService.signup({
            fullName,
            email,
            password,
            confirmPassword,
            otp: otp
        });
        return res.status(StatusCodes.CREATED).json({
            message: 'User created successfully',
            success: true,
            data: response
        });
    } catch (error) {

        if (error.name == 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        }
        else {
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
        const response = await employeeAuthService.signIn({
            email: email,
            password: password
        });
        console.log('response in controller:', response);
        const options = {
            expires: new Date(Date.now() + 20 * 60 * 60 * 1000),
            httpOnly: true,
            sameSite: 'none',
            secure: true
        };

        if (response.success) {
            return res.cookie("token", response.token.toString(), options).status(200).json({
                success: true,
                token: response.token,
                message: `Employee Login Success`,
                user: email,
                empId: response.id
            });
        } else {
            return res.status(401).json({
                success: false,
                message: response.message
            });
        }
    } catch (error) {
        console.log("Something went wrong in the controller");
        if (error.name == 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
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
}

const generateOtp = async (req, res) => {
    try {
        console.log(req.body);

        const { email } = req.body;
        if (!email) {
            throw new AppError(
                'AppError',
                'Email not found',
                'Unable to fetch email',
                StatusCodes.NOT_ACCEPTABLE
            )
        }
        const otp = await employeeAuthService.createOtp(email)
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
const getAllDeliveries = async (req, res) => {
    try {

        const user = await employeeAuthService.getAllDeliveries()
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                data: user,
                message: "No user Found"
            })
        }

        return res.json({
            success: true,
            data: user,
            message: "Customers fetched successfully"
        })
    } catch (error) {
        if (error.name === 'AppError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
        else {
            return res.status(error.statusCode).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }

    }
}

const getDeliveryById = async (req, res) => {
    try {
        console.log('in delivery:',);
        const {id}=req.body;
        const user = await employeeAuthService.getDeliveryById(id)
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                data: user,
                message: "No user Found"
            })
        }

        return res.json({
            success: true,
            data: user,
            message: "Customers fetched successfully"
        })
    } catch (error) {
        if (error.name === 'AppError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
        else {
            return res.status(error.statusCode).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }

    }
}
const getCustomersByEmployeeId = async (req, res) => {
    try {

        const { id } = req.body
        console.log('id check in controller', id);
        const user = await employeeService.getCustomersByEmployeeId(id)
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                data: user,
                message: "No user Found"
            })
        }

        return res.json({
            success: true,
            data: user,
            message: "Customers fetched successfully"
        })
    } catch (error) {
        if (error.name === 'AppError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
        else {
            return res.status(error.statusCode).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
    }
}
const getCustomerByItsId = async (req, res) => {
    try {
        const { id } = req.body
        console.log('id in customer:', req.body);
        const user = await employeeService.getCustomer(id)
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                data: user,
                message: "No user Found"
            })
        }

        return res.json({
            success: true,
            data: user,
            message: "customer fetched successfully"
        })
    } catch (error) {
        if (error.name === 'AppError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explanation,
                data: {}
            });
        } else if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }
        else {
            return res.status(error.statusCode).json({
                message: error.message || 'Internal Server Error',
                success: false,
                error: error.explanation || 'Unknown error occurred',
                data: {}
            });
        }

    }
}

module.exports = { signup, signin, generateOtp,getDeliveryById, getAllDeliveries, getCustomerByItsId, getCustomersByEmployeeId }