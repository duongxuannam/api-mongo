const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cloudinary = require('cloudinary');
const bcrypt = require('bcryptjs');
const { mongoose } = require('./app/models/db');
const { CongViec } = require('./app/models/CongViec');
const { TaiKhoan } = require('./app/models/TaiKhoan');

cloudinary.config({
    cloud_name: 'thuctap',
    api_key: '586676579855377',
    api_secret: 'IJuf1j4hbInzcUfNSU2lMnGT5vI'
})
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//khai bao port
const PORT = process.env.PORT || 1995;

// test noti


var sendNotification = function(data) {
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic ODY0YWIxOGItNTY3MC00MzAzLWE5ZDQtZjA4Y2MzMjQ5YjE5"
    };
    
    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
    
    var https = require('https');
    var req = https.request(options, function(res) {  
      res.on('data', function(data) {
        console.log("Response:");
        console.log(JSON.parse(data));
      });
    });
    
    req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();
  };
  
  var messageWeb = { 
    app_id: "f4318781-c9c6-4ab2-b805-7975e030c9b9",
    contents: {"en": "Có tin tức mới"},
    included_segments: ["All"],
    isChromeWeb: true,
    headings: {"en": "Thông báo" },
    url: "https://thuctap-web.herokuapp.com/tintuc"

  };
  var messageAndroid = { 
    app_id: "f4318781-c9c6-4ab2-b805-7975e030c9b9",
    contents: {"en": "Có tin tức mới"},
    included_segments: ["All"],
    isAndroid: true,
    headings: {"en": "Thông báo" },
  

  };
 // sendNotification(message);
 // -- them thong bao
 app.get('/themthongbao', function (req, res) {
    // res.sendFile(path.resolve(__dirname, './public/dangnhap.png'));
    sendNotification(messageWeb);
    sendNotification(messageAndroid);
    res.send({ 'aa': 'ok'})
})

//-----------------------UP HINH LEN CLOUD

// cloudinary.uploader.upload("./public/logobu.jpg", function(result) { 
//     console.log(result) 
//   });
//-----------------dat ten
// cloudinary.uploader.upload(
//     "./public/logobu.jpg",
//     function(result) { console.log(result); },
//     {
//       public_id: 'default', 
//       crop: 'limit',
//       width: 2000,
//       height: 2000,                             

//     }      
//   )
//------------------------xóa 1 hình, muốn edit thì cứ đặt tên trùng thôi
// cloudinary.uploader.destroy('qfjixtwodb2oumqocnam', function(result) { console.log(result) });


// cloudinary.uploader.upload(
//     "./cty2.jpg",
//     function(result) { console.log(result); },
//     {
//       public_id: 'cty2',                     

//     }      
//   )

//   cloudinary.uploader.upload(
//     "./cty3.jpg",
//     function(result) { console.log(result); },
//     {
//       public_id: 'cty3',                     

//     }      
//   )
//   cloudinary.uploader.upload(
//     "./cty1.jpg",
//     function(result) { console.log(result); },
//     {
//       public_id: 'cty1',                     

//     }      
//   )
//--- gui thu cai hinh
app.get('/cloudinary', (req, res) => {
    res.send({ 'aa': cloudinary.image("default.jpg", { alt: "Sample Image" }) });
});
//middleware
app.use((req, res, next) => {
    console.log('middleware ne');
    next();
});
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


//----------------------------------------test------------------------
app.get('/', (req, res) => {
    res.send('ahihi');
});
//test gui hinh
// const hinh = require('./public/logobu.jpg')
app.get('/testcaihinh', function (req, res) {
    // res.sendFile(path.resolve(__dirname, './public/dangnhap.png'));
    res.send({ 'duong dan ne hihi': __dirname })
})

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
app.post('/dangky', (req, res) => {
    const taikhoan = new TaiKhoan({
        email: req.body.email,
        hoten: req.body.hoten,
        matkhau: req.body.matkhau,
        sodienthoai: req.body.sodienthoai
    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(taikhoan.matkhau, salt, (err, hash) => {
            taikhoan.matkhau = hash;
            console.log(taikhoan)
            taikhoan.save().then((doc) => {
                res.send({ taikhoan });
            }, (e) => {
                res.status(400).send(e);
            });
        });
    });

});


//dang nhap
app.post('/dangnhap', (req, res) => {
    const { email, matkhau } = req.body
    if(!matkhau){
       return res.status(204).send();
    };
    TaiKhoan.findOne({ email: req.body.email }).exec(function (err, taikhoan) {
        if(!taikhoan){
            return res.status(204).send();
        } 
        bcrypt.compare( req.body.matkhau, taikhoan.matkhau, (err, result) => {
            if (result) {
                res.send({ taikhoan });
            } else {
                return res.status(204).send();
            }
          });
    });
    // res.send({email,matkhau})
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


//---------------------------------nop ung tuyên
// app.post('/ungtuyen', (req, res) => {
//         const { _idCongViec, _idTaiKhoan } = req.body
//         CongViec.update({ _id: _idCongViec }, { $push: { _danhsachungtuyen: _idTaiKhoan },$inc: { danop: 1 } }, (err, cv) => {
//             res.send({ thongbao: "ok" });
//         });
    
//     }, (e) => {
//         res.status(400).send(e);
//     });
app.post('/ungtuyen', (req, res) => {
    const { _idCongViec, _idTaiKhoan } = req.body
    CongViec.update({ _id: _idCongViec }, { $push: { _danhsachungtuyen: _idTaiKhoan },$inc: { danop: 1 } })
    .then((result)=>{
        TaiKhoan.update({ _id: _idTaiKhoan }, { $push: { _congviecdaungtuyen: _idCongViec } }, (err, cv) => {
            res.send({ thongbao: "ok" });
        });
    }, (e) => {
        res.status(400).send(e);
    })
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
        _nguoidang: req.body._nguoidang,
        hinhanh: req.body.hinhanh
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