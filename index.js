const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const User = require('./User');
const Article = require('./Article')

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


app.post('/users', async (req, res) => {
    const { username, email, password } = req.body

    const user = await User.create({
        username,
        email,
        password

    });
    res.json({ status: "successful", user: user});
});

const pagination = (req, res, next) => {
      const pageAsNumber = Number.parseInt(req.query.page)
    const sizeAsNumber = Number.parseInt(req.query.size)


    let page = 0;

    if (!Number.isNaN(pageAsNumber) && pageAsNumber > 0){
        page = pageAsNumber;
    } 

    let size = 10;
    if(!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 10){
        size = sizeAsNumber;

    }

    req.pagination = {
        page, size
    }
    next()

}

app.get('/users', pagination, async (req, res) => {
    const {page, size } = req.pagination

  

    const users = await User.findAndCountAll({
        limit: size,
        offset: page * size
    });
    res.json({
        content: users.rows,
        totalPages: Math.ceil(users.count / size)
    });
})

// app.post('/articles', async (req, res) => {
//     const { content } = req.body

//     const article = await User.create({
//         content,
//     });
//     res.json({ status: "successful", article: article});
// });

app.get('/articles', pagination, async (req, res) => {

   const {page, size } = req.pagination


  

    const articlesWithCount = await Article.findAndCountAll({
        limit: size,
        offset: page * size
    });
    res.json({
        content: articlesWithCount.rows,
        totalPages: Math.ceil(articlesWithCount.count / size)
    });
})


function InvalidException(){
    this.status = 400;
    this.message = "Invalid ID"
}

function UserNotFoundException(){
    this.status = 404;
    this.message = "User Not Found";
}

const idNumberControl = (req, res, next) => {
        const id = Number.parseInt(req.params.id);
    if(Number.isNaN(id)){
       throw new InvalidException();
    }
    next();

}

app.get('/users/:id', idNumberControl, async (req, res, next) => {

    const id = req.params.id
    const user =  await User.findOne({ where: { id: id}})
    if(!user){
        return next(new UserNotFoundException())
    }
    res.send(user)
})



app.put('/users/:id', idNumberControl, async (req, res) => {
    const requestedId = req.params.id;
    const user = await User.findOne({where: { id: requestedId}});
    user.username = req.body.username;
    await user.save();
    res.send('updated');

})

app.delete('/users/:id', idNumberControl, async (req, res) => {
    const requestedId = req.params.id;

    try {
        // Find the user by ID
        const user = await User.findOne({ where: { id: requestedId } });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update the user data (if needed)
        user.username = req.body.username;

        // Delete the user
        await user.destroy();

        res.send('Successfully deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

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

