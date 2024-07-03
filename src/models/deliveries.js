const mongoose = require('mongoose')
const Delivery = new mongoose.Schema({
    PickupPoint: {
        type: String,
        required: true,
    },
    // PickupPincode: {
    //     type: String,
    //     required: true,
    // },
    ContactNumber1: {
        type: String,
        required: true,
    },
    Order: {
        type: String,
        // required: true,
    },
    ContactPerson: {
        type: String,
        required: true,
    },

    PBFM: {
        type: String,
        // required: true,
    },
    Price: {
        type: String,
        // required: true, 
    },

    DroppingPoint: {
        type: String,
        required: true,
    },
    ContactNumber2: {
        type: String,
        required: true,
    },
    AmountToPay: {
        type: Number,
        required: true,
    },
    AdditionalDetails: {
        type: String,

    },
    OrderPlaced:{
        type:Boolean,
        default:true
    },
    Packaging:{
        type:Boolean,
        default:false
    },
    OnTheRoad:{
        type:Boolean,
        default:false
    },
    Delivered:{
        type:Boolean,
        default:false
    },
    DeliveryPersonId:{
        type: String,
        default:''
    }
}, { timestamps: true })

module.exports = mongoose.model('Delivery', Delivery)