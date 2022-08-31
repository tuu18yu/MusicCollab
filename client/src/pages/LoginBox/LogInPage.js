import React from "react";
import './styles.css';
import {Link, Redirect} from "react-router-dom";
import { login } from "../../actions/user";


class LogInPage extends React.Component {

    state ={
        username: "",
        password: ""
    }

    getDateTime = () => {
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const dateTime = date+' '+time;
        return dateTime
    }

    handleInputChange = (event) => {
        const target=event.target
        const value=target.value
        const stateName=target.name

        this.setState({
            [stateName]: value
        })

    }


    render(){
        return (
            <div className='login-container'>
                <h2 className='logIn-greetings'>Welcome to Music Collab</h2>
                <h3 className='logIn-greetings'>Log In to Continue</h3>
                <div className='login-form-container'>
                    <form className="login_form" onSubmit={() => login(this.state, this.props.changeState, this.getDateTime())}>
                        <input className="inputForm" type="text"
                        placeholder="Username" name="username" onChange={this.handleInputChange}/>
                        <br />
                        <input className="inputForm" type="password"
                            placeholder="Password" name="password" onChange={this.handleInputChange}/>
                        <br />

                        <button onClick={(e) => {
                            e.preventDefault();
                            login(this.state, this.props.changeState, this.getDateTime());
                        }}> Sign in</button>
                        <br />
                        <div>
                            <p>No account? <Link to="/SignUp">Sign up here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        );
        
    }
}

export default LogInPage;