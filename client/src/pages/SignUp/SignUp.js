import React, { useState } from 'react';
import "./styles.css";
import FormRow from '../../components/FormRow';
import SelectCategories from '../../components/SelectCategories';
import {Link, Redirect } from "react-router-dom";
import { addUser } from "../../actions/user"

function SignUp (props) {

    const defaultSignUpInputs = {
        username: "",
        profileName: "",
        email: "",
        interests: [],
        newPassword: "",
        confirmPassword: ""
    };

    const [isSuccessful, setSuccessful] = useState(false);
    const [signUpFormInputs, setSignUpFormInputs] = useState(defaultSignUpInputs);
  
    //a get request will be made to the server to get the user data 
    const handleInputChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setSignUpFormInputs(inputs => ({...inputs, [name]: value}))
    }

    const handleInterestChange = (interestList) => {
        const name = 'interests';
        setSignUpFormInputs(inputs => ({...inputs, [name]: interestList}))
    }


    const renderRedirect = () => {
        if (isSuccessful) {
          return <Redirect to='/' />
        }
    }

    const signUp = () => {
        if (signUpFormInputs.username === defaultSignUpInputs.username) {
            return alert("username can't be empty! Enter username");
        }
        if (signUpFormInputs.profileName === defaultSignUpInputs.profileName) {
            return alert("Profile name can't be empty! Enter profile name");
        }
        if(signUpFormInputs.newPassword !== signUpFormInputs.confirmPassword) {
            return alert("Passwords don't match!");
        }
        setSuccessful(true)

        const signUpInputs = {
            isAdmin: false,
            username: signUpFormInputs.username,
            profileName: signUpFormInputs.profileName,
            email: signUpFormInputs.email,
            interests: signUpFormInputs.interests,
            password: signUpFormInputs.newPassword
        }

        addUser(signUpInputs)
    }


    return (
        <div className="page">
            {renderRedirect()}
        <div id="signup-container">
            <div id="header-container">
                <h2 className="page-title">Sign Up</h2>
            </div>

            <div id="signup-details">
                <form id="signup-form">
                    <FormRow label={"Username"} type={"text"} value={signUpFormInputs.username} 
                        handleChange={handleInputChange} className='input-box' name={"username"}/>
                    <br/>
                    <FormRow label={"Profile Name"} type={"text"} value={signUpFormInputs.profileName} 
                        handleChange={handleInputChange}  className='input-box'  name={"profileName"}/>
                    <br/>
                    <FormRow label={"Email"} type={"text"} value={signUpFormInputs.email} 
                        handleChange={handleInputChange} className='input-box'  name={"email"}/>
                    <br/>
                    <div className="row">
                        <label className="input-label">Interests</label>
                        <SelectCategories selectedValues={signUpFormInputs.interests} handleSelect={handleInterestChange}/>
                    </div>
                    <br/>
                        <FormRow label={"Password"} type={"password"} value={signUpFormInputs.newPassword} 
                            handleChange={handleInputChange} className='input-box'  name={"newPassword"}/>
                        <br/>
                        <FormRow label={"Confirm Password"} type={"password"} value={signUpFormInputs.confirmPassword} 
                            handleChange={handleInputChange} className='input-box' name={"confirmPassword"}/>
                    </form>
                    <br/>
                    <div>
                        <button type="submit" form="signup-form" className="btn" onClick={signUp}>
                            Sign Up
                        </button>
                        <Link to='/'><button id="signup-cancel-btn"> Cancel </button></Link>
                    </div>
                </div>
            </div>
        </div>   
    );
}

SignUp.propTypes = {
};

export default SignUp;