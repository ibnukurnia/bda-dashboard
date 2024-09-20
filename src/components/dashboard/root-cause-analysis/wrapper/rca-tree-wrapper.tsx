import React from "react";

interface RCATreeWrapperProps {
  children: React.ReactNode;
  isError?: boolean;
}

const RCATreeWrapper: React.FC<RCATreeWrapperProps> = ({
  children,
  isError,
}) => {
  if (isError) return (
    <span className="h-[calc(100vh-(96px+44px+2rem+66px+32px))] w-full text-center text-white content-center">
      Terjadi kesalahan. Silakan refresh halaman ini atau coba beberapa saat lagi
    </span>
  )
  return children
};

export default RCATreeWrapper;
