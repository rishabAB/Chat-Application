import { Skeleton } from "antd";
import React from "react";
const TestRoute = () => {
  return (
    <>
    <div>Testing route</div>
    <Skeleton
    avatar
    paragraph={{
      rows: 4,
    }}
  />
    </>
  );
};
export default TestRoute;
