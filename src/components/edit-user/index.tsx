"use client";

import dynamic from "next/dynamic";

const EditUserForm = dynamic(() => import("@/components/edit-user-form"), {
  ssr: false,
  loading: () => <span>Loading Form...</span>,
});

export default function EditUser() {
  return (
    <div className="space-y-4 border p-4">
      <EditUserForm />
    </div>
  );
}
