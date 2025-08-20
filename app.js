const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
var moment = require('moment');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// LiveReload
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const path = require("path");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});
app.use(connectLivereload());

// MongoDB Connection
mongoose.connect('mongodb+srv://Arafa:Arafa123@cluster0.zdjypgk.mongodb.net/3rafa_data?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        app.listen(port, () => {
            console.log(`http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

// Models
const Customer = require("./models/customerSchema");

// POST Add User
app.post("/user/add.html", (req, res) => {
    console.log(req.body);

    Customer.create(req.body)
        .then((result) => {
            console.log(result);
            // بعد الإضافة رجّع المستخدم لصفحة التفاصيل
            res.redirect(`/user/${result._id}`);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Server Error");
        });
});

// GET Home (عرض كل المستخدمين)
app.get("/", (req, res) => {
    Customer.find()
        .then(result => {
            res.render("index", { arr: result, moment: moment });
        })
        .catch(err => console.log(err));
});

// GET Add User Form
app.get("/user/add.html", (req, res) => {
    res.render("user/add");
});

// GET User Details
// GET User Details
app.get("/user/:id", (req, res) => {
    Customer.findById(req.params.id)
        .then((result) => {
            if (!result) {
                return res.status(404).send("User not found");
            }
            res.render("user/view", { object: result, moment: moment });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Server Error");
        });
});
