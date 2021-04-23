import * as React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import App from './App'
import Signup from './auth/Signup'

class Routes extends React.Component {
    render(): React.ReactElement {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={App} />
                    <Route path="/auth/signup" component={Signup} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Routes