import React from "react";
import firebase from "firebase";
import Top from "./Top";
import { Container, Row, Col } from "react-bootstrap";
import Title from "./Title";
import Description from "./Description";
import IndividualCard from "./IndividualCard";
import { Helmet } from "react-helmet";

const db = firebase.firestore();

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
    };
  }

  updateTitle(n) {
    const name = n;
    const uid = firebase.auth().currentUser.uid;
    db.collection("users")
      .doc(uid)
      .collection("yourCards")
      .doc(this.state.entryId)
      .update({
        title: name,
      });
  }

  updateDesc(n) {
    const name = n;
    const uid = firebase.auth().currentUser.uid;
    db.collection("users")
      .doc(uid)
      .collection("yourCards")
      .doc(this.state.entryId)
      .update({
        description: name,
      });
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) =>
      this.setState({ isSignedIn: !!user }, () => {
        const uid = firebase.auth().currentUser.uid;

        this.unsubscribe = db
          .collection("users")
          .doc(uid)
          .collection("yourCards")
          .doc(this.state.entryId)
          .collection("cards")
          .orderBy("created", "asc")
          .onSnapshot((snapshot) => {
            this.setState({
              currentCards: snapshot.docs,
            });
          });

        db.collection("users")
          .doc(uid)
          .collection("yourCards")
          .doc(this.state.entryId)
          .get()
          .then((doc) => {
            this.setState({
              title: doc.data().title,
              descriptionVal: doc.data().description,
              category: doc.data().category,
            });
          });
      })
    );
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  updateSideA(val, card) {
    const uid = firebase.auth().currentUser.uid;

    let changer = val;
    if (changer !== null) {
      db.collection("users")
        .doc(uid)
        .collection("yourCards")
        .doc(this.state.entryId)
        .collection("cards")
        .doc(card.id)
        .update({
          sideA: val,
        });
    } else if (changer === "" || changer === null) {
      return false;
    }
  }

  updateSideB(val, card) {
    const uid = firebase.auth().currentUser.uid;

    let changer = val;
    if (changer !== null) {
      db.collection("users")
        .doc(uid)
        .collection("yourCards")
        .doc(this.state.entryId)
        .collection("cards")
        .doc(card.id)
        .update({
          sideB: val,
        });
    } else if (changer === "" || changer === null) {
      return false;
    }
  }
  deleteCard(card) {
    const uid = firebase.auth().currentUser.uid;
    db.collection("users")
      .doc(uid)
      .collection("yourCards")
      .doc(this.state.entryId)
      .collection("cards")
      .doc(card.id)
      .delete();
  }
  addCard() {
    const uid = firebase.auth().currentUser.uid;

    db.collection("users")
      .doc(uid)
      .collection("yourCards")
      .doc(this.state.entryId)
      .collection("cards")
      .add({
        sideA: null,
        sideB: null,
        answered: 0,
        correct: 0,
        created: new Date(),
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
