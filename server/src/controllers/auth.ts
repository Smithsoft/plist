import { Response, Request } from "express"
import User from "../models/user"

const signup = (req: Request, res: Response) => {
    const { name, email, password } = req.body

    User.findOne({email}).exec(
        (err, user) => {
            if (user) {
                return res.status(400).json({
                    error: 'Email is taken'
                })
            }
        }
    )

    console.log("About to create new user")
    let newUser = new User({ name, email, password })
    console.log("About to save new user")
    newUser.save(
        (err, success) => {
            if (err) {
                console.log('SIGNUP ERROR', err)
                return res.status(400).json({
                    error: err
                })
            }
            res.json({
                message: 'Signup success! Please signin'
            })
        }
    )
}

export default signup