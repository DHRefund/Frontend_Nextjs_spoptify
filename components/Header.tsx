"use client";

import { useRouter } from "next/navigation";
import { Container, Nav, Navbar, Button, Dropdown } from "react-bootstrap";
import { useUser } from "@/providers/UserProvider";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axios";

const Header = () => {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="sticky-top">
      <Navbar fixed="top" bg="black" variant="dark" className="py-2" style={{ backdropFilter: "blur(10px)" }}>
        <Container fluid>
          <Navbar.Brand href="/" className="fw-bold">
            Spotify Clone
          </Navbar.Brand>

          <Nav className="ms-auto align-items-center">
            {user ? (
              <Dropdown>
                <Dropdown.Toggle variant="link" className="d-flex align-items-center text-white">
                  <FaUserCircle size={40} className="me-2" />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end" className="bg-dark">
                  <Dropdown.Item className="text-white" onClick={() => router.push("/account")}>
                    Tài khoản
                  </Dropdown.Item>
                  <Dropdown.Item className="text-white" onClick={() => router.push("/profile")}>
                    Hồ sơ
                  </Dropdown.Item>
                  <Dropdown.Item className="text-white" onClick={() => router.push("/premium")}>
                    Nâng cấp lên Premium
                  </Dropdown.Item>
                  <Dropdown.Item className="text-white" onClick={() => router.push("/support")}>
                    Hỗ trợ
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    Đăng xuất
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button
                  variant="link"
                  className="text-light-gray text-decoration-none me-3"
                  onClick={() => router.push("/signup")}
                >
                  Sign up
                </Button>
                <Button variant="light" className="rounded-pill px-4" onClick={() => router.push("/login")}>
                  Log in
                </Button>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
