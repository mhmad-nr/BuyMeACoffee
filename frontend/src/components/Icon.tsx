import React from "react";

export const Icon = ({
  Element,
  className,
  onClick,
}: {
  Element: React.FC<React.SVGProps<SVGSVGElement>>;
} & React.SVGProps<SVGSVGElement>) => {
  return <Element onClick={onClick} className={className} />;
};
