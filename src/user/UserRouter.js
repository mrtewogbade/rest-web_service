const express = require('express');
const router = express.Router();
const UserNotFoundException = require('./userNotFoundException');
const User = require('./User');
const idNumberControl = require('../article/shared/idNumberControl');
const pagination = require('../article/shared/pagination')



router.post('/users', async (req, res) => {
    const { username, email, password } = req.body

    const user = await User.create({
        username,
        email,
        password

    });
    res.json({ status: "successful", user: user});
});

router.get('/users', pagination, async (req, res) => {
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

router.get('/users/:id', idNumberControl, async (req, res, next) => {

    const id = req.params.id
    const user =  await User.findOne({ where: { id: id}})
    if(!user){
        return next(new UserNotFoundException())
    }
    res.send(user)
})



router.put('/users/:id', idNumberControl, async (req, res) => {
    const requestedId = req.params.id;
    const user = await User.findOne({where: { id: requestedId}});
    user.username = req.body.username;
    await user.save();
    res.send('updated');

})

router.delete('/users/:id', idNumberControl, async (req, res) => {
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



module.exports = router;