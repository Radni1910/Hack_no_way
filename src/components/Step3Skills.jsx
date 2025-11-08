import React from "react";

const popularSkills = [
  "React",
  "Python",
  "JavaScript",
  "Machine Learning",
  "Cloud",
];
const popularInterests = ["Cybersecurity", "AI", "Gaming", "FinTech"];

export default function Step3Skills({
  profileForm,
  setProfileForm,
  handleFinalSignUp,
  goToPrevStep,
}) {
  const update = (key, value) =>
    setProfileForm({ ...profileForm, [key]: value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFinalSignUp();
      }}
      className="space-y-4"
    >
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Skills"
        value={profileForm.skills}
        onChange={(e) => update("skills", e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Interests"
        value={profileForm.interests}
        onChange={(e) => update("interests", e.target.value)}
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={goToPrevStep}
          className="flex-1 border p-2 rounded"
        >
          Back
        </button>
        <button className="flex-1 bg-indigo-600 text-white p-2 rounded">
          Complete Signup
        </button>
      </div>
    </form>
  );
}
