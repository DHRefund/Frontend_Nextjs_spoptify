"use client";

import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useUser } from "@/providers/UserProvider";
import { FaUserAlt } from "react-icons/fa";

const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="bg-gradient-to-b from-emerald-800 fixed-top mb-4">
      <Navbar expand="md" className="bg-transparent">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link onClick={() => router.back()} className="text-white">
                Back
              </Nav.Link>
              <Nav.Link onClick={() => router.forward()} className="text-white">
                Forward
              </Nav.Link>
            </Nav>
            <Nav>
              {user ? (
                <>
                  <Button variant="light" onClick={handleLogout} className="me-2">
                    Logout
                  </Button>
                  <Button variant="light" onClick={() => router.push("/account")}>
                    <FaUserAlt />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="link" className="text-white" onClick={() => router.push("/signup")}>
                    Sign up
                  </Button>
                  <Button variant="light" onClick={() => router.push("/login")}>
                    Log in
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
