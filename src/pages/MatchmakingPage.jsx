import React, { useState, useMemo } from "react";
import { Sparkles, User, Briefcase } from "lucide-react";
import ChatRoom from "../components/ChatRoom"; // ✅ Import your ChatRoom component


const MOCK_USER_PROFILE = {
  skills: ["React", "Tailwind", "Figma", "UI/UX", "Machine Learning"],
  interests: ["Sustainable Tech", "Gaming", "AI & ML"],
};

const calculateMatchScore = (userProfile, candidateProfile) => {
  const userSkills = new Set(userProfile.skills || []);
  const userInterests = new Set(userProfile.interests || []);
  const candidateSkills = candidateProfile.skills || [];

  let intersectionCount = 0;
  let maxPossibleScore = 0;

  candidateSkills.forEach((skill) => {
    maxPossibleScore += 3;
    if (userSkills.has(skill)) intersectionCount += 3;
  });

  if (candidateProfile.type === "Project" || candidateProfile.type === "User") {
    userInterests.forEach((interest) => {
      maxPossibleScore += 2;
      if (interest === "Sustainable Tech" && candidateSkills.includes("GIS"))
        intersectionCount += 2;
      else if (
        interest === "AI & ML" &&
        candidateSkills.includes("Machine Learning")
      )
        intersectionCount += 2;
    });
  }

  if (maxPossibleScore === 0) return 0;
  return Math.min(
    100,
    Math.round((intersectionCount / maxPossibleScore) * 100)
  );
};


const DUMMY_PROFILES = [
  {
    id: 1,
    name: "Radni Amonkar",
    role: "Full-Stack Developer",
    bio: "Seeking a team for a mental health app. Proficient in React and Node.js.",
    skills: ["React", "Node.js", "MongoDB", "Tailwind"],
    type: "User",
  },
  {
    id: 2,
    name: "Study Buddy",
    status: "MVP Ready",
    summary:
      "A project aiming to create personalized learning paths using Generative AI.",
    skills: ["Python", "Machine Learning", "NLP"],
    type: "Project",
    domains: ["AI & ML"],
  },
  {
    id: 3,
    name: "Prakriti Ranjan",
    role: "UI/UX Designer",
    bio: "Looking for a fun, short-term project. Expert in Figma and prototyping.",
    skills: ["Figma", "UI/UX", "Prototyping"],
    type: "User",
  },
  {
    id: 4,
    name: "Sustainable City Map",
    status: "Idea",
    summary:
      "Map visualization of urban sustainability metrics. Needs data scientists.",
    skills: ["Data Science", "React", "GIS", "Data Viz"],
    type: "Project",
    domains: ["Sustainable Tech"],
  },
  {
    id: 5,
    name: "Ananya",
    role: "Junior Developer",
    bio: "New to coding, looking for a beginner-friendly project in any domain.",
    skills: ["JavaScript", "HTML", "CSS"],
    type: "User",
  },
  {
    id: 6,
    name: "Game Dev Team",
    status: "Prototype",
    summary: "Building a pixel-art platformer game using basic JavaScript.",
    skills: ["JavaScript", "Pixel Art", "Tone.js"],
    type: "Project",
    domains: ["Gaming"],
  },
];

const ProfileCard = ({ profile, onConnect, matchScore }) => (
  <div className="relative bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 hover:shadow-2xl transition duration-300 flex flex-col h-full">
    {matchScore !== null && (
      <div
        className={`absolute top-0 right-0 p-2 rounded-tr-xl rounded-bl-xl text-xs font-bold text-white ${
          matchScore >= 70 ? "bg-indigo-600" : "bg-green-600"
        }`}
      >
        {matchScore}% Match
      </div>
    )}

    <div className="flex-grow">
      <div className="flex items-center space-x-2 mb-2">
        {profile.type === "User" ? (
          <User className="w-5 h-5 text-indigo-400" />
        ) : (
          <Briefcase className="w-5 h-5 text-green-400" />
        )}
        <h3 className="text-xl font-bold text-white">{profile.name}</h3>
      </div>

      <p className="text-sm text-gray-400 mb-3">
        {profile.role || profile.status}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {profile.skills.map((skill) => (
          <span
            key={skill}
            className="bg-indigo-900 text-indigo-200 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <p className="text-gray-300 text-sm line-clamp-3 mb-4">
        {profile.bio || profile.summary}
      </p>
    </div>

    <button
      onClick={() => onConnect(profile.id)}
      className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition mt-4 shadow-md hover:shadow-lg"
    >
      Connect / View Details
    </button>
  </div>
);

const FilterSection = ({ title, options, selected, onChange }) => (
  <div className="mb-6">
    <h4 className="text-md font-semibold text-gray-200 mb-2 border-b border-gray-700 pb-1">
      {title}
    </h4>
    {options.map((option) => (
      <label
        key={option}
        className="flex items-center text-sm text-gray-300 mt-2"
      >
        <input
          type="checkbox"
          checked={selected.includes(option)}
          onChange={() => onChange(option)}
          className="h-4 w-4 text-indigo-500 border-gray-600 bg-gray-700 rounded focus:ring-indigo-500"
        />
        <span className="ml-2">{option}</span>
      </label>
    ))}
  </div>
);


const MatchmakingPage = ({ currentUserProfile = MOCK_USER_PROFILE }) => {
  const initialProfiles = useMemo(() => {
    return DUMMY_PROFILES.map((profile) => ({
      ...profile,
      matchScore: calculateMatchScore(currentUserProfile, profile),
    })).sort((a, b) => b.matchScore - a.matchScore);
  }, [currentUserProfile]);

  const [profiles] = useState(initialProfiles);
  const [filters, setFilters] = useState({
    type: ["User", "Project"],
    skills: [],
    status: [],
  });
  const [selectedChatId, setSelectedChatId] = useState(null); 

  const uniqueSkills = [
    ...new Set(DUMMY_PROFILES.flatMap((p) => p.skills)),
  ].sort();
  const uniqueStatuses = [
    ...new Set(
      DUMMY_PROFILES.filter((p) => p.type === "Project").map((p) => p.status)
    ),
  ].sort();

  const handleFilterChange = (filterType, option) => {
    setFilters((prev) => {
      const currentList = prev[filterType];
      return currentList.includes(option)
        ? {
            ...prev,
            [filterType]: currentList.filter((item) => item !== option),
          }
        : { ...prev, [filterType]: [...currentList, option] };
    });
  };

  const handleConnect = (id) => {
    console.log("Connecting to chat room for ID: ${id}");
    setSelectedChatId(id); 
  };

  const filteredProfiles = profiles.filter((profile) => {
    const typeMatch = filters.type.includes(profile.type);
    const skillMatch =
      filters.skills.length === 0 ||
      profile.skills.some((skill) => filters.skills.includes(skill));

    let statusMatch = true;
    if (profile.type === "Project") {
      statusMatch =
        filters.status.length === 0 || filters.status.includes(profile.status);
    }

    return typeMatch && skillMatch && statusMatch;
  });

  const recommendedProfiles = filteredProfiles.filter(
    (p) => p.matchScore >= 60
  );
  const generalProfiles = filteredProfiles.filter((p) => p.matchScore < 60);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 lg:p-10 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white">Find Your Match</h1>
        <p className="text-gray-400 mt-1">
          Discover users seeking teams or projects seeking contributors.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
       
        <aside className="lg:w-1/4 w-full bg-gray-800 p-6 rounded-xl shadow-xl h-fit sticky top-6">
          <h3 className="text-xl font-bold text-white mb-4">Filters</h3>

          <FilterSection
            title="Profile Type"
            options={["User", "Project"]}
            selected={filters.type}
            onChange={(option) => handleFilterChange("type", option)}
          />

          <FilterSection
            title="Skills / Expertise"
            options={uniqueSkills}
            selected={filters.skills}
            onChange={(option) => handleFilterChange("skills", option)}
          />

          {filters.type.includes("Project") && (
            <FilterSection
              title="Project Status"
              options={uniqueStatuses}
              selected={filters.status}
              onChange={(option) => handleFilterChange("status", option)}
            />
          )}

          <button
            onClick={() =>
              setFilters({ type: ["User", "Project"], skills: [], status: [] })
            }
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Clear All Filters
          </button>
        </aside>

       
        <main className="lg:w-3/4 w-full">
          {recommendedProfiles.length > 0 && (
            <div className="mb-10">
              <h2 className="flex items-center text-2xl font-bold text-indigo-400 mb-4 pb-2 border-b-2 border-indigo-700">
                <Sparkles className="w-6 h-6 mr-2 text-yellow-500 fill-yellow-500" />
                Top Recommendations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedProfiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    onConnect={handleConnect}
                    matchScore={profile.matchScore}
                  />
                ))}
              </div>
            </div>
          )}

        
          <h2 className="text-2xl font-bold text-gray-300 mb-4 pb-2 border-b-2 border-gray-700">
            Other Matches ({generalProfiles.length})
          </h2>

          {generalProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generalProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onConnect={handleConnect}
                  matchScore={profile.matchScore}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-10 bg-gray-800 rounded-xl shadow-md">
              <p className="text-lg text-gray-400">
                No general matches found. Try clearing your filters!
              </p>
            </div>
          )}

          
          {selectedChatId && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-900 p-6 rounded-xl w-full max-w-lg shadow-xl relative">
                <button
                  onClick={() => setSelectedChatId(null)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
                <ChatRoom chatRoomId={`room-${selectedChatId}`} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MatchmakingPage;
