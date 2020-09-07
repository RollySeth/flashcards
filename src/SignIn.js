import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase";
import { Col, Row, Container } from "react-bootstrap";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Helmet } from "react-helmet";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import SignUp from "./SignUp";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { grey } from "@material-ui/core/colors";

//service to send login credential to express backend
const LoginService = (data) =>
  axios.post(`${process.env.REACT_APP_BASEURI}/login`, data).then((res) => res);

//Email Vaidation service connect express login/emailcheck route to check user entered email ..to not allow duplicate email entried
const EmailValidation = (data) =>
  axios
    .post(`${process.env.REACT_APP_BASEURI}/login/emailcheck`, data)
    .then((exist) => exist.status);

class SignIn extends React.Component {
  //constructor to save initial empty state
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: false,
      loginSuccess: false,
    };
  }
  //   componentDidMount() {

  // //  this.state = {value: this.props.value};
  //  this.handleOnChangeEmail = this.handleOnChangeEmail.bind(this);
  //  this.handleOnChangePassword  = this.handleOnChangePassword.bind(this);
  //  this.handleOnBlur = this.handleOnBlur.bind(this);
  //  this.onSubmit = this.onSubmit.bind(this);

  //   }
  //called when user moves out of email input field
  handleOnChangeEmail = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  //called when user moves out of password input field
  handleOnChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  //checking if entered email doesn't exist is database and require sign up instead of signin
  handleOnBlur = async (e) => {
    this.setState({
      email: e.target.value,
    });
    const data = {
      email: this.state.email,
    };
    const isEmailTaken = await EmailValidation(data);

    isEmailTaken === 204
      ? this.setState({ sign_up_reqd: false })
      : this.setState({ sign_up_reqd: true });

    isEmailTaken === 204
      ? this.setState({ error_sign_up_reqd: "" })
      : this.setState({
          error_sign_up_reqd: "User does not exist. Sign-Up First!",
        });
  };

  // sending login information to express route after submit button is pressed
  onSubmit = async (e) => {
    e.preventDefault();

    this.setState({ wrong_password: true });
    const data = {
      email: this.state.email,
      password: this.state.password,
    };
    const loginResult = await LoginService(data);
    console.log(`Test ${loginResult.status}`);
    if (loginResult.status !== 200) {
      console.log("Log in Failed.");
      this.setState({
        loginSuccess: false,
        error: true,
      });
    } else {
      console.log("Log in Success.");
      console.log(JSON.stringify(loginResult.data));
      localStorage.setItem("userData", JSON.stringify(loginResult.data));
      this.setState({
        loginSuccess: true,
        error: false,
      });
    }
    this.forceUpdate();
  };

  render() {
    if (this.state.loginSuccess) {
      return <Redirect to={{ pathname: "/home" }} />;
    }
    const {
      error,
      sign_up_reqd,
      error_sign_up_reqd,
      wrong_password,
    } = this.state;
    return (
      <Container fluid className="login">
        <div id="login">
          <Row className={`justify-content-center`}>
            <Col>
              <div id="welcome">
                <h1></h1>
                <img
                  src={require("./Images/flashcardsbg.jpg")}
                  alt="Logo"
                  width="100%"
                  height="100%"
                />
              </div>
            </Col>
            <Col className={`h-100 test`} md={6} xs={12} lg={6} xl={6}>
              <h7>
                {" "}
                <Button href="/flashcards/#/signup">Sign-Up</Button>
              </h7>
              <h4>LOGIN</h4>
              <br />
              <h5>
                <TextField
                  id="outlined-helperText"
                  label="E-mail"
                  variant="outlined"
                  onChange={this.handleOnChangeEmail}
                  onBlur={this.handleOnBlur}
                  helperText={error_sign_up_reqd}
                  required
                />
                <br />
                <br />
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
              <h6>
                {/* <Link to="/flashcards/#/new"> */}
                <Button
                  variant="contained"
                  onClick={this.onSubmit}
                  disabled={sign_up_reqd}
                  color="secondary"
                  href="/flashcards/#/new"
                >
                  Log-In
                </Button>
                {/* </Link> */}
              </h6>
              <h3>
                {wrong_password && (
                  <Alert severity="error">
                    Unable to log in. Please check your username and password.
                  </Alert>
                )}
                {!wrong_password && <Alert severity="error"></Alert>}
              </h3>
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}

export default SignIn;
