import React from "react";
import { Col, Row } from "react-bootstrap";

export default class Title extends React.Component {
  constructor(props) {
    super(props);
    this.titleRef = React.createRef();
  }

  render() {
    const updateTitle = this.props.updateTitle;
    return (
      <div className="title">
        <Row className="justify-content-center">
          <Col xs={10}>
            <input
              text="true"
              defaultValue={this.props.title}
              ref={this.titleRef}
              minLength="4"
              id="titleInput"
              maxLength="50"
              placeholder={
                this.props.title === null ? "Give your card set a title." : null
              }
            ></input>

            <button
              onClick={() => {
                updateTitle(this.titleRef.current.value);
              }}
            >
              {this.props.buttonText}
            </button>
            <div className="alert">{this.props.alert}</div>
          </Col>
        </Row>
      </div>
    );
  }
}
