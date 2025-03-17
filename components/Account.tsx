"use client";

import { useEffect } from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import Header from "@/components/Header";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";

const AccountPage = () => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    // <Header>
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="bg-dark text-white shadow">
            <Card.Body className="p-4">
              <h1 className="mb-4 fs-2 fw-bold">Account Settings</h1>

              <div className="mb-4">
                <h2 className="fs-4 fw-semibold text-success mb-3">Profile</h2>
                <Card className="bg-secondary border-secondary mb-3">
                  <Card.Body>
                    <p className="mb-2">
                      <span className="fw-bold text-info me-2">Email:</span>
                      {user.email}
                    </p>
                    <p className="mb-0">
                      <span className="fw-bold text-info me-2">Username:</span>
                      {user.name || "Not set"}
                    </p>
                  </Card.Body>
                </Card>
              </div>

              <div className="mb-3">
                <h2 className="fs-4 fw-semibold text-success mb-3">Subscription</h2>
                <Card className="bg-secondary border-secondary">
                  <Card.Body>
                    <p className="mb-0">
                      <span className="fw-bold text-info me-2">Current Plan:</span>
                      <Badge bg="primary" className="ms-1">
                        Free
                      </Badge>
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    // </Header>
  );
};

export default AccountPage;
