const mongoose = require('mongoose');
const _ = require('lodash');

const Schema = mongoose.Schema;

const TaiKhoanSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,//duy nhat
    },
    matkhau:{
        type: String
    },
    hoten: {
        type: String,
    },
    _congviecdadang: {
        type: [{ type: Schema.Types.ObjectId, ref: 'CongViec' }]
    },
    _congviecdanop: {
        type: [{ type: Schema.Types.ObjectId, ref: 'CongViec' }]
    },
    // tokens: [{
    //     access: {
    //         type: String,
    //         required: true
    //     },
    //     token: {
    //         type: String,
    //         required: true
    //     }
    // }]
        

});

TaiKhoanSchema.methods.toJSON = function () {
    const taikhoan = this;
    const taikhoanObject = taikhoan.toObject();
    //ham pick lodashg chi lay 1 so thuoc tinh cua object
    return _.pick(taikhoanObject, ['_id', 'email', 'hoten','_congviecdadang','_congviecdanop']);
};

const TaiKhoan = mongoose.model('TaiKhoan', TaiKhoanSchema);

module.exports = { TaiKhoan }