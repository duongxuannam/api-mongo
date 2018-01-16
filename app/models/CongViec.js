const mongoose = require('mongoose');
const _ = require('lodash');

const Schema = mongoose.Schema;

const CongViecSchema = new Schema({
    tieude: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,//duy nhat
    },
    soluong: {
        type: Number,
        required: true,
    },
    mieuta: {
        type: String,
        required: true,
        minlength: 1,
    },
    diadiem: {
        type: String,
        trim: true,
    },
    _nguoidang: {
      
            type: Schema.Types.ObjectId,
            ref: 'TaiKhoan',
            required: true,
       

    },
});

CongViecSchema.methods.toJSON = function () {
    const congviec = this;
    const congviecObject = congviec.toObject();
    //ham pick lodashg chi lay 1 so thuoc tinh cua object
    return _.pick(congviecObject, ['_id', 'tieude', 'soluong', 'mieuta', 'diadiem', '_nguoidang']);
};

const CongViec = mongoose.model('CongViec', CongViecSchema);

module.exports = { CongViec }