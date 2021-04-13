import { Response, Request } from "express"

const signup = (req: Request, res: Response) => {
    res.json({
        data: 'you hit signup endpoint blah'
    })
}

export default signup