import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './Routes'

import './fonts/archivo-v8-latin-900.woff'
import './fonts/archivo-v8-latin-900.woff2'
import './fonts/archivo-v8-latin-regular.woff'
import './fonts/archivo-v8-latin-regular.woff2'
import './fonts/montserrat-v15-latin-800.woff'
import './fonts/montserrat-v15-latin-800.woff2'
import './fonts/montserrat-v15-latin-regular.woff'
import './fonts/montserrat-v15-latin-regular.woff2'

import './index.scss'

ReactDOM.render(
    <React.StrictMode>
        <Routes />
    </React.StrictMode>,
    document.getElementById('root')
)
