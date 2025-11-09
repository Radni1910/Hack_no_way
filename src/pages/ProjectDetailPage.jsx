import React, { useState, useEffect } from "react";
import { ChevronUp, Bookmark, MessageSquare, Loader2 } from "lucide-react";


const Tag = ({ tag }) => (
  <div className="bg-indigo-900 text-indigo-300 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2 shadow-sm">
    {tag}
  </div>
);


const TeamMemberCard = ({ name, role }) => (
  <div className="flex items-center p-3 bg-gray-700 border border-gray-600 rounded-xl shadow-md mr-4 mb-4 transition duration-150 hover:bg-gray-600">
    <div className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center text-indigo-300 font-bold text-lg mr-3 shadow-inner">
      {name[0]}
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-100">{name}</p>
      <p className="text-xs text-gray-400">{role}</p>
    </div>
  </div>
);


const CommentCard = ({ user, text, timestamp }) => (
  <div className="border-b border-gray-700 pb-3 mb-3">
    <p className="text-sm font-semibold text-indigo-400">{user}</p>
    <p className="text-gray-300 text-sm mt-1">{text}</p>
    <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
  </div>
);


const ProjectDetailPage = ({ projectId = "sample-123" }) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [newComment, setNewComment] = useState("");

  
  useEffect(() => {
    
    setMessage("");
    setIsLoading(true);

    setTimeout(() => {
      setProject({
        id: projectId,
        title: "Decentralized Campus Voting System",
        owner: "Prakriti Ranjan",
        description:
          "This project aims to build a secure, transparent, and immutable blockchain-based voting system for campus elections. We are using React for the front-end, Solidity for smart contracts, and IPFS for data storage. The goal is to finish a fully functional MVP by the end of the semester.",
        collaborationType: "Research",
        requiredSkills: ["Solidity", "React", "Node.js", "Cryptography"],
        tags: ["Blockchain", "FinTech", "Security"],
        upvotes: 42,
        team: [
          { name: "Radni", role: "Solidity Dev" },
          { name: "Prakriti", role: "Front-end Dev" },
          { name: "Ananya", role: "UX Designer" },
        ],
        comments: [
          {
            user: "Eve Garcia",
            text: "This is a fantastic idea!",
            timestamp: "2 hours ago",
          },
          {
            user: "Frank Hall",
            text: "What's the scope of the MVP?",
            timestamp: "1 hour ago",
          },
        ],
      });
      setIsLoading(false);
    }, 1000);
  }, [projectId]);


  const handleJoinRequest = () => {
    setIsJoining(true);
    setMessage("");
    console.log(`Sending join request for project ${project.title}`);

    setTimeout(() => {
      setMessage(
        "✅ Your request to join the project has been sent successfully!"
      );
      setIsJoining(false);
    }, 1500);
  };

  const handleUpvote = () => {
    setProject((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }));
    setMessage("👍 Project successfully upvoted!");
    setTimeout(() => setMessage(""), 3000);
  };


  const handleBookmark = () => {
    setMessage("🔖 Project successfully bookmarked for later!");
    setTimeout(() => setMessage(""), 3000);
  };

 
  const handlePostComment = () => {
    if (!newComment.trim()) {
      setMessage("🚫 Comment cannot be empty.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    const newCommentObj = {
      user: "Prakriti Ranjan", 
      text: newComment.trim(),
      timestamp: "just now",
    };

    setProject((prev) => ({
      ...prev,
      comments: [newCommentObj, ...prev.comments],
    }));
    setNewComment("");
    setMessage("💬 Comment posted successfully!");
    setTimeout(() => setMessage(""), 3000);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-12">
        <div className="flex items-center text-xl text-indigo-400">
          <Loader2 className="w-6 h-6 mr-3 animate-spin" />
          Loading project details...
        </div>
      </div>
    );
  }

  
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-12">
        <div className="text-xl text-red-500">
          <p>🚨 Project not found.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6 lg:p-12 font-sans">
      <div className="flex-1 bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-700 w-full h-full overflow-y-auto">
       
        {message && (
          <div
            className={`p-4 mb-6 rounded-lg text-center font-medium shadow-lg transition duration-300 ${
              message.startsWith("✅")
                ? "bg-green-900 text-green-300 border border-green-700"
                : message.startsWith("👍") ||
                  message.startsWith("🔖") ||
                  message.startsWith("💬")
                ? "bg-indigo-900 text-indigo-300 border border-indigo-700"
                : "bg-red-900 text-red-300 border border-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <header className="border-b border-gray-700 pb-6 mb-6">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            {project.title}
          </h1>
          <p className="text-lg text-indigo-400 font-medium mb-4">
            Collaboration Type: {project.collaborationType} | Owner:{" "}
            {project.owner}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <button
              onClick={handleUpvote}
              className="flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors shadow-md border border-gray-600"
            >
              <ChevronUp className="w-5 h-5 mr-2 text-green-400" />
              Upvote ({project.upvotes})
            </button>

            <button
              onClick={handleBookmark}
              className="flex items-center px-4 py-2 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 transition-colors shadow-md border border-gray-600"
            >
              <Bookmark className="w-5 h-5 mr-2 text-yellow-400" />
              Bookmark
            </button>

            <button
              onClick={handleJoinRequest}
              disabled={isJoining}

              className={`flex-grow sm:flex-grow-0 px-6 py-3 text-lg font-semibold rounded-xl transition-all shadow-xl max-w-sm sm:max-w-xs
                                ${
                                  isJoining
                                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.01]"
                                }
                            `}
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin inline-block" />{" "}
                  Requesting...
                </>
              ) : (
                "🤝 Send Join Request"
              )}
            </button>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-3 border-l-4 border-indigo-500 pl-3">
            Project Overview
          </h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </p>
        </section>

        <section className="mb-8 p-6 bg-gray-700 rounded-xl border border-gray-600 shadow-inner">
          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Required Skills
          </h2>
          <div className="flex flex-wrap mb-6">
            {project.requiredSkills.map((skill) => (
              <Tag key={skill} tag={skill} />
            ))}
          </div>

          <h2 className="text-xl font-semibold text-gray-200 mb-4">
            Tags & Topics
          </h2>
          <div className="flex flex-wrap">
            {project.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4 border-l-4 border-indigo-500 pl-3">
            Current Team (3/5)
          </h2>
          <div className="flex flex-wrap -mr-4">
            {project.team.map((member, index) => (
              <TeamMemberCard
                key={index}
                name={member.name}
                role={member.role}
              />
            ))}
          </div>
        </section>

        <section className="mt-10 pt-6 border-t border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4 flex items-center border-l-4 border-indigo-500 pl-3">
            <MessageSquare className="w-6 h-6 mr-2 text-indigo-400" /> Comments
          </h2>

          <div className="mb-6 p-4 bg-gray-700 rounded-xl border border-gray-600">
            <textarea
              placeholder="Add a comment or question..."
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-3 mb-2 bg-gray-900 border border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-400 transition"
            />
            <button
              onClick={handlePostComment}
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 shadow-md transition"
            >
              Post Comment
            </button>
          </div>
    
          <div className="space-y-4">
            {project.comments.map((comment, index) => (
              <CommentCard key={index} {...comment} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
