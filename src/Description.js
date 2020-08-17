import React from "react";
import { Col, Row } from "react-bootstrap";

export default class Description extends React.Component {
  constructor(props) {
    super(props);
    this.descRef = React.createRef();
  }

  render() {
    const updateDesc = this.props.updateDesc;
    return (
      <div className="description">
        <Row className="justify-content-center">
          <Col xs={10}>
            {" "}
            <input
              text="true"
              id="descInput"
              ref={this.descRef}
              defaultValue={this.props.descriptionVal}
              minLength="4"
              placeholder={
                this.props.descriptionVal === null ? "Describe the set." : null
              }
            ></input>
            <button
              onClick={() => {
                updateDesc(this.descRef.current.value);
              }}
            >
              Save description
            </button>
            <div className="alert">{this.props.descAlert}</div>
          </Col>
        </Row>
      </div>
    );
  }
}
