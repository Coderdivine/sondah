const express = require("express")
const app = express();
const cors = require("cors");
const port = process.env.PORT || 9099;
const mysql = require("mysql")
const db = mysql.createPool({
    user: "b2613c98a6a9ac",
    host: "us-cdbr-east-05.cleardb.net",
    password: "52be5f4b",
    database: "heroku_69680b6d25e2911"
});
const localValue = require("./local.json")
const multer = require("multer");
const nodemailer = require('nodemailer');
//sondah
//https://sondah.herokuapp.com
//mysql://b2613c98a6a9ac:52be5f4b@us-cdbr-east-05.cleardb.net/heroku_69680b6d25e2911?reconnect=true
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
//products
//contact
//order
//product-get
//product/:id
//contact-get;
//order-get;
const passwords ={
    "1":"chimdindu1234",
    "2":"chimdindu12345",
    "3":"chimdindu123",
    "4":"chimdindu1212"
}
app.use("/uploads", express.static("uploads"))
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().substring(0, 12) + file.originalname);

    }
})
const uploads = multer({ storage: storage });
let emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "axgurah@gmail.com",
        pass: "chimdindu@2"
    }
});
//post routes
//1
app.post("/suscribe",(req,res)=>{
    const {email,date}=req.body;
    db.query('INSERT INTO suscribe (email,date)VALUES(?,?)',[email,date],(err,result)=>{
            if(err){
                res.send("please check your internet connection")
            }else{
                res.send("Suscribed")
            }
    })
   
})
app.post("/order",(req,res)=>{
 const {firstname,lastname,email,phone,address,carts,date,delivery,additionalMessage,amount,discountCode,ide} = req.body;
 db.query('INSERT INTO order (firstname,lastname,email,phone,address,carts,date,delivery,additionalMessage,amount,discountCode,ide)VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',[firstname,lastname,email,phone,address,carts,date,delivery,additionalMessage,amount,discountCode,ide],(err,result)=>{
     if(err){
         res.send(err);
     }else{
        let messaged = {
            from: "axgurah@gmail.com",
            to: "axgurah@gmail.com",
            subject: `You have a new ORDER(BOOKING)`,
            html:`Order id:${ide}`
        };
        emailTransporter.sendMail(messaged, function (err, data) {
            if (err) {
                console.log(err);

            } else {
                res.send("Your request is being proccessed");
            }
        })
         res.send(`Order accepted check email for order id`);
     }
 })
});
//2
app.post("/products",(req,res)=>{
    const {name,des,total,sold,img_one,img_two,like,newprice,oldprice,category,date} = req.body;
    db.query('INSERT INTO products (name,des,total,sold,img_one,img_two,like,newprice,oldprice,category,date)VALUES(?,?,?,?,?,?,?,?,?,?,?)',[name,des,total,sold,img_one,img_two,like,newprice,oldprice,category,date],(err,result)=>{
        if(err){
            res.send(err);
        }else{
            res.send(`${name} product posted`);
        }
    })
   });
//3
app.post("/contact", (req,res)=>{
    const {firstname,lastname,email,message,date,orderId} = req.body;
    
    db.query('INSERT INTO contact (firstname,lastname,email,message,date,orderId)VALUES(?,?,?,?,?,?)',[firstname,lastname,email,message,date,orderId],(err,result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send("Message sent :)");
        }
    })
}
);
//
//
const deliverys ={
    gokada:"2",
    kwiki:"1",
    spatch:"3"
};
//get routes
app.get("/delivery",(req,res)=>{
    res.send(deliverys)
})
app.get("/localvalue",(req,res)=>{
  res.send(localValue)
})
app.get("/suscribe-get",(req,res)=>{
    const QUERY = `SELECT * FROM suscribe`;
   db.query(QUERY, (err, result) => {
    if (err) {
     res.send("Can't get email list at the moment")
    } else {
        res.send(result);
    }}) 
})
app.get("/product-get",(res,req)=>{
   const QUERY = `SELECT * FROM products`;
   db.query(QUERY, (err, result) => {
    if (err) {
     res.send("Can't get product a the moment please check your internet connection.")
    } else {
        res.send(result);
    }})
});
app.get("/products-id/:id",(req,res)=>{
    const {id} = req.params;
    db.query(`SELECT * FROM products WHERE (id = ${id})`,(err,result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result)
        }
    })
});
app.get("/contact-get",(req,res)=>{
     const QUERY = `SELECT * FROM contact`;
     db.query(QUERY,(err,result)=>{
        if(err){
            res.send(err);
        }
        else{
            res.send(result)
        }
     })
});
app.get("/order-get",(req,res)=>{
    const QUERY = `SELECT * FROM order`;
    db.query(QUERY,(err,result)=>{
       if(err){
           res.send(err);
       }
       else{
           res.send(result)
       }
    })
});
//
//
//updates
app.get("/product-liked/:id",(req,res)=>{
    const {id,like} = req.params;
  //  const QUERY = `SELECT * FROM products`;
    db.query(`UPDATE products SET like = ? WHERE id = ?`,[like,id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send("updated");
        }
    })
});
app.get("/product-sold/:id/",(req,res)=>{
    const {id,sold} = req.params;
db.query(`UPDATE products SET sold = ? WHERE id = ?`,[sold,id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send("updated");
        }
    })
    
});
app.post("/product-update-post",(req,res)=>{
    const {name,des,total,sold,img_one,img_two,like,newprice,oldprice,category,date,id} = req.body;
    db.query(`UPDATE products SET (name = ?,des =?,total = ?,sold = ?,img_one = ?,img_two = ?,like = ?,newprice = ?,oldprice = ?,category = ?,date =?) WHERE id = ?`,[name,des,total,sold,img_one,img_two,like,newprice,oldprice,category,date,id],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send("updated");
        }
    })
});
//
//
//delete route
app.get("/product-delete/:id",(req,res)=>{
    const {id} = req.params;
    const QUERY = `DELETE FROM products WHERE id = ?`
    db.query(QUERY,[id],(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send("Deleted")
        }
    })
});
app.get("/order-delete/:id",(req,res)=>{
    const {id} = req.params;
    const QUERY = `DELETE FROM order WHERE id = ?`
    db.query(QUERY,[id],(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send("Deleted")
        }
    })
});
app.get("/contact-delete/:id",(req,res)=>{
    const {id} = req.params;
    const QUERY = `DELETE FROM contact WHERE id = ?`
    db.query(QUERY,[id],(err,result)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send("Deleted")
        }
    })
});






















app.post("/book", uploads.single("img"), (req, res) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const companyname = req.body.companyname;
    const phone = req.body.phone;
    const email = req.body.email;
    const country = req.body.country;
    const state = req.body.state;
    const address = req.body.address;
    const service = req.body.service;
    const message = req.body.message;
    const date = req.body.date;
    const img = req.file.filename;
    db.query('INSERT INTO book (firstname,lastname,companyname,phone,email,country,state,address,service,message,img,date)VALUES(?,?,?,?,?,?,?,?,?,?,?,?)', [firstname, lastname, companyname, phone, email, country, state, address, service, message, img, date], (err, result) => {
        if (err) {
            console.log(err);
        } else {

            let messaged = {
                from: "axgurah@gmail.com",
                to: "axgurah@gmail.com",
                subject: `You have a new ORDER(BOOKING)`,
                html:
                 `                
<div>
<div id="header" style="text-align:center;background:#d2691e;color:#fff;padding:5px 12px;border-radius:5px;font-style:sans-serif;">
<h1>AXGURA</h1>
</div>
<section id="body" style="margin:0;padding:0;box-sizing:border-box;background:whitesmoke;border-radius:6px;padding:6px 18px;font-style:sans-serif;">
<small style="font-style:sans-serif;">New booking from:</small>
<h2 style="color:#2596be;font-size:2;">${firstname}</h2>
<p style="padding:1px 7px;margin:5px;color:#2596be;"><label style="font-size:14px;font-weight:400;padding:1px 5px">Lastname: </label>${lastname}</p>
<p style="padding:1px 7px;margin:5px;color:#2596be;"><label style="font-size:14px;font-weight:400;padding:1px 5px">CompanyName: </label>${companyname}</p>
<p style="padding:1px 7px;margin:5px;color:#2596be;"><label style="font-size:14px;font-weight:400;padding:1px 5px">Phone Number: </label>${phone}</p>
<p style="padding:1px 7px;margin:5px;color:#2596be;"><label style="font-size:14px;font-weight:400;padding:1px 5px">Email: </label>${email}</p>
<p style="padding:1px 7px;margin:5px;color:#2596be;"><label style="font-size:14px;font-weight:400;padding:1px 5px">Country:</label>${country}</p>
<p style="padding:1px 7px;margin:5px;color:#2596be;"><label style="font-size:14px;font-weight:400;padding:1px 5px">State:</label>${state}</p>
<p style="padding:1px 7px;margin:5px;color:#2596be;"><label style="font-size:14px;font-weight:400;padding:1px 5px">Address:</label>${address}</p>
<p style="padding:1px 7px;margin:5px;color:#2596be;"><label style="font-size:14px;font-weight:400;padding:1px 5px">Service:</label>${service}</p>
<p style="padding:1px 7px;margin:5px;color:#2596be;"><label style="font-size:14px;font-weight:400;padding:1px 5px">Message: </label><br>
${message}
</p>
<p style="padding:1px 7px;margin:5px;color:#2596be;"><label style="font-size:14px;font-weight:400;padding:1px 5px">Date:${date}</p><br/>
<hr>
<img src="https://sabinwa.herokuapp.com/uploads/${img}" alt="sabinus" style="width:100%;height:45vh;border:0;border-radius:7px;" />
<a href="https://sabinwa.netlify.app" style="padding:12px 18px;margin:13px 6px;background:#2596be;border:0;border-radius:6px;text-decoration:none;color:white;text-align:center;" >Visit Website</a>
</section>

</div>`

            };
            emailTransporter.sendMail(messaged, function (err, data) {
                if (err) {
                    console.log(err);

                } else {
                    res.send("Your request is being proccessed");
                }
            })
        }
    })
});
//
//
//
app.listen(port, () => {
    console.log(`Yey Server is running on http://localhost:${port}`);
}) 
