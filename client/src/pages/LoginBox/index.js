/*Put together by Bessey*/
import React, { Component } from "react";
import { NavLink, Redirect} from "react-router-dom";
import './styles.css';

class Login extends Component {
    constructor(props) {
      super(props);

      this.state ={
        username: "",
        pw: "",
        remember: false,
        redirect: false
      }

      this.logIn= this.logIn.bind(this);
      this.handleInputChange = this.handleInputChange.bind(this);
    }
    render(){
      this.shouldRedir();
      const { redirect } = this.state;
      if (redirect) {
       return <Redirect to='/Homepage'/>;
      }
      else{
        return (
            <div>
                <h1>Log In to Your Music Collab Account</h1>
                <form className="login_form" onSubmit={this.logIn}>
                  <input className="inputForm" type="email" autoComplete="username"
                   placeholder="Username" name="username" required onChange={this.handleInputChange}/>
                  <br />
                  <input className="inputForm" type="password" autoComplete="current-password"
                   placeholder="Password" name="pw" required onChange={this.handleInputChange}/>
                  <br />

                  <button> Sign in</button>
                  <br />
                  <div>
                      <p>No account? <NavLink to="/SignUp" className="pwHelp">Sign up here</NavLink></p>
                  </div>
                </form>
            </div>
        );
      }
    }

    // Logs the user in
    logIn(e){
      e.preventDefault(); // Prevents auto page refresh
      
    }


    handleInputChange(event){
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      this.setState({[event.target.name]: value});
    }

    shouldRedir(){
      if(localStorage.getItem("isLoggedIn")){
        this.setState({ redirect: true });
      }
    }
}

export default Login;
