import React from "react";
import Top from "./Top";
import Category from "./Category";
import Title from "./Title";
import Description from "./Description";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet";
import axios from "axios";

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
    };

    //Token from Local Storage
    const userData = localStorage.getItem("userData");
    const user = JSON.parse(userData);
    const userId = user.userWithoutPassword._id;
    const roles = user.userWithoutPassword.roles;
    const token = user.token;

    const headers = {
      headers: {
        Authorization: "Bearer " + token, //the token is a variable which holds the token
      },
    };

    let data = {};
    axios
      .post(`${process.env.REACT_APP_BASEURI}/set`, body, headers)
      .then((response) => {
        data = response.data;
        this.props.history.push({
          pathname: `/set/yours/${data._id}/edit`,
          state: {
            title: this.state.title,
            description: this.state.descriptionVal,
            category: this.state.category,
            entryId: data._id,
            cardSetId: data._id,
          },
        });
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
