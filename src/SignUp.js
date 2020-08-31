import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import { Col, Row, Container } from "react-bootstrap";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Redirect } from "react-router-dom";

import axios from 'axios';
import {Link} from 'react-router-dom';
// const bcrypt = require("bcrypt");


//SignUp service connect express login/SignUp route to user entered data
const UserRegistration = data => {
  // const password = data.password;
  // const salt = bcrypt.genSaltSync(10);
  // const hash = bcrypt.hashSync(password, salt);

  // data["password"] = hash;

  return axios.post(`${process.env.REACT_APP_BASEURI}/login/signup`, data)
      .then(res => res.status);
};

//User Vaidation service connect express login/user route to check user entered data 
export const UserValidation = data => (
  axios.post(`${process.env.REACT_APP_BASEURI}/login/user`, data)
  .then(exist => exist.status)
)

//Email Vaidation service connect express login/emailcheck route to check user entered email ..to not allow duplicate email entried  
export const EmailValidation = data => (
  axios.post(`${process.env.REACT_APP_BASEURI}/login/emailcheck`, data)
  .then(exist => exist.status)
)


import axios from 'axios';
import {Link} from 'react-router-dom';
// const bcrypt = require("bcrypt");


//SignUp service connect express login/SignUp route to user entered data
const UserRegistration = data => {
  // const password = data.password;
  // const salt = bcrypt.genSaltSync(10);
  // const hash = bcrypt.hashSync(password, salt);

  // data["password"] = hash;

  return axios.post('http://localhost:5000/login/signup', data)
      .then(res => res.status);
};

//User Vaidation service connect express login/user route to check user entered data 
export const UserValidation = data => (
  axios.post('http://localhost:5000/login/user', data)
  .then(exist => exist.status)
)

//Email Vaidation service connect express login/emailcheck route to check user entered email ..to not allow duplicate email entried  
export const EmailValidation = data => (
  axios.post('http://localhost:5000/login/emailcheck', data)
  .then(exist => exist.status)
)

class SignUp extends React.Component {
  

  //Saving SignUp State
  constructor (props) 
  {
    super (props);
    this.state = 
    {
      email: '',
      password: '',
      register:false,
      error:false,
    };
  }

  //Saving Email and Password Entered values to states 
  handleOnChangeEmail = e => 
  {
    this.setState 
    ({
      email: e.target.value,
    });
  };

  handleOnChangePassword = e => 
  {
    this.setState 
    ({
      password: e.target.value,
    });
  };

  handleOnBlur = async e => {
    this.setState ({
      email: e.target.value,
    });
    const data = {
      email: this.state.email,
    };
    const isEmailTaken = await EmailValidation (data);

    isEmailTaken === 204
      ?  this.setState ({email_taken: true} )
      : this.setState ({email_taken: false} );

      isEmailTaken === 204
      ?  this.setState ({error_email_exists:"Email already exists. Try Login Instead!"})
      : this.setState ({error_email_exists:""});
  };

  //On Submit button click sending data from saved state to express Login/signup routes 
  onSubmit = async e => 
  {
    e.preventDefault ();
    const data = 
    {
      email: this.state.email,
      password: this.state.password,
    };

    const registerStatus = await UserRegistration (data);
     if (registerStatus === 200) 
     {
      this.setState 
      ({
        email: '',
        password: '',
        register: true,
        error: false,
      });
     }
     else
      this.setState 
      ({
        error: true,
        register: false,
      });
  };

  // Configure FirebaseUI.

  // uiConfig = {
  //   signInFlow: "popup",
  //   signInOptions: [
  //     firebase.auth.EmailAuthProvider.PROVIDER_ID,
  //     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  //   ],
  //   callbacks: {
  //     signInSuccessWithAuthResult: () => {
  //       setTimeout(this.props.history.push("/home"), 1000);
  //     },
  //   },
  // };
  render() {
    const {register, error, email_taken, error_email_exists}=this.state; 
    if (this.state.register ) {
      return <Redirect to = {{ pathname: "/new" }} />;
    } 
    if (!this.props.isSignedIn ) {
      return (
        <Container fluid className="login">
          <div id="welcome">       
          </div>
          <div id="signup">
            <Row className={`justify-content-center`}>
              <Col>
              <div id="welcome">
              <h1></h1>
                <img src={require('./Images/flashcardsbg.jpg')} alt="Logo"  width="100%" height="100%" />
               </div>
              </Col>
              <Col className={`h-100`} md={6} xs={12} lg={6} xl={6}>
                <h7> <Button  href="#text-buttons">LOGIN</Button>
                </h7>
                <h4>SIGN-UP</h4>
                {/* <StyledFirebaseAuth
                  uiConfig={this.uiConfig}
                  firebaseAuth={firebase.auth()}
                /> */}
              <br/>
             <h5>
            <TextField
                id="outlined-helperText"
                label="E-mail"
                variant="outlined"
                onChange={this.handleOnChangeEmail}
                onBlur={this.handleOnBlur}
                helperText={error_email_exists}
                required
            />
            <br/>
            <br/>
            <TextField
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                onChange={this.handleOnChangePassword}
              />
             </h5>
           <br/>
           <br/>
           <h6>

           {/* <Link to="/flashcards/#/new"> */}
           <Button variant="contained"
           onClick ={this.onSubmit} 
           disabled={email_taken} 
           color="secondary"
           href="/flashcards/#/new"
           >
                Sign-Up
            </Button>
            {/* </Link> */}
            </h6>
               &nbsp; &nbsp;&nbsp;&nbsp;
              </Col>
            </Row>
            {/* <Row className={`justify-content-center`}>
              <Col className={`h-100`} md={6} xs={12} lg={6} xl={6}>
                <StyledFirebaseAuth
                  uiConfig={this.uiConfig}
                  firebaseAuth={firebase.auth()}
                />
              </Col>
            </Row> */}
          </div>

        </Container>
      );
    } 
    else {
      return <></>;
    }

    

  }
}

export default SignUp;
