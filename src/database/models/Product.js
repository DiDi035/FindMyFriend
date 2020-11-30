const mongoose= require('mongoose')
const validator = require('validator')

const productSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    animal : {
        type : String,
        required : true,
    },
    breed : {
        type : String,
        required : true,
    },
    gender : {
        type : String,
        required : true,
        enum : ['Male','Female']
    },
    color : {
        type : String,
        required : true,
    },
    month : {
        type : Number,
        required : true,
        default : 0,
        validator(value){
            if (value<0) throw new Error ('Month must must be a positive number!')
        }
    },
    isHide:{
        type : Boolean,
        required : true,
        default : false, 
    },  
    isPurchase: { 
        type: Boolean,
        required: true,
        default:false,
    },
    image:[
        {type : Buffer}
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shop',
    },
    price: {
        type: mongoose.Schema.Types.Number,
        required: true,
        default: 0
    }

})

const Product = mongoose.model('Product',productSchema);

module.exports = Product