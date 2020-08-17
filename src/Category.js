import React from "react";
import { Col, Row } from "react-bootstrap";

export default class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Row className="justify-content-center">
        <Col xs={10} className="selectDiv">
          <select
            defaultValue={this.props.category}
            onChange={this.props.dropdownChanged}
            disabled={this.props.disabled}
          >
            <option value="" disabled>
              Categorize your set
            </option>
            <option value="geography">Geography</option>
            <option value="history">History</option>
            <option value="pop-culture">Pop Culture</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>
        </Col>
      </Row>
    );
  }
}
