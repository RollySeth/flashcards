import React from "react";
import firebase from "firebase";
import Top from "./Top";
import Category from "./Category";
import Title from "./Title";
import Description from "./Description";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";

const db = firebase.firestore();

export default class NewCardSet extends React.Component {
  constructor(props) {
    super(props);
    this.descRef = React.createRef();
    this.state = {
      title: null,
      descriptionVal: null,
      card: null,
      entryId: null,
      alert: null,
      descAlert: null,
      category: "",
    };
  }

  updateTitle(n) {
    const name = n;
    if (name.length < 4) {
      this.setState({
        alert: "Title must be at least four characters long",
      });
    } else {
      const entryId = name
        .replace(/\W+/g, " ")
        .replace(/\s+/g, "-")
        .toLowerCase();
      this.setState({
        title: name,
        alert: null,
        entryId: entryId,
      });
    }
  }

  updateDesc(n) {
    const name = n;
    if (name.length < 5) {
      this.setState({
        descAlert: "Please write a longer description",
      });
    } else {
      this.setState({
        descriptionVal: name,
        descAlert: null,
      });

      let entryString = this.state.entryId;
      let iterate = 0;
      this.checkExists(entryString, iterate);
    }
  }

  checkExists(entryString, i) {
    db.collection("defaultcards")
      .doc(entryString)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          this.setState({
            entryId: entryString,
          });
          setTimeout(this.createSet(), 1000);
        } else {
          i++;

          const string = this.state.entryId + "-" + i;
          this.checkExists(string, i);
        }
      });
  }

  dropdownChanged = (e) => {
    this.setState({
      category: e.target.value,
    });
  };

  createSet() {
    const uid = firebase.auth().currentUser.uid;

    db.collection("users")
      .doc(uid)
      .collection("yourCards")
      .doc(this.state.entryId)
      .set({
        category: this.state.category,
        title: this.state.title,
        description: this.state.descriptionVal,
      });
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

    this.props.history.push({
      pathname: `/set/yours/${this.state.entryId}/edit`,
      state: {
        title: this.state.title,
        description: this.state.descriptionVal,
        category: this.state.category,
        entryId: this.state.entryId,
      },
    });
  }
  render() {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Create a card set BrainKwik</title>
        </Helmet>
        <Top title={"BrainKwik"} action={"cancel"} />
        <Container fluid className={this.state.category}>
          <div className="content">
            <h1>Here's your chance to create a new study set.</h1>
            <Category
              dropdownChanged={this.dropdownChanged}
              category={this.state.category}
              disabled={false}
            />
            {this.state.category !== "" && (
              <Title
                updateTitle={this.updateTitle.bind(this)}
                title={this.state.title}
                alert={this.state.alert}
                buttonText={"Save title"}
              />
            )}
            {this.state.title !== null && (
              <Description
                updateDesc={this.updateDesc.bind(this)}
                title={this.state.descriptionVal}
                alert={this.state.descAlert}
              />
            )}
          </div>
        </Container>
      </>
    );
  }
}
