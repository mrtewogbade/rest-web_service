const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const User = require('./src/user/User');
const Article = require('./src/article/Article');
const userRouter = require('./src/user/UserRouter')

sequelize.sync({ force: true }).then( async () => {
    for(let i = 1; i <= 25; i++){
        const user = {
            username: `user${i}`,
            email: `user${i}@mail.com`,
            password: 'password' + i,
        }
        User.create(user);

        const article = {
            content: `article content ${i}`
        }
        await Article.create(article);
    }
});

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const thisWillRunInEveryRequest = (req, res, next) => {
    console.log('running the middleware for', req.method, req.originalUrl);
    next();
}

app.use(thisWillRunInEveryRequest)
app.use(userRouter);






// app.get('/articles', pagination, async (req, res) => {

//    const {page, size } = req.pagination


  

//     const articlesWithCount = await Article.findAndCountAll({
//         limit: size,
//         offset: page * size
//     });
//     res.json({
//         content: articlesWithCount.rows,
//         totalPages: Math.ceil(articlesWithCount.count / size)
//     });
// })



app.use((err, req, res, next) => {
    return res.status(err.status).send({ 
        message: err.message,
        timestamp: Date.now(),
        path: req.originalUrl
    })
})

app.listen(3000, () => {
    console.log("app is running");
})

