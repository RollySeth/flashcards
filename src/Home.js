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
      categoryStats: [],
      headers: {},
      searchedSets: [],
    };
  }
  search() {
    axios
      .get(
        `${process.env.REACT_APP_BASEURI}/set/search?s=` + this.state.value,
        this.state.headers
      )
      .then((response) => {
        this.setState({ searchedSets: response.data });
      });
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
            `${process.env.REACT_APP_BASEURI}/set/public/`,
            this.state.headers
          )
          .then((response) => {
            console.log(response);
            this.setState({
              publicSets: response.data,
            });
          });
        axios
          .get(
            `${process.env.REACT_APP_BASEURI}/set/category`,
            this.state.headers
          )
          .then((response) => {
            this.setState({
              categoryStats: response.data,
            });
          });
      }
    );
    //search value updates
    this.state = { value: this.props.value };
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  //On typing search string
  handleOnChange = (event) => {
    this.setState({ value: event.currentTarget.value });
  };

  //On submit button click after typing search text
  handleSubmit = (event) => {
    event.preventDefault();
    this.search();
  };

  render() {
    const publicSets = this.state.publicSets;
    const yourCards = this.state.yourCards;
    const CategoryList = () => {
      return this.state.categoryStats.map((c, i) => (
        <li key={i}>
          {c._id.charAt(0).toUpperCase() +
            c._id.slice(1).replace(/\W+/g, " ").replace(/\s+/g, "-")}
          : {parseFloat(c.pctCorrect * 100).toFixed(1)}% correct
        </li>
      ));
    };
    const Searched = () => {
      if (this.state.searchedSets.length !== 0) {
        return <h3>Search Results:</h3>;
      } else {
        return <h3></h3>;
      }
    };
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
            <Searched />
            <h1>Create a set or test yourself</h1>

            <Row>
              {isSignedIn && (
                <SetList cards={this.state.searchedSets} editable={false} />
              )}
            </Row>
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <h2>Categories, ranked by difficulty</h2>
                    <p>What share of cards did our community get correct?</p>
                    <CategoryList cat={this.state.categoryStats} />
                  </Card.Body>
                </Card>
              </Col>
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
              {isSignedIn && <SetList cards={yourCards} editable={true} />}
              {<SetList cards={publicSets} editable={false} />}
            </Row>
          </div>
        </Container>
      </>
    );
  }
}
