const Delivery = require("../../models/deliveries");
const PickupAndDelivery = require("../../models/deliveries");
const SendPackageAtConvenience = require("../../models/SendPackageAtConvenience");
const User = require("../../models/User");

class UserAuthRepository{
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

    // async getUserByToken(token) {
    //     try {
    //         console.log('token in repo',token)
    //         const admin = await Admin.findOne({token:token});
    //         console.log('Admin info in repository:',admin)
    //         // if (admin && admin.image) {
    //         //     const initialPath = 'C:\\Users\\abhis\\Desktop\\FinMap\\src\\services';
    //         //     const replacedPath = admin.image.replace(initialPath, '');
            
    //         //     console.log('Replaced image destination:', replacedPath);
    //         // }
    //         admin.password='dummypassword'
    //         return admin;
    //     } catch (error) {
    //         // if (error.name === 'ValidationError') {
    //         //     'error in finding admin'
    //         // } 
    //         console.log("Something went wrong on the repository layer");
    //         console.log("error name:", error.name);
    //         throw error;
    //     }
    // }

    async createUser(data) { 
        try {
            const user = await User.create(data);
            return user;
        } catch (error) {
 
            console.log("Something went wrong on the repository layer");
            console.log("error name:", error.name);
            throw error;
        }
    }

    async getUserByEmail(email) { 
        try {
            const user = await User.findOne({email:email});
            return user;
        } catch (error) {
 
            console.log("Something went wrong on the repository layer");
            console.log("error name:", error.name);
            throw error;
        }
    }

    async getUserById(userId) {
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
    

    async getAllUsers() { 
        try {
             const response= await User.find();
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
            const response=await Delivery.create(data)
            // console.log('response in repo:',response);
            return response 
        } catch (error) {
            
        }
    }
    async SendPackageAtConvenience(data){
        console.log(data);
        try {
            const response=await Delivery.create(data)
            console.log('response in repo:',response);
            return response 
        } catch (error) {
            throw error
        }
    }
}

module.exports=UserAuthRepository