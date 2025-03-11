"use client";

import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useUser } from "@/providers/UserProvider";
import Link from "next/link";
import { registerApi } from "@/lib/api";

export default function SignupPage() {
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
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    setIsLoading(true);
    try {
      const userData = {
        email: values.email,
        password: values.password,
        name: values.name,
      };

      const response = await registerApi(userData);

      localStorage.setItem("access_token", response.access_token);

      setUser(response.user);

      toast.success("Account created successfully!");
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
              <h2 className="text-center mb-4">Create Account</h2>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Choose a name"
                    disabled={isLoading}
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9_]+$/,
                        message: "Name can only contain letters, numbers and underscores",
                      },
                    })}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.name?.message as string}</Form.Control.Feedback>
                </Form.Group>

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
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.password?.message as string}</Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isLoading} className="w-100 mb-3">
                  {isLoading ? "Processing..." : "Create Account"}
                </Button>

                <div className="text-center">
                  <p className=" mb-0">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary">
                      Sign In
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
