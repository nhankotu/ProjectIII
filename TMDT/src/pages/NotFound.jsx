import { Navigate } from "react-router-dom";

import React, { useState } from "react";
function NotFound() {
  const [redirect, setRedirect] = React.useState(false);
  const handleRedirect = () => {
    setRedirect(true);
  };
  if (redirect) {
    return <Navigate to="/home" />;
  }
  return (
    <div>
      <h1>404 - Trang web bạn tìm kiếm không tồn tại </h1>
      {/*Nut chuyen huong*/}
      <button onClick={handleRedirect}> Quay lai trang chu </button>
    </div>
  );
}
export default NotFound;
