const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./app/models/db');
const { CongViec } = require('./app/models/CongViec');

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

//them 1
app.post('/congviec', (req, res) => {
    const congviec = new CongViec({
        tieude: req.body.tieude,
        soluong: req.body.soluong,
        mieuta: req.body.mieuta,
        diadiem: req.body.diadiem
    });
    console.log(congviec)
    congviec.save().then((doc) => {
        res.send({ thongbao: "ok" });
    }, (e) => {
        res.status(400).send(e);
    });
});

//chay server
app.listen(PORT, () => console.log('from 1995 with love'))