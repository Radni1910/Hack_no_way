import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Briefcase, Loader2, User } from "lucide-react";

const InputField = ({
  label,
  value,
  type = "text",
  onChange,
  placeholder,
  rows = 1,
}) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    {rows > 1 ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
      />
    )}
  </div>
);

const Tag = ({ tag, onRemove }) => (
  <div className="flex items-center bg-indigo-900 text-indigo-300 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2">
    {tag}
    <button
      onClick={() => onRemove(tag)}
      className="ml-2 text-indigo-400 hover:text-indigo-200 font-bold leading-none"
    >
      &times;
    </button>
  </div>
);

const PostProjectPage = () => {
  const navigate = useNavigate();

  const COLLABORATION_TYPES = [
    "Hackathon",
    "Research",
    "Startup",
    "Open Source",
  ];

  const [projectData, setProjectData] = useState({
    title: "",
    tags: [],
    requiredSkills: [],
    collaborationType: COLLABORATION_TYPES[0],
    newTagInput: "",
    newSkillInput: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const userId = auth.currentUser?.uid;

  const handleProjectChange = (field) => (value) =>
    setProjectData((prev) => ({ ...prev, [field]: value }));

  const handleAddTag = (listType, inputField) => {
    const tag = projectData[inputField].trim();
    if (tag && !projectData[listType].includes(tag)) {
      setProjectData((prev) => ({
        ...prev,
        [listType]: [...prev[listType], tag],
        [inputField]: "",
      }));
    }
  };

  const handleRemoveTag = (tagToRemove, listType) => {
    setProjectData((prev) => ({
      ...prev,
      [listType]: prev[listType].filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setMessage("🚨 You must be logged in to post a project.");
      return;
    }

    if (!projectData.title || projectData.requiredSkills.length === 0) {
      setMessage(
        "🚨 Project Title and at least one Required Skill are required."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "projects"), {
        title: projectData.title,
        tags: projectData.tags,
        requiredSkills: projectData.requiredSkills,
        collaborationType: projectData.collaborationType,
        postedBy: userId,
        timestamp: new Date(),
      });

      setMessage("✅ Project successfully posted!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setMessage("❌ Failed to save project. Check console.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 lg:p-8 font-sans flex justify-center">
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
        <header className="border-b border-gray-700 pb-4 mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Briefcase className="w-7 h-7 mr-2 text-indigo-400" />
            Create New Initiative
          </h1>
        </header>

        {message && (
          <div
            className={`p-3 mb-6 rounded-lg text-center font-medium ${
              message.startsWith("✅")
                ? "bg-green-900 text-green-300"
                : "bg-red-900 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Project Title"
            value={projectData.title}
            onChange={handleProjectChange("title")}
            placeholder="A concise name for your initiative"
          />

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Collaboration Type
            </label>
            <select
              value={projectData.collaborationType}
              onChange={(e) =>
                handleProjectChange("collaborationType")(e.target.value)
              }
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500"
            >
              {COLLABORATION_TYPES.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* TAGS */}
          <h2 className="text-xl font-semibold text-gray-200 mt-8 mb-4">
            Tags
          </h2>
          <div className="flex flex-wrap p-2 bg-gray-700 border border-gray-600 rounded-lg mb-4 min-h-[50px]">
            {projectData.tags.map((tag) => (
              <Tag
                key={tag}
                tag={tag}
                onRemove={(t) => handleRemoveTag(t, "tags")}
              />
            ))}
          </div>

          <div className="flex mb-8">
            <input
              value={projectData.newTagInput}
              onChange={(e) =>
                handleProjectChange("newTagInput")(e.target.value)
              }
              className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-l-lg text-white"
              placeholder="e.g., FinTech, AI, Health"
            />
            <button
              type="button"
              onClick={() => handleAddTag("tags", "newTagInput")}
              className="px-4 bg-indigo-600 rounded-r-lg"
            >
              Add Tag
            </button>
          </div>

          {/* SKILLS */}
          <h2 className="text-xl font-semibold text-gray-200 mt-8 mb-4">
            Required Skills
          </h2>
          <div className="flex flex-wrap p-2 bg-gray-700 border border-gray-600 rounded-lg mb-4 min-h-[50px]">
            {projectData.requiredSkills.map((skill) => (
              <Tag
                key={skill}
                tag={skill}
                onRemove={(t) => handleRemoveTag(t, "requiredSkills")}
              />
            ))}
          </div>

          <div className="flex mb-8">
            <input
              value={projectData.newSkillInput}
              onChange={(e) =>
                handleProjectChange("newSkillInput")(e.target.value)
              }
              placeholder="e.g., React, Python"
              className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-l-lg text-white"
            />
            <button
              type="button"
              onClick={() => handleAddTag("requiredSkills", "newSkillInput")}
              className="px-4 bg-indigo-600 rounded-r-lg"
            >
              Add Skill
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl text-lg font-medium"
          >
            {isSubmitting ? "Saving..." : "Post Project"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProjectPage;
