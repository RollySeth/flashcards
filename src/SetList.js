import React from "react";
import { Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

export default class SetList extends React.Component {
  render() {
    const cards = this.props.cards;
    const editable = this.props.editable;
    const Tiles = () => {
      if (cards.length > 0) {
        return cards.map((set, index) => (
          <Col
            className={`h-100 ${set.category}`}
            md={6}
            xs={12}
            lg={4}
            key={index}
            xl={3}
          >
            <Card>
              <Card.Body>
                <h4>{set.category.replace("-", " ")}</h4>
                <h2>{set.title}</h2>
                <p>{set.description}</p>
                <p className="source">
                  <div className="centertop"></div>
                  {this.props.editable ? "Created by you" : ""}
                </p>
                <div className="buttons">
                  <Link
                    to={
                      editable === false
                        ? `/set/public/${set._id}`
                        : `/set/yours/${set._id}`
                    }
                  >
                    <div className="button">Test Yourself</div>
                  </Link>
                  {this.props.editable === true ? (
                    <Link to={`/set/yours/${set._id}/edit`}>
                      <div className="button">Edit this set</div>
                    </Link>
                  ) : (
                    <></>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ));
      } else {
        return <></>;
      }
    };

    return <Tiles />;
  }
}
