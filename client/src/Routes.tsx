import * as React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { RouteComponentProps } from 'react-router-dom'

import App from './App'
import Signup from './auth/Signup'

type TParams = {
    pathId: string;
}


type PropType = null | any
type StateType = null | any

class Routes extends React.Component<PropType, StateType> {
    render() {
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