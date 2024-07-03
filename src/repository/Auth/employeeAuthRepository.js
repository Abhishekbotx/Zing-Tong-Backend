const { Employee } = require("../../models");
const Delivery = require("../../models/deliveries");
const PickupAndDelivery = require("../../models/deliveries");
const SendPackageAtConvenience = require("../../models/SendPackageAtConvenience");
const User = require("../../models/User");

class EmployeeAuthRepository{
    // async createSubAdmin(userData) {
    //     try {
    //         const user = await Admin.create(userData);
    //         console.log('user:',user)
    //         return user;
    //     } catch (error) {
            
    //         console.log("Something went wrong on the repository layer",error);

    //         throw error;
    //     }
    // }



    async getEmployeeByEmail(email) { 
        try {
            const employee = await Employee.findOne({email:email});
            return employee;
        } catch (error) {
 
            console.log("Something went wrong on the repository layer");
            console.log("error name:", error.name);
            throw error;
        }
    }
    async getEmployeeByToken(token) { 
        try {
            const employee = await Employee.findOne({token:token});
            return employee;
        } catch (error) {
 
            console.log("Something went wrong on the repository layer");
            console.log("error name:", error.name);
            throw error;
        }
    }
    async createEmployee(data) { 
        try {
            const employee = await Employee.create(data);
            return employee;
        } catch (error) {
 
            console.log("Something went wrong on the repository layer");
            console.log("error name:", error.name);
            throw error;
        }
    }

    async getEmployeeById(userId) {
        try {
            const user = await User.findById(userId);
            console.log('user:',user)
            return user;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new ValidationError(error.errors);
            } 
            console.log("Something went wrong on the repository layer");
            console.log("error name:", error.name);
            throw error;
        }
    }
    

    async getAllDeliveries() { 
        try {
             const response= await Delivery.find();
             return response
        } catch (error) {
            console.error("Error occurred while fetching subadmins in repository layer:", error);
            throw new AppError(
                'FetchSubAdmins Error',
                'Error occurred while deleting user',
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }


    async getDeliveryById(id) { 
        try {
             const response= await Delivery.findById(id);
             return response
        } catch (error) {
            console.error("Error occurred while fetching subadmins in repository layer:", error);
            throw new AppError(
                'FetchSubAdmins Error',
                'Error occurred while deleting user',
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    


    async update(data) {
        try {
            const user = await User.findOneAndUpdate(
                { email: data.email },
                { $set: { token: data.token } },
                { new: true }
            );
            if (!user) {
                throw new AppError(
                    'UserNotFoundError',
                    'User not found',
                    `User with email ${data.email} not found`,
                    StatusCodes.NOT_FOUND
                );
            }

            return user;
        } catch (error) {
            console.error("Error occurred while updating user in repository layer:", error);
            throw new AppError(
                'UpdateUserError',
                'Error occurred while updating user',
                error.message,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }



    async createPickupAndDelivery(data){
        console.log(data);
        try {
            const response=await PickupAndDelivery.create(data)
            // console.log('response in repo:',response);
            return response 
        } catch (error) {
            
        }
    }
    async SendPackageAtConvenience(data){
        console.log(data);
        try {
            const response=await PickupAndDelivery.create(data)
            console.log('response in repo:',response);
            return response 
        } catch (error) {
            throw error
        }
    }
}

module.exports=EmployeeAuthRepository