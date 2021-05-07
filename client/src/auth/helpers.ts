import { AxiosResponse } from 'axios'
import * as Cookie from 'js-cookie'
import { AuthenticationResponse } from '../types/AuthenticationResponse'
import { User } from '../types/User'

/** Set into a cookie */
export const setCookie = (key: string, value: string): void => {
    if (window !== undefined) {
        Cookie.set(key, value, { expires: 1 })
    }
}

/** Remove from cookie */
export const removeCookie = (key: string): void => {
    if (window !== undefined) {
        Cookie.remove(key, { expires: 1 })
    }
}

/**
 * Get from a cookie (example - retrieve stored token)
 * Useful for making request to server with token.
 */
export const getCookie = (key: string): string | undefined => {
    if (window !== undefined) {
        return Cookie.get(key)
    }
}

/** Set in local storage */
export const setLocalStorage = (key: string, value: User): void => {
    if (window !== undefined) {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

/** Remove from local storage */
export const removeLocalStorage = (key: string): void => {
    if (window !== undefined) {
        localStorage.removeItem(key)
    }
}

/**
 * Authenticate user by passing data to cookie
 *  and local storage during signin
 * */
export const authenticate = (response: AxiosResponse<AuthenticationResponse>, next: () => void): void => {
    console.log('AUTHENTICATE HELPER ON SIGNIN RESPONSE', response)
    setCookie('token', response.data.token)
    setLocalStorage('user', response.data.user)
    next()
}

/** Access user info from local storage */
export const isAuth = (): User | undefined | false => {
    if (window !== undefined) {
        const cookieChecked = getCookie('token')
        if (cookieChecked) {
            const userInfo = localStorage.getItem('user')
            if (userInfo) {
                return JSON.parse(userInfo)
            } else {
                return false
            }
        }
    }
}

export const signout = (next: () => void): void => {
    removeCookie('token')
    removeLocalStorage('user')
    next()
}
