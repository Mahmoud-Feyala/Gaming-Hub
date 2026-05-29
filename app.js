const express = require('express')
const path = require('path')
const userRouter = require('./routes/user')
const adminRouter = require('./routes/admin');
const errorController = require('./controller/error');
const bodyParser = require('body-parser');
const app = express()
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname,"public")))
app.use(userRouter)
app.use("/admin",adminRouter)
app.use(errorController.get404)
app.listen(3000)