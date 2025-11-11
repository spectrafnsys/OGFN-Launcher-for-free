"use client";

import { HardDrive } from "lucide-react";

export function BuildList() {
  return (
    <>
      <div className="h-full w-full flex justify-center items-center flex-col gap-2">
        <HardDrive className="mb-2 text-gray-200" size={150} />
        <h2 className="text-gray-200 text-3xl font-bold">No builds found</h2>
        <p className="text-gray-200">
          We couldn't locate any builds in your library. Please import your
          install!
        </p>
      </div>
    </>
  );
}
