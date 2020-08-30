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
import SignUp from "./SignUp";
import axios from 'axios';


const LoginService = data => (
	axios.post('http://localhost:5000/login', data)
		.then(res => res.status)
)

// Configure FirebaseUI.

class SignIn extends React.Component {

  constructor (props) 
  {
    super (props);
    this.state = 
    {
      email: '',
      password: '',
      error:false,
      loginSuccess: false,
    };
  }

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
  
  onSubmit = async e => 
  {
    const data = 
    {
      email: this.state.email,
      password: this.state.password,
    };
    const loginResult = await LoginService(data);
    if (loginResult !== 200) 
    {
      this.setState
      ({
        error: true,
        loginSuccess: false,
      });
    } 
    else
      this.setState
      ({
        loginSuccess: true,
        error: false,
      });
  };

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
    if (!this.props.isSignedIn) {
      return (
        <Container fluid className="login">
          <div id="welcome">
          </div>
          <div id="login">
          
            <Row className={`justify-content-center`}>

              <Col>
              <div id="welcome">
              <h1></h1>
                <img src={require('./Images/flashcardsbg.jpg')} alt="Logo"  width="100%" height="100%" />
               </div>
              </Col>
              <Col className={`h-100`} md={6} xs={12} lg={6} xl={6}>
                <h7> <Button href="/flashcards/#/signup">Sign-Up</Button>
                </h7>
                <h4>LOGIN</h4>
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
                required
              />
             </h5>
           <br/>
           <h6>
           <Button variant="contained" 
           onClick ={this.onSubmit} 
           color="secondary" 
           href="/flashcards/#/new"
           >
                Log In
            </Button>
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

export default SignIn;
