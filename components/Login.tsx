"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useUser } from "@/providers/UserProvider";
import Link from "next/link";
import { loginApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    setIsLoading(true);
    try {
      const data = await loginApi(values.email, values.password);

      localStorage.setItem("access_token", data.access_token);

      setUser(data.user);

      toast.success("Logged in successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="bg-dark text-white shadow">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Sign In</h2>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    disabled={isLoading}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email?.message as string}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    disabled={isLoading}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password?.message as string}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isLoading} className="w-100 mb-3">
                  {isLoading ? "Processing..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary">
                      Sign Up
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
}
