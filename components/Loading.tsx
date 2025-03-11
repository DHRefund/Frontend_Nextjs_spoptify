"use client";

import { Spinner } from "react-bootstrap";

const Loading = () => {
  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <Spinner animation="border" variant="success" />
    </div>
  );
};

export default Loading;
