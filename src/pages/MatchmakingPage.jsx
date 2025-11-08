import React, { useState } from 'react';

// Reusable components (assuming they are defined elsewhere or simplified here)
const ProfileCard = ({ profile, onConnect }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300">
        <h3 className="text-xl font-bold text-indigo-700">{profile.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{profile.role || profile.status}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map(skill => (
                <span key={skill} className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
            ))}
        </div>

        <p className="text-gray-700 text-sm line-clamp-3 mb-4">{profile.bio || profile.summary}</p>
        
        <button 
            onClick={() => onConnect(profile.id)}
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
            Connect
        </button>
    </div>
);

const FilterSection = ({ title, options, selected, onChange }) => (
    <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-800 mb-2 border-b pb-1">{title}</h4>
        {options.map(option => (
            <label key={option} className="flex items-center text-sm text-gray-700 mt-2">
                <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => onChange(option)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2">{option}</span>
            </label>
        ))}
    </div>
);

// --- Dummy Data ---
const DUMMY_PROFILES = [
    { id: 1, name: "Alice J.", role: "Full-Stack Developer", bio: "Seeking a team for a mental health app. Proficient in React and Node.js.", skills: ["React", "Node.js", "MongoDB", "Tailwind"], type: "User" },
    { id: 2, name: "AI Study Buddy", status: "MVP Ready", summary: "A project aiming to create personalized learning paths using Generative AI.", skills: ["Python", "Machine Learning", "NLP"], type: "Project" },
    { id: 3, name: "Bob K.", role: "UI/UX Designer", bio: "Looking for a fun, short-term project. Expert in Figma and prototyping.", skills: ["Figma", "UI/UX", "Prototyping"], type: "User" },
    { id: 4, name: "Sustainable City Map", status: "Idea", summary: "Map visualization of urban sustainability metrics. Needs data scientists.", skills: ["Data Science", "React", "GIS", "Data Viz"], type: "Project" },
];

export const MatchmakingPage = () => {
    const [profiles, setProfiles] = useState(DUMMY_PROFILES);
    const [filters, setFilters] = useState({
        type: ["User", "Project"],
        skills: [],
        status: [],
    });
    
    // Extracted Unique Options for Filters
    const uniqueSkills = [...new Set(DUMMY_PROFILES.flatMap(p => p.skills))].sort();
    const uniqueStatuses = [...new Set(DUMMY_PROFILES.filter(p => p.type === 'Project').map(p => p.status))].sort();

    const handleFilterChange = (filterType, option) => {
        setFilters(prev => {
            const currentList = prev[filterType];
            if (currentList.includes(option)) {
                return { ...prev, [filterType]: currentList.filter(item => item !== option) };
            } else {
                return { ...prev, [filterType]: [...currentList, option] };
            }
        });
    };

    const handleConnect = (id) => {
        alert(Connecting with ID: ${id});
        // In a real application, this would trigger an API call to send a connection request.
    };
    
    // Simple Filtering Logic
    const filteredProfiles = profiles.filter(profile => {
        const typeMatch = filters.type.includes(profile.type);
        const skillMatch = filters.skills.length === 0 || profile.skills.some(skill => filters.skills.includes(skill));
        
        let statusMatch = true;
        if (profile.type === 'Project') {
            statusMatch = filters.status.length === 0 || filters.status.includes(profile.status);
        }
        
        return typeMatch && skillMatch && statusMatch;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-10">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">Find Your Match 🔍</h1>
                <p className="text-gray-600 mt-1">Discover users seeking teams or projects seeking contributors.</p>
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* 1. Filtering Sidebar */}
                <aside className="lg:w-1/4 w-full bg-white p-6 rounded-xl shadow-md h-fit sticky top-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Filters</h3>
                    
                    <FilterSection 
                        title="Profile Type" 
                        options={["User", "Project"]}
                        selected={filters.type}
                        onChange={(option) => handleFilterChange('type', option)}
                    />
                    
                    <FilterSection 
                        title="Skills / Expertise" 
                        options={uniqueSkills}
                        selected={filters.skills}
                        onChange={(option) => handleFilterChange('skills', option)}
                    />

                    {filters.type.includes('Project') && (
                        <FilterSection 
                            title="Project Status" 
                            options={uniqueStatuses}
                            selected={filters.status}
                            onChange={(option) => handleFilterChange('status', option)}
                        />
                    )}
                    
                    <button onClick={() => setFilters({ type: ["User", "Project"], skills: [], status: [] })}
                        className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Clear All Filters
                    </button>
                </aside>

                {/* 2. Results Grid */}
                <main className="lg:w-3/4 w-full">
                    <div className="mb-4 text-gray-600 font-medium">
                        Showing *{filteredProfiles.length}* matches.
                    </div>
                    
                    {filteredProfiles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProfiles.map(profile => (
                                <ProfileCard key={profile.id} profile={profile} onConnect={handleConnect} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-10 bg-white rounded-xl shadow-md">
                            <p className="text-lg text-gray-500">No matches found with current filters. Try broadening your search!</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};