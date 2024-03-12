import React from "react";

export default function Layout({ children }) {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center py-12 px-8 sm:px-16 md:px-32 xl:px-64 overflow-hidden">
      {children}
    </div>
  );
}
