import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    setTimeout(function () {
      document
        .querySelectorAll(".prevent-animation")
        .forEach((el) => el.classList.remove("prevent-animation"));
    }, 1000);
  }, []);

  return <div>{children}</div>;
};

export default Layout;
