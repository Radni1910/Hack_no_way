import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const GitHubIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.2-.2-2.32-.58-3.4a.12.12 0 0 0-.08-.09c-.45-.16-1.5-.4-3-1.4.37-.94.75-2.67.26-4.24-.52-1.76-2.61-3.08-4.73-3.1-2.12.02-4.21 1.34-4.73 3.1-.49 1.57-.11 3.3.26 4.24-1.5.76-2.55 1.05-3 1.4-.08.02-.15.06-.08.09-.38 1.08-.46 2.19-.38 3.4 0 3.5 3 5.5 6 5.5-1 0-2 0-3.5 1V22" />
  </svg>
);
const LinkedInIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const LinkIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.74 1.74" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.74-1.74" />
  </svg>
);
const PencilIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const Chip = ({ text }) => (
  <span className="inline-block bg-indigo-700/30 text-indigo-300 text-sm font-medium px-3 py-1 rounded-full shadow-sm border border-indigo-700">
    {text}
  </span>
);

const ProjectCard = ({ title, description }) => (
  <div className="p-4 border border-gray-700 rounded-xl bg-gray-800 transition duration-300 hover:shadow-lg hover:shadow-indigo-900/20">
    <h4 className="text-lg font-semibold text-white mb-1">{title}</h4>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const FormField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-300 mb-1"
    >
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-800 text-white transition duration-150 placeholder-gray-500"
    />
  </div>
);

export default function App() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Get user's display name, with fallback to email name part
  const getUserDisplayName = () => {
    if (user?.displayName && user.displayName.trim() !== "") {
      return user.displayName;
    }
    // If no display name, try to extract name from email
    if (user?.email) {
      const emailName = user.email.split("@")[0];
      // Capitalize first letter
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    return ""; // Return empty string if no name available
  };

  // Create default profile dynamically based on current user
  const getDefaultProfile = () => ({
    name: getUserDisplayName(),
    college: "GEC",
    branch: "Computer Science",
    year: "2nd Year",
    skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Firebase"],
    interests: ["Open Source", "Gaming", "Data Visualization"],
    links: {
      github: "https://github.com/Radni1910",
      linkedin: "https://linkedin.com/in/Radni-Amonkar",
      portfolio: "https://kailawson.dev",
    },
    projects: [
      {
        title: "Real-time Chat App",
        description:
          "Built a full-stack chat application using React and Firestore.",
      },
      {
        title: "Visualization Engine",
        description:
          "Developed a D3-based engine for rendering dynamic financial data.",
      },
    ],
  });

  const [profile, setProfile] = useState(getDefaultProfile());
  const [draftProfile, setDraftProfile] = useState(getDefaultProfile());
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);

  // Update profile when user changes
  useEffect(() => {
    const updatedProfile = getDefaultProfile();
    setProfile(updatedProfile);
    setDraftProfile(updatedProfile);
  }, [user]);

  const handleEditChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name === "skills" || name === "interests") {
        // Convert comma-separated string to array
        setDraftProfile((prev) => ({
          ...prev,
          [name]: value
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
        }));
      } else if (name in draftProfile.links) {
        setDraftProfile((prev) => ({
          ...prev,
          links: { ...prev.links, [name]: value },
        }));
      } else {
        setDraftProfile((prev) => ({ ...prev, [name]: value }));
      }
    },
    [draftProfile.links]
  );

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol.startsWith("http");
    } catch (e) {
      return string === "";
    }
  };

  const handleSave = () => {
    if (!draftProfile.name || !draftProfile.college || !draftProfile.branch) {
      setMessage({
        type: "error",
        text: "Name, College, and Branch are required fields.",
      });
      return;
    }

    if (
      !isValidUrl(draftProfile.links.github) ||
      !isValidUrl(draftProfile.links.linkedin) ||
      !isValidUrl(draftProfile.links.portfolio)
    ) {
      setMessage({
        type: "error",
        text: "Please ensure all professional links are valid URLs (starting with http/https).",
      });
      return;
    }

    setProfile(draftProfile);
    setIsEditing(false);
    setMessage({ type: "success", text: "Profile saved successfully!" });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    setDraftProfile(profile);
    setIsEditing(false);
    setMessage(null);
  };

  const handleLogout = () => {
    console.log("User logged out.");

    // Reset to default profile with current user info
    const resetProfile = getDefaultProfile();

    setProfile(resetProfile);
    setDraftProfile(resetProfile);
    setIsEditing(false);
    setMessage({ type: "success", text: "Logged out successfully." });
    setTimeout(() => setMessage(null), 3000);
    auth.signOut(); // Firebase logout
    navigate("/"); // Go back to Landing page
  };

  const renderLink = (name, url, Icon) => {
    if (!url) return null;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 px-4 py-2 border border-indigo-700 rounded-xl text-indigo-300 font-medium hover:bg-indigo-800/50 transition duration-200 shadow-md w-full md:w-auto justify-center"
      >
        <Icon className="w-5 h-5" />
        <span>{name}</span>
      </a>
    );
  };

  const messageClasses = message
    ? message.type === "error"
      ? "bg-red-900/30 text-red-300 border border-red-700"
      : "bg-green-900/30 text-green-300 border border-green-700"
    : "";

  const displayName = getUserDisplayName();

  // If no display name, don't render the profile page
  if (!displayName) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen bg-gray-950 font-sans">
        <div className="bg-gray-900 rounded-2xl shadow-2xl shadow-indigo-900/20 p-6 md:p-10 border border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            Profile not available
          </h2>
          <p className="text-gray-400 mt-2">
            Please ensure you're logged in with a valid account.
          </p>
        </div>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen bg-gray-950 font-sans">
        <div className="bg-gray-900 rounded-2xl shadow-2xl shadow-indigo-900/20 p-6 md:p-10 border border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-800 pb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                {profile.name}
              </h1>
              <p className="text-xl text-indigo-400 mt-2">{profile.college}</p>
              <p className="text-lg text-gray-400">
                {profile.branch}, {profile.year}
              </p>
            </div>
            <button
              onClick={() => {
                setDraftProfile(profile);
                setIsEditing(true);
                setMessage(null);
              }}
              className="flex items-center space-x-2 px-5 py-2 mt-4 md:mt-0 bg-indigo-600 text-white text-base font-medium rounded-xl hover:bg-indigo-500 transition duration-150 shadow-lg shadow-indigo-500/30"
            >
              <PencilIcon />
              <span>Edit Profile</span>
            </button>
          </div>

          {message && (
            <div
              className={`p-3 mb-6 rounded-lg text-center font-medium ${messageClasses}`}
            >
              {message.text}
            </div>
          )}

          {/* Links Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-4">Connect</h3>
            <div className="flex flex-wrap gap-4">
              {renderLink("GitHub", profile.links.github, GitHubIcon)}
              {renderLink("LinkedIn", profile.links.linkedin, LinkedInIcon)}
              {renderLink("Portfolio", profile.links.portfolio, LinkIcon)}
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <Chip key={index} text={skill} />
              ))}
            </div>
          </div>

          {/* Interests Section */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
              Interests
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile.interests.map((interest, index) => (
                <Chip key={index} text={interest} />
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">
              Past Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((project, index) => (
                <ProjectCard
                  key={index}
                  title={project.title}
                  description={project.description}
                />
              ))}
            </div>
          </div>
        </div>

        {/* LOGOUT BUTTON - Centered at the bottom */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-red-700 text-white rounded-xl hover:bg-red-600 transition duration-150 font-medium shadow-lg shadow-red-700/30"
          >
            Sign Out / Logout
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER EDIT MODE ---
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto min-h-screen bg-gray-950 font-sans">
      <div className="bg-gray-900 rounded-2xl shadow-2xl shadow-indigo-900/20 p-6 md:p-10 border border-gray-800">
        <h2 className="text-3xl font-extrabold text-indigo-400 mb-8">
          Edit Profile Details
        </h2>

        {message && (
          <div
            className={`p-3 mb-6 rounded-lg text-center font-medium ${messageClasses}`}
          >
            {message.text}
          </div>
        )}

        {/* Only show the form if we have a display name */}
        {displayName ? (
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-800 pb-6">
              <FormField
                id="name"
                label="Full Name"
                value={draftProfile.name}
                onChange={handleEditChange}
                placeholder="e.g., Jane Doe"
                required
              />
              <FormField
                id="college"
                label="College/University"
                value={draftProfile.college}
                onChange={handleEditChange}
                placeholder="e.g., State University of Technology"
                required
              />
              <FormField
                id="branch"
                label="Branch/Major"
                value={draftProfile.branch}
                onChange={handleEditChange}
                placeholder="e.g., Electrical Engineering"
                required
              />
              <FormField
                id="year"
                label="Year/Status"
                value={draftProfile.year}
                onChange={handleEditChange}
                placeholder="e.g., 3rd Year"
                required
              />
            </div>

            {/* Skills and Interests (Textarea for easy editing) */}
            <div className="border-b border-gray-800 pb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Skills & Interests
              </h3>
              <div className="space-y-6">
                <label
                  htmlFor="skills-edit"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Skills (Comma separated)
                </label>
                <textarea
                  id="skills-edit"
                  name="skills"
                  rows="3"
                  value={draftProfile.skills.join(", ")}
                  onChange={handleEditChange}
                  placeholder="JavaScript, React, Firebase, Python"
                  className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-800 text-white placeholder-gray-500"
                ></textarea>

                <label
                  htmlFor="interests-edit"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Interests (Comma separated)
                </label>
                <textarea
                  id="interests-edit"
                  name="interests"
                  rows="3"
                  value={draftProfile.interests.join(", ")}
                  onChange={handleEditChange}
                  placeholder="Robotics, Reading, Open Source"
                  className="mt-1 block w-full px-4 py-2 border border-gray-700 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-gray-800 text-white placeholder-gray-500"
                ></textarea>
              </div>
            </div>

            {/* Social Links */}
            <div className="pb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                Professional Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  id="github"
                  label="GitHub URL"
                  type="url"
                  value={draftProfile.links.github}
                  onChange={handleEditChange}
                  placeholder="https://github.com/your-username"
                />
                <FormField
                  id="linkedin"
                  label="LinkedIn URL"
                  type="url"
                  value={draftProfile.links.linkedin}
                  onChange={handleEditChange}
                  placeholder="https://linkedin.com/in/your-username"
                />
                <FormField
                  id="portfolio"
                  label="Portfolio URL"
                  type="url"
                  value={draftProfile.links.portfolio}
                  onChange={handleEditChange}
                  placeholder="https://your-site.com"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-xl font-bold text-white">
              Profile not available
            </h3>
            <p className="text-gray-400 mt-2">
              Please ensure you're logged in with a valid account.
            </p>
          </div>
        )}

        {/* Action Buttons - only show if we have a display name */}
        {displayName && (
          <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-800">
            <button
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-700 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition duration-150 font-medium shadow-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition duration-150 font-medium shadow-lg shadow-indigo-500/30"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* LOGOUT BUTTON - Centered at the bottom */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleLogout}
          className="px-8 py-3 bg-red-700 text-white rounded-xl hover:bg-red-600 transition duration-150 font-medium shadow-lg shadow-red-700/30"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
