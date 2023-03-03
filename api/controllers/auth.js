import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async(req, res, next) => {
    const { username, email, country, city, phone, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
    username,
    email,
    country,
    city,
    phone,
    password: hashedPassword,
    });
    try{
        // const salt = bcrypt.genSaltSync(10);
        // const hash = bcrypt.hashSync(req.body.password, salt)

        // const newUser = new User({
        //     // username: req.body.username,
        //     // email: req.body.email,
        //     ...req.body,
        //     password: hash
        // })

        // await newUser.save()
        // res.status(201).send('User has been created.')

        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT);
        res.status(201).send('User has been created').json({ token });
    }
    catch(error){
        next(error)
    }
}

export const login = async (req, res, next) => {
    try{
        
        const user = await User.findOne({username: req.body.username})
        if(!user) return next(createError(404, 'User not found!'))

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
        if(!isPasswordCorrect) return next(createError(400, 'Wrong password or username!'))

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT)
        // console.log(user)
        const {password, isAdmin, ...otherDetails} = user._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json({details:{...otherDetails}, user, isAdmin})
        // res.status(200).json(user)
    }
    catch(error){
        next(error)
    }
}