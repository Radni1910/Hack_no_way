import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const QuickProfileCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-xl mb-6">
      <button
        onClick={() => navigate("/profile")}
        className="flex items-center mb-4 w-full text-left hover:opacity-80 transition"
      >
        <div className="w-10 h-10 bg-indigo-500 rounded-full mr-3 flex items-center justify-center text-sm font-bold">
          PR
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Prakriti Ranjan</h3>
          <p className="text-gray-400 text-xs">Information Technology</p>
        </div>
      </button>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => navigate("/postProjectPage")}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-150 shadow-md"
        >
          Post New Project
        </button>

        <button
          onClick={() => navigate("/matchmaking")}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-150 shadow-md"
        >
          Find Teammates
        </button>

        <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition duration-150 shadow-md">
          My Bookmarks
        </button>
      </div>
    </div>
  );
};


const ActivityFeedItem = ({ title, time, source }) => (
  <div className="bg-gray-800 p-4 rounded-xl mb-3 border border-gray-700 hover:border-indigo-600 transition duration-150">
    <p className="text-sm">
      <span className="font-medium text-indigo-400">{source}</span> {title}
    </p>
    <p className="text-xs text-gray-500 mt-1">{time}</p>
  </div>
);

const RecommendedProjectCard = ({ id, title, skills }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-shrink-0 w-64 bg-gray-800 p-4 rounded-xl border border-gray-700 mr-4 shadow-lg hover:shadow-indigo-500/20 transition duration-200">
      <h4 className="font-semibold text-indigo-400 mb-2 truncate">{title}</h4>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">
        {skills.join(", ")}
      </p>

      <button
        onClick={() => navigate(`/project/${id}`)}
        className="text-sm px-3 py-1 bg-green-700/50 text-green-300 rounded-md hover:bg-green-600/70 transition"
      >
        Check it out →
      </button>
    </div>
  );
};

const EventCard = ({ title, date }) => (
  <div className="p-3 border-b border-gray-700 last:border-b-0 flex items-start">
    <span className="text-indigo-400 mr-3 text-lg">📅</span>
    <div>
      <p className="text-sm font-medium hover:text-indigo-300 cursor-pointer">
        {title}
      </p>
      <p className="text-xs text-gray-400 mt-0.5">{date}</p>
    </div>
  </div>
);

const NotificationItem = ({ message, isUnread }) => (
  <div className="flex items-center p-4 rounded-lg hover:bg-gray-700 transition duration-150">
    <span className="mr-3 text-yellow-400">{isUnread ? "•" : "🔔"}</span>
    <p
      className={`text-base ${
        isUnread ? "text-indigo-300 font-semibold" : "text-gray-300"
      }`}
    >
      {message}
    </p>
  </div>
);


const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDesc, setIdeaDesc] = useState("");
  const [ideas, setIdeas] = useState([]);

  const navigate = useNavigate();

  // Fetch ideas in real time
  useEffect(() => {
    const q = query(collection(db, "ideas"), orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setIdeas(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Submit idea
  const handleSubmitIdea = async (e) => {
    e.preventDefault();
    if (!ideaTitle || !ideaDesc) return alert("Please fill in all fields!");

    const user = auth.currentUser;
    await addDoc(collection(db, "ideas"), {
      title: ideaTitle,
      description: ideaDesc,
      createdBy: user?.email || "Guest",
      timestamp: serverTimestamp(),
    });

    setIdeaTitle("");
    setIdeaDesc("");
    setShowModal(false);
  };

  // Dummy data
  const recentActivities = [
    {
      title: 'commented on your project "Campus Navigator"',
      time: "2h ago",
      source: "Priya A.",
    },
    { title: "joined Project X", time: "5h ago", source: "A new member" },
    {
      title: 'accepted your request to join "AI Ethics Research"',
      time: "Yesterday",
      source: "Project Lead",
    },
  ];

  const recommendedProjects = [
    {
      id: "p1",
      title: "AI-Powered Study Buddy",
      skills: ["AIML", "Python", "Firebase"],
    },
    {
      id: "p2",
      title: "Decentralized File Sharing",
      skills: ["Web3", "Solidity", "React"],
    },
    {
      id: "p3",
      title: "Smart Campus IOT Network",
      skills: ["IOT", "Hardware", "Cloud"],
    },
  ];

  const upcomingEvents = [
    { title: "Hackathon Spark (Online)", date: "Oct 26 - Nov 26" },
    { title: "Startup Pitch Night", date: "Dec 5th" },
    { title: "Tailwind Workshop", date: "Dec 12th" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-50 p-4 lg:p-6 font-sans">
      <header className="w-full py-4 mb-6 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </header>

      <div className="w-full lg:grid lg:grid-cols-12 lg:gap-8">
        
        <aside className="lg:col-span-3 mb-8 lg:mb-0">
          <QuickProfileCard />

          <div className="bg-gray-800 p-4 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">
              Quick Stats
            </h3>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Projects Joined:</span>
                <span className="text-white font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>Bookmarks:</span>
                <span className="text-white font-medium">5</span>
              </div>
            </div>
          </div>
        </aside>

        
        <main className="lg:col-span-6 mb-8 lg:mb-0">
          {/* 💡 Moved "Post New Idea" here */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">💡 Your Posted Ideas</h2>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white shadow transition"
            >
              + Post New Idea
            </button>
          </div>

          {ideas.length > 0 ? (
            <div className="space-y-3 mb-8">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-indigo-600 transition duration-150"
                >
                  <h3 className="text-lg font-semibold text-indigo-400">
                    {idea.title}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1">
                    {idea.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Posted by {idea.createdBy} •{" "}
                    {idea.timestamp?.toDate?.().toLocaleString() || "Just now"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-8">
              No ideas posted yet. Click “Post New Idea” to start!
            </p>
          )}

          <h2 className="text-xl font-bold mb-4">Recent Activity Feed</h2>
          {recentActivities.map((a, i) => (
            <ActivityFeedItem key={i} {...a} />
          ))}

          <h2 className="text-xl font-bold mt-8 mb-4">Recommended Projects</h2>
          <div className="scrollbar-no overflow-x-hidden pb-2">
            <div className="flex gap-4 pr-4 snap-x snap-mandatory">
              {recommendedProjects.map((project) => (
                <RecommendedProjectCard key={project.id} {...project} />
              ))}
            </div>
          </div>
        </main>

        <aside className="lg:col-span-3">
          <div className="bg-gray-800 p-4 rounded-xl shadow-xl mb-6">
            <div className="flex justify-between items-center mb-3 border-b border-gray-700 pb-2">
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <button
                onClick={() => navigate("/events")}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition"
              >
                View All →
              </button>
            </div>

            {upcomingEvents.map((event, i) => (
              <EventCard key={i} {...event} />
            ))}
          </div>

          <div className="bg-gray-800 p-4 rounded-xl shadow-xl">
            <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">
              Notifications
            </h3>
            <div className="space-y-1 pt-2">
              <NotificationItem
                message="Project Join Request Received"
                isUnread={true}
              />
              <NotificationItem
                message="New Message in Chat (Project X)"
                isUnread={true}
              />
              <NotificationItem
                message="You were matched with a new teammate!"
                isUnread={false}
              />
            </div>
          </div>
        </aside>
      </div>

      {/* Modal for Posting Idea */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-gray-800 p-6 rounded-xl w-96 shadow-2xl animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-indigo-400">
              Post a New Idea 💡
            </h2>
            <form onSubmit={handleSubmitIdea} className="space-y-4">
              <input
                type="text"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="Enter your idea title"
                className="w-full bg-gray-700 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={ideaDesc}
                onChange={(e) => setIdeaDesc(e.target.value)}
                placeholder="Describe your idea..."
                className="w-full bg-gray-700 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
                >
                  Post Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
