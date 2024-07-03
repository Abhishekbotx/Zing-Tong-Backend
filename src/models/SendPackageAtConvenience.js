const mongoose = require('mongoose')
const SendPackageAtConvenience = new mongoose.Schema({
PickupPoint:{
    type:String,
    required:true,
},
PickupPincode:{
    type:String,
    required:true,
},
ContactNumber1:{
    type:String,
    required:true,
},
AdditionalDetails:{
    type:String,

},

DroppingPoint:{
    type:String,
    required:true,
},
ContactPerson:{
    type:String,
    required:true,
},
ContactNumber2:{
    type:String,
    required:true,
},

AdditionalDetails2:{
    type:String,

}
},{timestamps: true})

module.exports = mongoose.model('SendPackageAtConvenience', SendPackageAtConvenience)