import React from "react";
import firebase from "firebase";
import { Card, Col, Row, Container } from "react-bootstrap";
import Top from "./Top";
import { Helmet } from "react-helmet";
import axios from "axios";
const db = firebase.firestore();

export default class CardsetAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCards: [],
      entryId: this.props.match.params.urlString,
      shuffled: [],
      index: 0,
      currentSide: "A",
      cardsAnswered: 0,
      category: "",
      cardsCorrect: 0,
      title: "",
      isSignedIn: false,
      complete: false,
      disabled: true,
      flips: 0,
      headers: {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJ1c2VyIl0sIl9pZCI6IjVmNGJkZDlmNGFlNGRiMDhkNGI3N2MwNCIsImlhdCI6MTU5ODgzMzkxMSwiZXhwIjoxNTk4ODY5OTExfQ.-fuW85bH4_4CVoBAqo9XH_6-148CMMU2j1WZsni68yY", //the token is a variable which holds the token
        },
      },
    };
    this.endButton = React.createRef();
  }

  componentDidMount() {
    axios
      .get(
        `${process.env.REACT_APP_BASEURI}/cards/` + this.state.entryId,
        this.state.headers
      )
      .then((response) => {
        const currentCards = response.data;
        this.setState({ currentCards });
      });
    axios
      .get(
        `${process.env.REACT_APP_BASEURI}/set/` + this.state.entryId,
        this.state.headers
      )
      .then((response) => {
        const category = response.data.category;
        this.setState({ category });
      });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  shuffle(cards) {
    const shuffledCards = cards
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
    this.setState({
      shuffled: shuffledCards,
      index: 0,
      currentSide: "A",
      complete: false,
      disabled: true,
    });
  }
  flip() {
    const currentSide = this.state.currentSide === "B" ? "A" : "B";
    const flips = this.state.flips + 1;
    this.setState({
      currentSide: currentSide,
      flips: flips,
      disabled: false,
    });
  }

  endStudy() {
    if (this.state.currentSide === "C") {
      this.props.history.push(`/flashcards/home`);
    } else if (this.state.cardsAnswered !== 0) {
      this.setState({
        currentSide: "C",
        disabled: true,
      });
    } else {
      this.props.history.push(`/flashcards/home`);
    }
  }

  nextCard(x) {
    const i = this.state.index + 1;
    const ans = this.state.cardsAnswered + 1;
    const cardsCorrect = this.state.cardsCorrect + x;

    this.setState(
      {
        index: i,
        cardsAnswered: ans,
        cardsCorrect: cardsCorrect,
        flips: 0,
        disabled: true,
      },
      () => {
        if (i === this.state.currentCards.length) {
          this.setState(
            {
              complete: true,
              currentSide: "C",
            },
            this.endStudy()
          );
        } else {
          this.setState({
            currentSide: "A",
            complete: false,
          });
        }
      }
    );
  }

  render() {
    const card = this.state.shuffled[this.state.index];
    const CardSide = () => {
      if (card && this.state.currentSide !== "C") {
        return (
          <Row className={`justify-content-center cardHolder`}>
            <Col className={`h-100`} md={10} xs={12} lg={10} xl={10}>
              <Card
                className={`sideA side ${this.state.category}`}
                onClick={() => {
                  this.flip();
                }}
              >
                <span>{card.data().sideA}</span>
              </Card>
            </Col>
            <Col className={`h-100`} md={10} xs={12} lg={10} xl={10}>
              <Card
                className={`sideB side ${this.state.category}`}
                onClick={() => {
                  this.flip();
                }}
              >
                {" "}
                <span>{card.data().sideB}</span>
              </Card>
            </Col>
          </Row>
        );
      } else if (this.state.currentSide === "C") {
        return (
          <Col
            className={`h-100 sideB ${this.state.category}`}
            md={10}
            xs={12}
            lg={10}
            xl={10}
          >
            <Card className="endCard">
              <span>
                {`During this session, you got ${this.state.cardsCorrect} out of ${this.state.cardsAnswered} cards correct.`}
                <br />
                {`
            That's ${parseFloat(
              (this.state.cardsCorrect / this.state.cardsAnswered) * 100
            ).toFixed(1)}%!`}{" "}
              </span>
            </Card>
          </Col>
        );
      } else {
        return <></>;
      }
    };
    const flipped = () => {
      if (this.state.flips > 0 && this.state.flips % 2 === 1) {
        return "flipped";
      } else if (this.state.flips > 0 && this.state.flips % 2 === 0) {
        return "unflipped";
      } else return "";
    };

    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{this.state.title} | BrainKwik</title>
        </Helmet>
        <Top title={this.state.title} action="cancel" />
        <Container fluid id="answer">
          <Row className="answerButtons justify-content-center topButtons">
            <Col md={6} xs={12} lg={6} xl={6}>
              <button
                onClick={() => {
                  this.flip();
                }}
              >
                Click to flip card
              </button>
            </Col>
          </Row>
          <Row className={`cardAnswer justify-content-center ${flipped()}`}>
            <CardSide />
          </Row>
          <Row className="answerButtons justify-content-center result">
            <Col md={4} xs={6} lg={4} xl={4}>
              <button
                id="correct"
                disabled={this.state.disabled}
                onClick={() => {
                  this.nextCard(1);
                }}
              >
                I got it right
              </button>
            </Col>
            <Col md={4} xs={6} lg={4} xl={4}>
              <button
                id="incorrect"
                disabled={this.state.disabled}
                onClick={() => {
                  this.nextCard(0);
                }}
              >
                I got it incorrect
              </button>
            </Col>
          </Row>
          <Row className="answerButtons  justify-content-center bottom">
            <Col md={6} xs={12} lg={6} xl={6}>
              <button
                id="reshuffle"
                onClick={() => {
                  this.shuffle(this.state.currentCards);
                }}
              >
                Start Over
              </button>
            </Col>{" "}
            <Col md={6} xs={12} lg={6} xl={6}>
              <button
                id="end"
                ref={this.endButton}
                onClick={() => {
                  this.endStudy();
                }}
              >
                End Session
              </button>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
