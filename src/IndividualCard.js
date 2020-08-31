import React from "react";
import { Col, Row, Card } from "react-bootstrap";

export default class IndividualCard extends React.Component {
  constructor(props) {
    super(props);
    this.sideA = React.createRef();
    this.sideB = React.createRef();
  }

  render() {
    const updateSideA = this.props.updateSideA;
    const updateSideB = this.props.updateSideB;
    const deleteCard = this.props.deleteCard;
    const card = this.props.card;
    const category = this.props.category;
    return (
      <div key={card._id} className="cardEdit">
        <Row className="justify-content-center deleteHold">
          <Col md={5} xs={10} lg={5} xl={5}>
            <button
              class="deleteCard"
              onClick={() => {
                deleteCard(card);
              }}
            >
              Delete the card below
            </button>
          </Col>
        </Row>
        <Row>
          <Col
            className={`h-100 sideA ${category}`}
            md={6}
            xs={12}
            lg={6}
            xl={6}
          >
            <Card>
              <textarea placeholder={"Type here for side A"} ref={this.sideA}>
                {card.sideA}
              </textarea>
              <button
                onClick={() => {
                  updateSideA(this.sideA.current.value, card);
                }}
              >
                Save Side A
              </button>
            </Card>
          </Col>
          <Col
            className={`h-100 sideB ${category}`}
            md={6}
            xs={12}
            lg={6}
            xl={6}
          >
            <Card>
              <textarea placeholder={"Type here for side B"} ref={this.sideB}>
                {card.sideB}
              </textarea>
              <button
                onClick={() => {
                  updateSideB(this.sideB.current.value, card);
                }}
              >
                Save Side B
              </button>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
