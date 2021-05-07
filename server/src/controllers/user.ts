import { RequestHandler } from 'express'
import User from '../models/user'
import { ReadParams, ReadReqBody, ResBody, NoParams, UpdateReqBody } from './types/user'

const readDetails: RequestHandler<ReadParams, ResBody, ReadReqBody> = (req, res) => {
    const userId = req.params.id
    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        // Note that because password related fields are set to 
        // 'select: false' in the schema they will not be reflected
        // in the JSON user details returned
        res.json(user)
    })
}

const updateDetails: RequestHandler<NoParams, ResBody, UpdateReqBody> = (req, res) => {
    
    // User injected by the auth middleware
    const userId = req.user?._id

    // example data:
    // { _id: '6084c9078be4bc54773891d8', iat: 1620255245, exp: 1620860045 } 
    // iat - issued at date/time -- exp - expire date/time
    // console.log('UPDATE USER: ', req.user, ' UPDATE DATA: ', req.body)
    if (!userId) {
        return res.json({error: 'No user'})
    }
    const { name, password } = req.body

    User.findById(userId).select('+hashed_password +salt').exec((err, user) => {
        if (err || !user ) {
            return res.status(400).json({
                error: 'User not found'
            })
        } else {
            if (!name) {
                return res.status(400).json({
                    error: 'Name is required'
                })
            } else {
                user.name = name
            }
            if (password) {
                if (password.length < 6) {
                    return res.status(400).json({
                        error: 'Password must be min 6 characters long'
                    })
                } else {
                    console.log(`Settings password ${password} - ${typeof password}`)
                    user.password = password
                    console.log("done setting password")
                }
            }
        }
        user.save((err, updatedUser) => {
            if (err) {
                console.log('USER UPDATE ERROR: ', err)
                return res.status(400).json({
                    error: 'User update failed'
                })
            }
            return res.json(updatedUser.info())
        })
    })
}

export { readDetails, updateDetails }