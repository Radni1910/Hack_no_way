// src/components/ProfileCard.jsx
import { useState } from "react";

export default function ProfileCard({ profile, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(form);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
          >
            Edit Profile
          </button>
        </div>

        <div className="border-b pb-6 mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">{profile.name}</h1>
          <p className="text-xl text-indigo-600 mt-1">{profile.college}</p>
          <p className="text-gray-500 mt-0.5">{profile.branch}, {profile.year}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3 border-b pb-2">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <h2 className="text-3xl font-extrabold text-indigo-600 mb-6">Edit Profile</h2>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name"
            className="border p-3 rounded-lg" />
          <input name="college" value={form.college} onChange={handleChange} placeholder="College"
            className="border p-3 rounded-lg" />
          <input name="branch" value={form.branch} onChange={handleChange} placeholder="Branch"
            className="border p-3 rounded-lg" />
          <input name="year" value={form.year} onChange={handleChange} placeholder="Year"
            className="border p-3 rounded-lg" />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
