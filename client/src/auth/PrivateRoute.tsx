import React, { FC } from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { isAuth } from './helpers'

type PropType = {
    component: FC
} & RouteProps

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
