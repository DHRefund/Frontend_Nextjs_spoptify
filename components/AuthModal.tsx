"use client";

import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useUser } from "@/providers/UserProvider";

export default function AuthModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const { isOpen, onClose } = useAuthModal();
  const { setUser } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    setIsLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        mode === "login"
          ? { email: values.email, password: values.password }
          : {
              email: values.email,
              password: values.password,
              name: values.name,
              username: values.username,
            };

      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      setUser(data.user);

      reset();
      onClose();
      toast.success(mode === "login" ? "Logged in successfully!" : "Account created successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{mode === "login" ? "Sign In" : "Sign Up"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {mode === "register" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                  {...register("name", {
                    required: "Full name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name?.message as string}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Choose a username"
                  disabled={isLoading}
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: "Username can only contain letters, numbers and underscores",
                    },
                  })}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">{errors.username?.message as string}</Form.Control.Feedback>
              </Form.Group>
            </>
          )}

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
            {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
          </Button>

          <div className="text-center">
            <p className="text-muted mb-0">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              <Button variant="link" onClick={() => setMode(mode === "login" ? "register" : "login")}>
                {mode === "login" ? "Sign Up" : "Sign In"}
              </Button>
            </p>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
