const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./app/models/db');
const { CongViec } = require('./app/models/CongViec');
const { TaiKhoan } = require('./app/models/TaiKhoan');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//khai bao port
const PORT = process.env.PORT || 1995;






//middleware
app.use((req, res, next) => {
    console.log('middleware ne');
    next();
});


//----------------------------------------test------------------------
app.get('/', (req, res) => {
    res.send('ahihi');
});
//test lay tong danh sasch cong viec
app.get('/tatcacongviec', (req, res) => {
    CongViec.find().count().then((congviec) => {
        res.send({ tongcongviec3: congviec });
    }, e => {
        res.status(400).send(e);
    });
});
//test lấy 1 cong viec theo id
app.get('/testcongviec/:id', (req, res) => {
    const id = req.params.id;



    CongViec.findById(id).then((congviec) => {
        if (!congviec) {
            return res.status(404).send({ thongbao: 'Không tìm thấy công việc' });
        }

        res.send({ congviec });
    }).catch((e) => {
        res.status(400).send({ thongbao: 'Lỗi CSDL' });
    });
});


//-------------------CRUD(create- read - update- delete)----------------




//them 1 tai khoan
app.post('/taikhoan', (req, res) => {
    const taikhoan = new TaiKhoan({
        email: req.body.email,
        hoten: req.body.hoten,
    });
    console.log(taikhoan)
    taikhoan.save().then((doc) => {
        res.send({ thongbao: "ok" });
    }, (e) => {
        res.status(400).send(e);
    });
});









// lay viec theo id

app.get('/testtimviec/:id', (req, res) => {

    CongViec.findOne({ _id: req.params.id }).populate('_nguoidang').exec(function (err, cv) {
        if (err) throw err;
        console.log(cv);
        res.send(cv);
    });
});

//tim viec theo dia diem

app.get('/testtimviecdiadiem', (req, res) => {

    CongViec.find({ 'diadiem': /test/ }).populate('_nguoidang').then((data) => {
        res.send(data);
    })
});



///lay tai khoan theo id

app.get('/testtimnguoi/:id', (req, res) => {

    TaiKhoan.findOne({ _id: req.params.id }).populate('_congviecdadang').exec(function (err, cv) {
        if (err) throw err;
        console.log(cv);
        res.send(cv);
    });
});



//them nguoi theo doi
app.get('/themnguoitheodoi', (req, res) => {

    TaiKhoan.update({ _id: '5a5d55c4c9532a05ccfe051c' }, { $push: { _congviecdanop: '5a5d6c9426e21714384ff1e6' } }, (err, cv) => {
        console.log(cv)
        res.send({ thongbao: "ok" });
    });

}, (e) => {
    res.status(400).send(e);
});


/////////////////////CONGVIEC HERE-------------------------


// them 1 cong viec
app.post('/congviec', (req, res) => {
    //tao va luu cong viec
    const congviec = new CongViec({
        tencongty: req.body.tencongty,
        tieude: req.body.tieude,
        soluong: req.body.soluong,
        mieuta: req.body.mieuta,
        diadiem: req.body.diadiem,
        chuyennganh: req.body.chuyennganh,
        _nguoidang: req.body._nguoidang
    });
    console.log(congviec)
    congviec.save().then((cv) => {
        //them id cua cong viec vao  _congviecdadang cua colection taikhoan 
        TaiKhoan.update({ _id: req.body._nguoidang }, { $push: { _congviecdadang: cv._id } }, (err, cv) => {
            res.send({ thongbao: "ok" });
        });

    }, (e) => {
        res.status(400).send(e);
    })
});


//lay 3 cong viec trang chu

app.get('/trangchu', (req, res) => {
    CongViec.find().sort({ ngaydang: -1 }).limit(3).then((data) => {
        res.send(data);
    })
});


//lay danh sach cong viec moi nhat theo trang
app.get('/danhsachcongviec/:sotrang', (req, res) => {
    const skip = (req.params.sotrang - 1) * 5;
    CongViec.find().sort({ ngaydang: -1 }).limit(5).skip(skip).then((data) => {
        res.send(data);
    })
});


///lay cong viec theo id

app.get('/congviec/:id', (req, res) => {
    CongViec.findOneAndUpdate({ _id: req.params.id }, { $inc: { luotxem: 1 } }).populate('_nguoidang').then((data) => {
        res.send(data);
    })

})









//-----------------------------------chay server----------------------------
app.listen(PORT, () => console.log('from 1995 with love'))