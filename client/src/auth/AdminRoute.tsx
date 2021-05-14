import React from 'react'
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'
import { User } from '../types/User'
import { isAuth } from './helpers'

type PropType = {
    component: React.ComponentType<RouteComponentProps>
} & RouteProps

/**
 * Component that wraps another component to produce a BrowserRouter
 * component which only renders if the user is logged in as an admin
 * user. If not logged in, or only logged in as a non-admin user, then
 * the browser is redirected to the signin component.
 * @param param0 Component and Route parameters as props.
 * @returns Route wrapping the given component
 */
const AdminRoute: React.FC<PropType> = ({ component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            isAuth() && (isAuth() as User).role === 'admin' ? (
                React.createElement(component, props)
            ) : (
                <Redirect
                    to={{
                        pathname: '/signin',
                        state: { from: props.location }
                    }}
                />
            )
        }
    ></Route>
)

export default AdminRoute
