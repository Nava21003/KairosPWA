import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";

const NotFound = () => {
  const error = useRouteError();

  return (
    <Container className="min-vh-100 d-flex align-items-center justify-content-center">
      <Row>
        <Col className="text-center">
          <div className="mb-4">
            <h1
              className="display-1 fw-bold text-primary"
              style={{ fontSize: "8rem" }}
            >
              404
            </h1>
            <h2 className="mb-3">Página no encontrada</h2>
            <p className="text-muted mb-4">
              Lo sentimos, la página que estás buscando no existe.
            </p>
            {error && (
              <div className="alert alert-light border mb-4" role="alert">
                <small className="text-muted">
                  {error.statusText || error.message}
                </small>
              </div>
            )}
          </div>

          <Button as={Link} to="/" variant="primary" size="lg" className="px-5">
            <i className="bi bi-house-door me-2"></i>
            Volver al Inicio
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
