import * as React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import App from './App'
import Activate from './auth/Activate'
import Signin from './auth/Signin'
import Signup from './auth/Signup'
import Admin from './core/Admin'
import Private from './core/Private'
import PrivateRoute from './auth/PrivateRoute'
import AdminRoute from './auth/AdminRoute'
import Forgot from './auth/Forgot'

class Routes extends React.Component {
    render(): React.ReactElement {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={App} />
                    <Route path="/signup" exact component={Signup} />
                    <Route path="/signin" exact component={Signin} />
                    <Route path="/auth/activate/:token" exact component={Activate} />
                    <AdminRoute path="/admin" exact component={Admin} />
                    <PrivateRoute path="/private" exact component={Private} />
                    <Route path="/auth/password/forgot" exact component={Forgot} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes
