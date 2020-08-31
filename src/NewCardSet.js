import React from "react";
import firebase from "firebase";
import Top from "./Top";
import Category from "./Category";
import Title from "./Title";
import Description from "./Description";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import axios from "axios";

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
      cardSetId: null,
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
      this.setState(
        {
          descriptionVal: name,
          descAlert: null,
        },
        () => {
          setTimeout(this.createSet(), 1000);
        }
      );

      let entryString = this.state.entryId;
      let iterate = 0;

      //    this.checkExists(entryString, iterate);
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
    const body = {
      title: this.state.title,
      description: this.state.descriptionVal,
      category: this.state.category,
      entryId: this.state.entryId,
      userId: "5f4bdd9f4ae4db08d4b77c04", // Change this
    };

    // Need help with this part
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlcyI6WyJ1c2VyIl0sIl9pZCI6IjVmNGJkZDlmNGFlNGRiMDhkNGI3N2MwNCIsImlhdCI6MTU5ODgxMDkwNiwiZXhwIjoxNTk4ODE4MTA2fQ.5zeCDhhnRiJ7 - 0qlipxRNhhZAOeQPiAepoelLO7lMYc";
    const headers = {
      Authorization: "Bearer " + token, //the token is a variable which holds the token
    };

    //

    axios
      .post("http://localhost:5000/set", body)
      .then(function (response) {
        console.log(response);
        console.log(body);
        const cardSetId = response.data._id;
        this.setState({
          cardSetId: cardSetId,
        });
        const emptyCard = {
          sideA: "This is side A",
          sideB: "This is side B",
          setId: cardSetId,
        };
        axios.post("http://localhost:5000/cards/" + cardSetId, emptyCard);
      })
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
      });

    //   db.collection("users")
    //    .doc(uid)
    //    .collection("yourCards")
    //    .doc(this.state.entryId)
    //    .collection("cards")
    //    .add({
    //      sideA: null,
    //      sideB: null,
    //      answered: 0,
    //      correct: 0,
    //      created: new Date(),
    //    });

    this.props.history.push({
      pathname: `/set/yours/${this.state.cardSetId}/edit`,
      state: {
        title: this.state.title,
        description: this.state.descriptionVal,
        category: this.state.category,
        entryId: this.state.entryId,
        cardSetId: this.setState.cardSetId,
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
