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


//test
app.get('/', (req, res) => {
    res.send('ahihi');
});


//CRUD(create- read - update- delete)

//lay danh sasch
app.get('/congviec', (req, res) => {
    CongViec.find().then((congviec) => {
        res.send({ congviec });
    }, e => {
        res.status(400).send(e);
    });
});


//lấy 1
app.get('/congviec/:id', (req, res) => {
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

//them 1 cong viec
app.post('/congviec', (req, res) => {
    //tao va luu cong viec
    const congviec = new CongViec({
        tieude: req.body.tieude,
        soluong: req.body.soluong,
        mieuta: req.body.mieuta,
        diadiem: req.body.diadiem,
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


///lay tai khoan theo id

app.get('/testtimnguoi/:id', (req, res) => {

    TaiKhoan.findOne({ _id: req.params.id }).populate('_congviecdadang').exec(function (err, cv) {
        if (err) throw err;
        console.log(cv);
        res.send(cv);
    });
});








//chay server
app.listen(PORT, () => console.log('from 1995 with love'))