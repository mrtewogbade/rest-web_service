const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const User = require('./User');

sequelize.sync({ force: true }).then( async () => {
    for(let i = 1; i <= 25; i++){
        const user = {
            username: `user${i}`,
            email: `user${i}@mail.com`,
            password: 'password' + i,
        }
        User.create(user);
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

app.get('/users', async (req, res) => {

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

    const users = await User.findAndCountAll({
        limit: size,
        offset: page * size
    });
    res.json({
        content: users.rows,
        totalPages: Math.ceil(users.count / size)
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

app.get('/users/:id', async (req, res, next) => {

    const id = Number.parseInt(req.params.id);
    if(Number.isNaN(id)){
       return next(new InvalidException())
    }
    const user =  await User.findOne({ where: { id: id}})
    if(!user){
        return next(new UserNotFoundException())
    }
    res.send(user)
})



app.put('/users/:id', async (req, res) => {
    const requestedId = req.params.id;
    const user = await User.findOne({where: { id: requestedId}});
    user.username = req.body.username;
    await user.save();
    res.send('updated');

})

app.delete('/users/:id', async (req, res) => {
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

