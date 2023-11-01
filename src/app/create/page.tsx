"use client";

import CreateSpotForm from "@/components/create-spot-form";

export default function CreatePage() {
  return (
    <div className="p-4">
      <h1 className="mb-4 font-bold">Create Page 🤡</h1>
      <div className="max-w-md border p-4">
        <CreateSpotForm onSubmit={() => {}} />
      </div>
    </div>
  );
}
