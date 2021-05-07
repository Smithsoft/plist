// Use declaration merging to add '_id' to the Express user type.
// This user type is injected into the request object by auth
// middleware but is defined as empty in Express:
// https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript

// declare namespace Express {
//     interface User {
//         _id: string
//     }
// }

// declare module 'express-serve-static-core' {
//     interface Request {
//         profile?: string
//     }
// }
import { User as UserRecord } from './types/user'

declare global {
    namespace Express {
        interface User {
            _id: string
        }
        interface Request {
            profile: UserRecord
        }
    }
}
