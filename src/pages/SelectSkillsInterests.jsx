import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectSkillsInterests() {
  const navigate = useNavigate();

  const skillsList = [
    "Web Development",
    "App Development",
    "UI/UX Design",
    "Machine Learning",
    "Cyber Security",
    "Cloud Computing",
    "Data Science",
    "Game Development",
    "Blockchain",
    "AI / LLMs",
  ];

  const interestsList = [
    "Hackathons",
    "Technical Clubs",
    "Building Startups",
    "Freelancing",
    "Research & Publications",
    "Open Source Contribution",
  ];

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleSelect = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleContinue = () => {
    // Save to localStorage for now (Later we connect Firebase)
    const userData = {
      skills: selectedSkills,
      interests: selectedInterests,
    };
    localStorage.setItem("user-profile-extra", JSON.stringify(userData));

    navigate("/profile"); // redirect to profile page
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-8">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Select Your <span className="text-indigo-600">Skills</span> &{" "}
          <span className="text-indigo-600">Interests</span>
        </h2>

        {/* SKILLS */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-3">
            {skillsList.map((skill) => (
              <button
                key={skill}
                onClick={() =>
                  toggleSelect(skill, selectedSkills, setSelectedSkills)
                }
                className={`px-6 py-3 rounded-full text-lg font-medium border transition 
                ${
                  selectedSkills.includes(skill)
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* INTERESTS */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Interests
          </h3>
          <div className="flex flex-wrap gap-3">
            {interestsList.map((interest) => (
              <button
                key={interest}
                onClick={() =>
                  toggleSelect(
                    interest,
                    selectedInterests,
                    setSelectedInterests
                  )
                }
                className={`px-6 py-3 rounded-full text-lg font-medium border transition 
                ${
                  selectedInterests.includes(interest)
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* CONTINUE BUTTON */}
        <button
          onClick={handleContinue}
          disabled={selectedSkills.length === 0}
          className={`w-full py-4 text-2xl font-semibold rounded-xl transition
          ${
            selectedSkills.length === 0
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
