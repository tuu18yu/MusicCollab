/*Put together by Bessey*/
import React from 'react'

import PageRedirect from '../../components/PageRedirect'

import './styles.css'

const LogOut = (props) => {
    return (
        <div className="sign-out">
            <div className="sign-out-floating-dialog">
                <h1>Successfully Signed Out.</h1>
                <br/>
                <h4>You will be redirected to the login page in 2 seconds. </h4>
                <PageRedirect to={'/Login'} delay={2000} func={props.LogOut}/>
            </div>
        </div>
    );
}

export default LogOut;
