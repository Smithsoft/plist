import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { isAuth, signout } from '../auth/helpers'
import { History, LocationState } from 'history'

export type ValidPath = '/' | '/signin' | '/signup'
export type ValidKeys = 'home' | 'signin' | 'signup'
export type EventKeys = Record<ValidPath, ValidKeys>

const eventKeys: EventKeys = {
    '/': 'home',
    '/signup': 'signup',
    '/signin': 'signin'
}

// interface LayoutComponentProps extends RouteComponentProps {
//     history: History<LocationState>
// }

type State = {
    activeKeyName: ValidKeys
}

class Layout extends Component<RouteComponentProps> {
    activeKeyName: ValidKeys = 'home'

    isActive(path: ValidKeys): React.CSSProperties {
        if (path === this.activeKeyName) {
            return { color: '#000' }
        } else {
            return { color: '#fff' }
        }
    }

    onSignout() {
        console.log('On signout')
        this.props.history.push('/signin')
    }

    doSignout() {
        console.log(this)
        signout(() => this.onSignout())
    }

    signoutLink(): React.ReactElement {
        return (
            <li className="nav-item">
                <span
                    className="nav-link"
                    style={{ cursor: 'pointer', color: '#fff' }}
                    onClick={() => this.doSignout()}
                >
                    Signout
                </span>
            </li>
        )
    }

    signinLinks(): React.ReactElement {
        return (
            <Fragment>
                <li className="nav-item">
                    <Link to="/signin" className="nav-link" style={this.isActive('signin')}>
                        Signin
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/signup" className="nav-link" style={this.isActive('signup')}>
                        Signup
                    </Link>
                </li>
            </Fragment>
        )
    }

    navigation(): React.ReactElement {
        return (
            <ul className="nav nav-tabs bg-primary">
                <li className="nav-item">
                    <Link to="/" className="nav-link" style={this.isActive('home')}>
                        Home
                    </Link>
                </li>
                {!isAuth() && this.signinLinks()}
                {isAuth() && this.signoutLink()}
            </ul>
        )
    }

    render() {
        const key = this.props.history.location.pathname as ValidPath
        this.activeKeyName = eventKeys[key]
        return (
            <Fragment>
                {this.navigation()}
                <div className="container">{this.props.children}</div>
            </Fragment>
        )
    }
}

export default withRouter(Layout)
