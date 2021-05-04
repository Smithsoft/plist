import React, { Component, Fragment } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import { isAuth, signout } from '../auth/helpers'
import { User } from '../types/User'
import { FaUserCircle } from 'react-icons/fa'
export type ValidPath = '/' | '/signin' | '/signup' | '/admin' | '/private'
export type ValidKeys = 'home' | 'signin' | 'signup' | 'admin' | 'private'
export type EventKeys = Record<ValidPath, ValidKeys>

const eventKeys: EventKeys = {
    '/': 'home',
    '/signup': 'signup',
    '/signin': 'signin',
    '/admin': 'admin',
    '/private': 'private'
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

    userProfile(loggedInUser: User): React.ReactElement {
        return (
            <li className="nav-item">
                <Link to="/private" className="nav-link" style={this.isActive('admin')}>
                    <FaUserCircle color="#fff" />
                    {' ' + loggedInUser.name}
                </Link>
            </li>
        )
    }

    adminLink(): React.ReactElement {
        return (
            <li className="nav-item" style={this.isActive('admin')}>
                <Link to="/admin" className="nav-link">
                    Admin
                </Link>
            </li>
        )
    }

    /**
     * Returns a fragment containing the links rendered for when
     * a user is not logged in. These links allow signin, for an
     * already registered user; and signup for new users.
     */
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
        const login = isAuth()
        const user = login as User
        return (
            <ul className="nav nav-tabs bg-primary">
                <li className="nav-item">
                    <Link to="/" className="nav-link" style={this.isActive('home')}>
                        Home
                    </Link>
                </li>
                {!login && this.signinLinks()}
                {user?.role === 'admin' && this.adminLink()}
                {user?.role === 'subscriber' && this.userProfile(user)}
                {login && this.signoutLink()}
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
