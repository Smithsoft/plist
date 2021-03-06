import React from 'react'
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom'
import { isAuth } from './helpers'

type PropType = {
    component: React.ComponentType<RouteComponentProps>
} & RouteProps

/**
 * Component that wraps another component to produce a BrowserRouter
 * component which only renders if the user is logged in. If not logged
 * in then the browser is redirected to the signin component.
 * @param param0 Component and Route parameters as props.
 * @returns Route wrapping the given component
 */
const PrivateRoute: React.FC<PropType> = ({ component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                isAuth() ? (
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
}

export default PrivateRoute
