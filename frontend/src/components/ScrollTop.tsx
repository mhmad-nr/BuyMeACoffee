import { PropsWithChildren, useEffect } from "react";

export const ScrollTop = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return children;
};
