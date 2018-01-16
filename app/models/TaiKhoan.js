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
    hoten: {
        type: String,
        required: true,
    },
    _congviecdadang: {
        type: [{ type: Schema.Types.ObjectId, ref: 'CongViec' }]
    }
});

// TaiKhoanSchema.methods.toJSON = function () {
//     const taikhoan = this;
//     const taikhoanObject = taikhoan.toObject();
//     //ham pick lodashg chi lay 1 so thuoc tinh cua object
//     return _.pick(taikhoanObject, ['_id', 'email', 'hoten', 'congviecdadang']);
// };

const TaiKhoan = mongoose.model('TaiKhoan', TaiKhoanSchema);

module.exports = { TaiKhoan }