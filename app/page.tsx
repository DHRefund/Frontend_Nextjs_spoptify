import { Container, Row, Col } from "react-bootstrap";
import Header from "@/components/Header";
import SongList from "@/components/SongList";

export default function Home() {
  return (
    <Container fluid className="bg-dark min-vh-100">
      <Header>
        <div className="mb-4">
          <h1 className="text-white display-4">Welcome back</h1>
        </div>
      </Header>

      <Row className="mb-4">
        <Col>
          <h2 className="text-white">Newest songs</h2>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="text-white mb-4">Latest Songs</h2>
          <SongList />
        </Col>
      </Row>
    </Container>
  );
}
