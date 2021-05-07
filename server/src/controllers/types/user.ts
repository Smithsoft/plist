import { ParamsDictionary } from 'express-serve-static-core'
import { ErrorResponse } from '../../types/errorResponse'

import { UserDetails } from '../../models/user'
import { UserInformation } from '../../types/user'

export interface ReadParams extends ParamsDictionary {
    id: string
}

export interface ReadReqBody {
    user: UserDetails
}

export type ResBody = UserInformation | ErrorResponse

export type NoParams = Record<string, never>

export interface UpdateReqBody {
    name: string
    password: string
}