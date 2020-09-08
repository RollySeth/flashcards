import React from "react";
import Top from "./Top";
import { Container, Row, Col } from "react-bootstrap";
import Title from "./Title";
import Description from "./Description";
import IndividualCard from "./IndividualCard";
import { Helmet } from "react-helmet";
import axios from "axios";
export default class CardsetEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCards: [],
      entryId: this.props.match.params.urlString,
      title: "",
      descriptionVal: "",
      category: "",
      set: null,
      isSignedIn: false,
      disabled: true,
      alert: null,
      isPublic: null,
      headers: {},
    };
  }
  updateTitle(n) {
    const name = n;
    const body = {
      title: name,
      description: this.state.descriptionVal,
      category: this.state.category,
    };
    axios
      .put(
        `${process.env.REACT_APP_BASEURI}/set/` + this.state.entryId,
        body,
        this.state.headers
      )
      .then((response) => {});
  }

  updateDesc(n) {
    const name = n;
    const body = {
      description: name,
      title: this.state.title,
      category: this.state.category,
    };
    axios.put(
      `${process.env.REACT_APP_BASEURI}/set/` + this.state.entryId,
      body,
      this.state.headers
    );
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
        this.getCards();
        axios
          .get(
            `${process.env.REACT_APP_BASEURI}/set/` + this.state.entryId,
            this.state.headers
          )
          .then((response) => {
            const resdata = response.data;
            this.setState({
              title: resdata.title,
              descriptionVal: resdata.description,
              category: resdata.category,
              isPublic: resdata.isPublic,
            });
          });
      }
    );
  }

  updateSideA(val, card) {
    let changer = val;
    if (changer !== null) {
      const body = { sideA: changer, sideB: card.sideB };
      axios
        .put(
          `${process.env.REACT_APP_BASEURI}/cards/` +
            this.state.entryId +
            "/" +
            card._id,
          body,
          this.state.headers
        )
        .then((response) => {
          this.getCards();
        });
    } else if (changer === "" || changer === null) {
      return false;
    }
  }

  updateSideB(val, card) {
    let changer = val;
    if (changer !== null) {
      const body = { sideB: changer, sideA: card.sideA };
      axios
        .put(
          `${process.env.REACT_APP_BASEURI}/cards/` +
            this.state.entryId +
            "/" +
            card._id,
          body,
          this.state.headers
        )
        .then((response) => {
          this.getCards();
        });
    } else if (changer === "" || changer === null) {
      return false;
    }
  }
  deleteCard(card) {
    const url =
      `${process.env.REACT_APP_BASEURI}/cards/delete/` +
      this.state.entryId +
      "/" +
      card._id;
    axios.delete(url, this.state.headers).then((response) => {
      this.getCards();
    });
  }
  addCard() {
    const body = { sideA: null, sideB: null, setId: this.state.entryId };
    const url = `${process.env.REACT_APP_BASEURI}/cards/` + this.state.entryId;
    axios.post(url, body, this.state.headers).then((response) => {
      this.getCards();
    });
  }

  deleteSet() {
    const url = `${process.env.REACT_APP_BASEURI}/set/` + this.state.entryId;
    axios.delete(url, this.state.headers).then((response) => {
      this.props.history.push({
        pathname: `/home`,
      });
    });
  }
  makePublic() {
    const pub = this.state.isPublic === true ? false : true;
    this.setState({ isPublic: pub }, () => {
      const url = `${process.env.REACT_APP_BASEURI}/set/public/${this.state.entryId}/`;
      axios
        .put(url, { isPublic: pub }, this.state.headers)
        .then((response) => {});
    });
  }
  getCards() {
    axios
      .get(
        `${process.env.REACT_APP_BASEURI}/cards/` + this.state.entryId,
        this.state.headers
      )
      .then((response) => {
        const currentCards = response.data;
        this.setState({ currentCards });
      })
      .then(() => {});
  }
  render() {
    const List = this.state.currentCards.map((card, index) => {
      return (
        <IndividualCard
          card={card}
          updateSideA={this.updateSideA.bind(this)}
          updateSideB={this.updateSideB.bind(this)}
          deleteCard={this.deleteCard.bind(this)}
          category={this.state.category}
        />
      );
    });

    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{this.state.title} - Editing a Card Set | BrainKwik</title>
        </Helmet>
        <Top
          user={true}
          title={"BrainKwik"}
          entryId={this.state.entryId}
          addCard={this.addCard.bind(this)}
          action={"start"}
        />
        <Container fluid className="editing">
          <div className="content">
            <Title
              updateTitle={this.updateTitle.bind(this)}
              title={this.state.title}
              alert={this.state.alert}
              buttonText={"Save title"}
            />
            <Description
              updateDesc={this.updateDesc.bind(this)}
              descriptionVal={this.state.descriptionVal}
              alert={this.state.descAlert}
            />
            <div>
              {this.state.currentCards.length > 0 && List}
              <Row className="justify-content-center">
                <Col md={3} xs={10} lg={3} xl={3}>
                  <button
                    id="addCard"
                    className="editButton"
                    onClick={() => {
                      this.addCard();
                    }}
                  >
                    Add a card
                  </button>
                </Col>
                <Col md={3} xs={10} lg={3} xl={3}>
                  <button
                    id="deleteSet"
                    className="editButton"
                    onClick={() => {
                      this.deleteSet();
                    }}
                  >
                    Delete set
                  </button>{" "}
                </Col>

                <Col md={3} xs={10} lg={3} xl={3}>
                  <button
                    className="editButton"
                    id="makePub"
                    onClick={() => {
                      this.makePublic();
                    }}
                  >
                    {this.state.isPublic === true
                      ? "Make private"
                      : "Make public"}
                  </button>{" "}
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </>
    );
  }
}
