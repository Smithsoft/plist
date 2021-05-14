import { ErrorRequestHandler, RequestHandler } from "express"
import jwt from "express-jwt"
import { validationResult } from "express-validator"

const runValidation: RequestHandler = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }
    next()
}

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof jwt.UnauthorizedError) {
        res.status(err.status).json({error: err.message})
    }
    next(err)
}

export { runValidation, errorMiddleware }