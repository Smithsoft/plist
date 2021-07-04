import { Response, Request, RequestHandler } from "express"
import User from "../models/user"
import sendmail from "../helpers/sendmail"
import * as jwt from "jsonwebtoken"
import { Credentials } from "./../types/credentials"
import expressJwt from "express-jwt"


const signUp:RequestHandler = (req, res) => {
    const { name, email, password } = req.body

    User.findOne({ email }).exec(
        (_err, user) => {
            if (user) {
                return res.status(400).json({
                    error: 'Email is taken'
                })
            }
        }
    )
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
                  <p>${client_url}/auth/activate/${token}</p>
                  <hr />
                  <p>This email may contain sensitive information</p>
                  <p>${client_url}</p>
              `,
    };

    sendmail(req, res, emailData)
}

const accountActivation:RequestHandler = (req: Request, res: Response) => {
    const { token } = req.body

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const verifyCB: jwt.VerifyCallback = function (err: jwt.VerifyErrors|null, _decoded: any) {
        if (err) {
            console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
            return res.status(401).json({
                error: 'Expired link. Signup again'
            });
        }

        const credentials = jwt.decode(token) as Credentials;
        const user = new User(credentials);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        user.save((err, _user) => {
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION!, verifyCB)
    } else {
        return res.json({
            message: 'Something went wrong. Try again.'
        });
    }
}

const signIn:RequestHandler = (req: Request, res: Response) => {
    const { email, password } = req.body

    User.findOne({ email }).select('+hashed_password +salt').exec(
        (err, user) => {
            if (err) {
                return res.status(401).json({
                    error: `Could not sign in: ${err}`
                })
            } else if (!user) {
                return res.status(401).json({
                    error: 'User with that email does not exist. Please sign up.'
                })
            }
            if (!user.authenticate(password)) {
                return res.status(401).json({
                    error: 'Email or password did not match'
                })
            }
            // generate a token and send to client
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const secret = process.env.JWT_SECRET!
            const token = jwt.sign({_id: user._id}, secret, {expiresIn: '7d'})
            const { _id, name, email, role } = user
            return res.json({
                token,
                user: { _id, name, email, role }
            })
        }
    )
}

// HS256 - HMAC with SHA 256 is default JWT - algorithm now is required
const requireSignIn = expressJwt({
    secret: (process.env.JWT_SECRET as string),
    algorithms: ['HS256']
})

const adminMiddleware: RequestHandler = (req, res, next) => {

    // User injected by the auth middleware
    const userId = req.user?._id
    
    User.findById(userId).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            })
        }
        if (user.role !== 'admin') {
            return res.status(400).json({
                error: 'Admin resource. Access denied.'
            })
        }
        req.profile = user
        next()
    })
}

const forgotPassword: RequestHandler = (req, res) => {
    const {email} = req.body
    User.findOne({email}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist'
            })
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const account_activation: string = process.env.JWT_RESET_PASSWORD!
        const email_account = process.env.EMAIL_USER
        const client_url = process.env.CLIENT_URL
    
        const token = jwt.sign(
            { _id: user._id, name: user.name },
            account_activation,
            { expiresIn: "10m" }
        )
    
        const emailData = {
            from: email_account, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
            to: email, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE THE USER EMAIL (VALID EMAIL ADDRESS) WHO IS TRYING TO SIGNUP
            subject: "Password reset link",
            html: `
                      <h1>Please use the following link to reset your password</h1>
                      <p>${client_url}/auth/password/reset/${token}</p>
                      <hr />
                      <p>This email may contain sensitive information</p>
                      <p>${client_url}</p>
                  `,
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        user.updateOne({ resetPasswordLink: token }).exec((err, _success) => {
            if (err) {
                console.log('RESET PASSWORD LINK ERROR', err)
                return res.status(400).json({
                    error: 'Database connection error on user password forgot request'
                })
            } else {
                sendmail(req, res, emailData)
            }
        })    
    })
}

const resetPassword: RequestHandler = (req, res) => {
    const { resetPasswordLink, newPassword } = req.body
    const secret = process.env.JWT_RESET_PASSWORD
    const verifyCB: jwt.VerifyCallback = function(err) {
        if (err) {
            console.log('RESET PASSWORD LINK ERROR', err)
            return res.status(400).json({
                error: 'Expired link. Try again.'
            })
        }
        User.findOne({resetPasswordLink}).exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: 'Something went wrong. Try later.'
                })
            } else {
                user.password = newPassword
                user.resetPasswordLink = ''

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                user.save((err, _result) => {
                    if (err) {
                        return res.status(400).json({
                            error: 'Error resetting user password'
                        })
                    }
                    res.json({
                        message: 'Great! Now you can log in with your new password'
                    })
                })
            }
        })

    }
    if (resetPasswordLink && secret) {
        jwt.verify(resetPasswordLink, secret, verifyCB)
    }
}

export { signIn, signUp, forgotPassword, resetPassword, requireSignIn, adminMiddleware, accountActivation }
