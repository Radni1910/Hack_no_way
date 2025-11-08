import React from "react";

export default function Step2ProfileInfo({
  profileForm,
  setProfileForm,
  goToNextStep,
  goToPrevStep,
  loading,
}) {
  const handleChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.id]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        goToNextStep();
      }}
      className="space-y-4"
    >
      <input
        id="name"
        className="w-full border p-2 rounded"
        placeholder="Full Name"
        value={profileForm.name}
        onChange={handleChange}
      />
      <input
        id="college"
        className="w-full border p-2 rounded"
        placeholder="College"
        value={profileForm.college}
        onChange={handleChange}
      />
      <input
        id="year"
        className="w-full border p-2 rounded"
        placeholder="Branch & Year"
        value={profileForm.year}
        onChange={handleChange}
      />

      <div className="flex gap-2">
        <button
          onClick={goToPrevStep}
          type="button"
          className="flex-1 border p-2 rounded"
        >
          Back
        </button>
        <button className="flex-1 bg-indigo-600 text-white p-2 rounded">
          Next
        </button>
      </div>
    </form>
  );
}
