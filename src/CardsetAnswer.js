import React from "react";
import { Card, Col, Row, Container } from "react-bootstrap";
import Top from "./Top";
import { Helmet } from "react-helmet";
import axios from "axios";

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
      results: [],
      flips: 0,
      isPublic: null,
      headers: {},
    };
    this.endButton = React.createRef();
  }

  componentDidMount() {
    const token = JSON.parse(localStorage.getItem("userData")).token;
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
            `${process.env.REACT_APP_BASEURI}/set/` + this.state.entryId,
            this.state.headers
          )
          .then((response) => {
            const category = response.data.category;
            this.setState({ category });
            axios
              .get(
                `${process.env.REACT_APP_BASEURI}/cards/` + this.state.entryId,
                this.state.headers
              )
              .then((response) => {
                const currentCards = response.data;
                this.setState({ currentCards }, () => {
                  this.shuffle(this.state.currentCards);
                });
              })
              .catch((error) => {
                console.error(error);
              });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    );
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

    axios
      .put(
        `${process.env.REACT_APP_BASEURI}/set/${this.state.entryId}/start`,
        {},
        this.state.headers
      )
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
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
    axios
      .get(
        `${process.env.REACT_APP_BASEURI}/user/history/single/` +
          this.state.entryId,
        this.state.headers
      )
      .then((response) => {
        console.log(response);
        this.setState({ results: response.data });
      })
      .catch((error) => {
        console.error(error);
      });

    if (this.state.currentSide === "C") {
      this.props.history.push(`/home`);
    } else if (this.state.cardsAnswered !== 0) {
      this.setState({
        currentSide: "C",
        disabled: true,
      });
    } else {
      this.props.history.push(`/home`);
    }
  }

  nextCard(x, card) {
    const i = this.state.index + 1;
    const ans = this.state.cardsAnswered + 1;
    const cardsCorrect = this.state.cardsCorrect + x;
    axios
      .put(
        `${process.env.REACT_APP_BASEURI}/cards/answers/${this.state.entryId}/${card._id}/${x}`,
        {},
        this.state.headers
      )
      .then((response) => {})
      .catch((error) => {
        console.error(error);
      });
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
                <span>{card.sideA}</span>
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
                <span>{card.sideB}</span>
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
                {`You've attempted this set ${
                  this.state.results.attempted
                } times, getting ${
                  this.state.results.cardsCorrect
                } cards correct out of ${
                  this.state.results.cardsAttempted
                }. That's ${parseFloat(
                  (this.state.results.cardsCorrect /
                    this.state.results.cardsAttempted) *
                    100
                ).toFixed(1)}%.`}
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
                  this.nextCard(1, card);
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
                  this.nextCard(0, card);
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
