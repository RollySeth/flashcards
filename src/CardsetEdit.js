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
      headers: {
        headers: {
          Authorization:
            "Bearer " +
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJ1c2VyIl0sIl9pZCI6IjVmNGJkZDlmNGFlNGRiMDhkNGI3N2MwNCIsImlhdCI6MTU5ODgzMzkxMSwiZXhwIjoxNTk4ODY5OTExfQ.-fuW85bH4_4CVoBAqo9XH_6-148CMMU2j1WZsni68yY", //the token is a variable which holds the token
        },
      },
    };
  }
  updateTitle(n) {
    console.log(n);
    const name = n;
    const body = {
      title: name,
      description: this.state.descriptionVal,
      category: this.state.category,
    };
    axios
      .put(
        "http://localhost:5000/set/" + this.state.entryId,
        body,
        this.state.headers
      )
      .then((response) => {
        console.log(response.data);
      });
  }

  updateDesc(n) {
    const name = n;
    const body = {
      description: name,
      title: this.state.title,
      category: this.state.category,
    };
    axios.put(
      "http://localhost:5000/set/" + this.state.entryId,
      body,
      this.state.headers
    );
  }

  componentDidMount() {
    this.getCards();
    axios
      .get(
        "http://localhost:5000/set/" + this.state.entryId,
        this.state.headers
      )
      .then((response) => {
        const resdata = response.data;
        this.setState({
          title: resdata.title,
          descriptionVal: resdata.description,
          category: resdata.category,
        });
      });
  }

  updateSideA(val, card) {
    let changer = val;
    if (changer !== null) {
      const body = { sideA: changer, sideB: card.sideB };
      axios
        .put(
          "http://localhost:5000/cards/" + this.state.entryId + "/" + card._id,
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
          "http://localhost:5000/cards/" + this.state.entryId + "/" + card._id,
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
      "http://localhost:5000/cards/" + this.state.entryId + "/" + card._id;
    axios.delete(url, this.state.headers).then((response) => {
      this.getCards();
    });
  }
  addCard() {
    const body = { sideA: null, sideB: null, setId: this.state.entryId };
    const url = "http://localhost:5000/cards/" + this.state.entryId;
    axios.post(url, body, this.state.headers).then((response) => {
      this.getCards();
    });
  }

  getCards() {
    axios
      .get(
        "http://localhost:5000/cards/" + this.state.entryId,
        this.state.headers
      )
      .then((response) => {
        const currentCards = response.data;
        this.setState({ currentCards });
      })
      .then(() => {
        console.log(this.state.currentCards);
      });
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
                <Col md={5} xs={10} lg={5} xl={5}>
                  <button
                    id="addCard"
                    onClick={() => {
                      this.addCard();
                    }}
                  >
                    Add a card
                  </button>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </>
    );
  }
}
