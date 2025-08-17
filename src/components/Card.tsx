"use client";
import React from "react";
import { useRouter } from "next/navigation";

const StackComponent = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.push("/roadmap");
  };

  return (
    <div className="text-center justify-center m-5">
      <form
        onSubmit={handleSubmit}
        className="content-center min-w-max">
        <input
          type="text"
          className="m-2 p-1 border-2 overflow-auto rounded-xl px-3 py-2  border-black  shadow-sm font-mono bg-neutral-light focus:outline-none focus:ring-2 focus:ring-primary "
          placeholder="Let's Build your Stack"
        />
        <button
          type="submit"
          className="text-gray border-black hover:bg-primary-dark  px-4 py-2 border-2 rounded font-bold text-sm shadow-[4px_4px_0px_black] transition-colors">
          Submit
        </button>
      </form>
    </div>
  );
};

export default StackComponent;
