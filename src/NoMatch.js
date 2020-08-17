import React from "react";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";
import Top from "./Top";
import { Helmet } from "react-helmet";

export default class CardsetAnswer extends React.Component {
  render() {
    return (
      <>
        {" "}
        <Helmet>
          <meta charSet="utf-8" />
          <title>404 | BrainKwik</title>
        </Helmet>
        <Top title={`BrainKwik`} action="cancel" />
        <Container fluid className="fourohfour">
          <Row className="justify-content-center">
            <Col md={6} xs={12} lg={6} xl={6}>
              You have a 404 error.
              <br />
              <br />
              <Link to={`/home`}>Go to our homepage</Link>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
