"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { useUser } from "@/providers/UserProvider";
import Input from "./Input";
import Button from "./Button";
import axiosInstance from "@/lib/axios";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useUser();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/auth/login", data);

      setUser(response.data);
      router.push("/");
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0" style={{ backgroundColor: "#121212", borderRadius: "12px" }}>
            <Card.Body className="p-5">
              <Card.Title as="h3" className="text-center mb-4 text-white">
                Login to Your Account
              </Card.Title>

              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Email address</Form.Label>
                  <Input
                    id="email"
                    label=""
                    disabled={isLoading}
                    {...register("email", { required: true })}
                    type="email"
                    className="form-control form-control-lg bg-dark text-light border-secondary"
                    placeholder="Enter your email"
                    style={{ borderRadius: "8px" }}
                  />
                  <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-light">Password</Form.Label>
                  <Input
                    id="password"
                    label=""
                    type="password"
                    disabled={isLoading}
                    {...register("password", { required: true })}
                    className="form-control form-control-lg bg-dark text-light border-secondary"
                    placeholder="Enter your password"
                    style={{ borderRadius: "8px" }}
                  />
                </Form.Group>

                <div className="d-grid gap-2 mt-4">
                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="btn btn-lg"
                    style={{
                      backgroundColor: "#1DB954",
                      borderColor: "#1DB954",
                      color: "white",
                      borderRadius: "30px",
                      padding: "12px",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Loading...
                      </>
                    ) : (
                      "LOGIN"
                    )}
                  </Button>
                </div>

                <div className="mt-4 text-center">
                  <p className="mb-0 text-light">
                    Don't have an account?{" "}
                    <Link
                      href="/signup"
                      style={{
                        color: "#1DB954",
                        fontWeight: "bold",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                      className="hover:text-green-400 transition duration-300"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
