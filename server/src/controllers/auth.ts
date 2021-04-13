import { Response, Request } from "express"

const signup = (req: Request, res: Response) => {
    console.log('REQ BODY ON SIGNUP', req.body)
    res.json({
        data: 'you hit signup endpoint blah'
    })
}

export default signup