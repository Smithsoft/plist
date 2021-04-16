import { Response, Request } from "express"
import User from "../models/user"
import sendmail from "../helpers/sendmail"
import * as jwt from "jsonwebtoken"
import { Credentials } from "./../types/credentials"

/**
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
 * 
 * @param req 
 * @param res 
 */

const signUp = (req: Request, res: Response) => {
    const { name, email, password } = req.body

    User.findOne({ email }).exec(
        (err, user) => {
            if (user) {
                return res.status(400).json({
                    error: 'Email is taken'
                })
            }
        }
    )
    const account_activation: string = process.env.JWT_ACCOUNT_ACTIVATION!
    const email_account = process.env.EMAIL_USER
    const client_url = process.env.CLIENT_URL

    const token = jwt.sign(
        { name, email, password },
        account_activation,
        { expiresIn: "10m" }
    )

    const emailData = {
        from: email_account, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
        to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
        subject: "ACCOUNT ACTIVATION LINK",
        html: `
                  <h1>Please use the following link to activate your account</h1>
                  <p>${client_url}/api/account-activation/${token}</p>
                  <hr />
                  <p>This email may contain sensitive information</p>
                  <p>${client_url}</p>
              `,
    };

    sendmail(req, res, emailData)
}

const accountActivation = (req: Request, res: Response) => {
    const { token } = req.body

    const verifyCB: jwt.VerifyCallback = function (err: jwt.VerifyErrors|null, decoded: any) {
        if (err) {
            console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
            return res.status(401).json({
                error: 'Expired link. Signup again'
            });
        }

        const credentials = jwt.decode(token) as Credentials;
        const user = new User(credentials);

        user.save((err, user) => {
            if (err) {
                console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);
                return res.status(401).json({
                    error: 'Error saving user in database. Try signup again'
                });
            }
            return res.json({
                message: 'Signup success. Please signin.'
            });
        });
    }

    if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION!, verifyCB)
    } else {
        return res.json({
            message: 'Something went wrong. Try again.'
        });
    }
}

const signIn = (req: Request, res: Response) => {
    const { email, password } = req.body

    User.findOne({ email }).exec(
        (err, user) => {
            if (err) {
                return res.status(401).json({
                    error: `Could not sign in: ${err}`
                })
            } else if (!user) {
                return res.status(401).json({
                    error: 'User not found'
                })
            }
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: 'Email or password did not match'
                })
            }
            // generate a token and send to client
            const secret = process.env.JWT_SECRET!
            const token = jwt.sign({_id: user._id}, secret, {expiresIn: '7d'})
            const { _id, name, email, role } = user
            return res.json({
                token,
                user: { _id, name, email, role }
            })
        }
    )
    const account_activation: string = process.env.JWT_ACCOUNT_ACTIVATION!
    const email_account = process.env.EMAIL_USER
    const email_password = process.env.EMAIL_PASS
    const client_url = process.env.CLIENT_URL

}

export { signIn, signUp, accountActivation }