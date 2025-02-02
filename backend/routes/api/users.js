// backend/routes/api/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { singleMulterUpload, singlePublicFileUpload } = require('../../awsS3')

const router = express.Router();

//backend validation for signup
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// export const thunkAuthenticate = () => async (dispatch) => {
// GET
// const response = await csrfFetch("/api/restore-user");

// export const thunkLogin = (credentials) => async dispatch => {
// POST
// const response = await csrfFetch("/api/session", {

// Sign up
router.post('/', validateSignup, async (req, res) => {

    const { email, password, username } = req.body;

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, hashedPassword });

    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        profileImg: user.profileImg
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

// Restore session user
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        return res.json({
            user: safeUser
        });
    } else return res.json({ user: null });
});

//AWS route
router.put('/:id/update', singleMulterUpload('image'), async (req, res, next) => {
    try {
        const { userId } = req.body;
        let user;

        if (userId) {
            user = await User.findByPk(userId);
        } else {
            throw new Error("No user founder with that id")
        }

        let imgUrl;

        if (req.file) {
            imgUrl = await singlePublicFileUpload(req.file); //converts data from form
        }
        user.profileImg = imgUrl;
        await user.save();
        return res.json(user)
        // frontend -> backend -> AWS -> backend -> database -> backend -> frontend
        //this route is the "AWS" step
    } catch (e) {
        next(e)
    }

})

module.exports = router;