const { StatusCodes } = require('http-status-codes');
const { AppError } = require('../utils/errors/index.js');
const fs = require('fs');
const EmployeeService = require('../services/employeeService.js');

const employeeService = new EmployeeService();

const deliveryAcceptance = async (req, res) => {
    try {
        const {deliveryId,deliveryPersonId} = req.body;
        console.log('data in services:',deliveryId,deliveryPersonId);
        // const deliveryManId = req.employee.id;
        const response = await employeeService.deliveryAcceptance(deliveryId, deliveryPersonId );
        return res.status(StatusCodes.OK).json({
            message: 'customer checkedIn successfully',
            success: true,
            data: response
        });
    } catch (error) {
        if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explaination,
                data: {}
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong',
            success: false,
            error: error.message,
            data: {}
        });
    }
};
const PackagingApproval = async (req, res) => {
    try {
        const { id } = req.body;
        console.log('request body:', req.body);
        // const deliveryManId = req.employee.id;
        console.log('in packaging controller');
        const response = await employeeService.PackagingApprove(id);
        return res.status(StatusCodes.OK).json({
            message: 'customer checkedIn successfully',
            success: true,
            data: response
        });
    } catch (error) {
        if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explaination,
                data: {}
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong',
            success: false,
            error: error.message,
            data: {}
        });
    }
}
const OnTheRoadApproval = async (req, res) => {
    try {
        const { id } = req.body;
        console.log('request body:', req.body);
        // const deliveryManId = req.employee.id;
        console.log('in packaging controller');
        const response = await employeeService.OnTheRoadApprove(id);
        return res.status(StatusCodes.OK).json({
            message: 'customer checkedIn successfully',
            success: true,
            data: response
        });
    } catch (error) {
        if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explaination,
                data: {}
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong',
            success: false,
            error: error.message,
            data: {}
        });
    }
}
const DeliveredApproval = async (req, res) => {
    try {
        const { id } = req.body;
        console.log('request body:', req.body);
        // const deliveryManId = req.employee.id;
        console.log('in packaging controller');
        const response = await employeeService.DeliveredApprove(id);
        return res.status(StatusCodes.OK).json({
            message: 'customer checkedIn successfully',
            success: true,
            data: response
        });
    } catch (error) {
        if (error.name === 'ServiceError') {
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                error: error.explaination,
                data: {}
            });
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Something went wrong',
            success: false,
            error: error.message,
            data: {}
        });
    }
};












module.exports = { deliveryAcceptance, PackagingApproval, OnTheRoadApproval, DeliveredApproval } 