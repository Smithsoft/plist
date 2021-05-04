import React, { FC } from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { isAuth } from './helpers'

type PropType = {
    component: FC
} & RouteProps

/**
 * Component that wraps another component to produce a BrowserRouter
 * component which only renders if the user is logged in. If not logged
 * in then the browser is redirected to the signin component.
 * @param param0 Component and Route parameters as props.
 * @returns Route wrapping the given component
 */
const PrivateRoute: React.FC<PropType> = ({ component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            isAuth() ? (
                component(props)
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

export default PrivateRoute
