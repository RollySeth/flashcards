import React from "react";
import firebase from "firebase";
import Top from "./Top";
import SetList from "./SetList";
import { Card, Col, Row, Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import axios from "axios";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      publicSets: [],
      isSignedIn: false,
      yourCards: [],
      isPublic: null,
      headers: {},
    };
    

  }
  componentDidMount() {
    const token = JSON.parse(localStorage.getItem("userData")).token;
    const userId = JSON.parse(localStorage.getItem("userData"))
      .userWithoutPassword._id;
    this.setState(
      {
        headers: {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      },
      () => {
        axios
          .get(
            `${process.env.REACT_APP_BASEURI}/set/user/` + userId,
            this.state.headers
          )
          .then((response) => {
            this.setState({
              isSignedIn: true,
              yourCards: response.data,
            });
          });
        axios
          .get(
            `${process.env.REACT_APP_BASEURI}/set/public`,
            this.state.headers
          )
          .then((response) => {
            this.setState({
              publicSets: response.data,
            });
          });
      }
    );
    //search value updates
    this.state = { value: this.props.value };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillUnmount() {
    if (this.default) {
      this.default();
    }
    if (this.yourCards) {
      this.yourCards();
    }
  }
  //On typing search string
  handleOnChange = (event) => {
    this.setState({ value: event.currentTarget.value });
    console.log(event.currentTarget.value);
  };

  //On submit button click after typing search text
  handleSubmit = (event) => {
    event.preventDefault();
    alert("A search item was submitted: " + this.state.value);
  };

  render() {
    const publicSets = this.state.publicSets;
    const yourCards = this.state.yourCards;

    const { isSignedIn } = this.state;
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Flashcards</title>
        </Helmet>
        <Top title={"FlashCards"} action={"create"} />
        <Container fluid>
          <div className="content">
            <h1>Create a set or test yourself</h1>
            <h5>
              <form onSubmit={this.handleSubmit}>
                <label>
                  Search Cards:
                  <input
                    type="text"
                    value={this.state.value}
                    onChange={(event) => this.handleOnChange(event)}
                  />
                </label>
                <input type="submit" value="Submit" />
              </form>
            </h5>
            <Row>
              {isSignedIn && (
                <Col className="new h-100" md={12} xs={12} lg={4} xl={6}>
                  <Link to={`/new`}>
                    <Card>
                      <Card.Body>
                        <h2>Create a new cardset</h2>
                        <h3>Easy learning in a flash</h3>
                        <div className="addSet">+</div>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              )}
              {isSignedIn && <SetList cards={publicSets} editable={false} />}
              {isSignedIn && <SetList cards={yourCards} editable={true} />}
            </Row>
          </div>
        </Container>
      </>
    );
  }
}
