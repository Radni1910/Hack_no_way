import React, { useState, useEffect } from "react";
import {
  Layers,
  Zap,
  Users,
  MessageSquare,
  Code,
  Search,
  LogIn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


const FeatureCard = ({ icon: Icon, title, description, index }) => {
  const [isVisible, setIsVisible] = useState(false);

 
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 100 + index * 150); 

    return () => clearTimeout(timeout);
  }, [index]);

  return (
    
    <div
      className={`p-6 bg-gray-800 rounded-xl shadow-xl border border-gray-700 h-full transform transition duration-500 ease-out cursor-pointer 
            ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }
            hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500`}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-full mb-4 shadow-indigo-500/50 shadow-md">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};


const Landing = () => {
  const navigate = useNavigate();

  const [headerVisible, setHeaderVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  
  useEffect(() => {
    setTimeout(() => setHeaderVisible(true), 200);
    setTimeout(() => setCtaVisible(true), 600);
  }, []);

  const features = [
    {
      icon: Search,
      title: "Project Discovery",
      description:
        "Browse the latest and most innovative student projects, filter by required skills, and find initiatives needing your expertise.",
    },
    {
      icon: Code,
      title: "Seamless Submission",
      description:
        "Easily submit your own project ideas, define the necessary roles, and instantly broadcast your call for collaborators to the community.",
    },
    {
      icon: Users,
      title: "Focused Collaboration",
      description:
        "Manage your team's composition, track progress, and use our communication tools to keep your project moving forward smoothly.",
    },
    {
      icon: MessageSquare,
      title: "Integrated Chat",
      description:
        "Discuss, troubleshoot, and brainstorm with your team and the wider community using project-specific, integrated messaging.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 font-sans antialiased text-gray-100 relative overflow-hidden">
     
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-900/40 rounded-full filter blur-3xl opacity-30 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-900/40 rounded-full filter blur-3xl opacity-30 animate-pulse-slow delay-1000"></div>

     
      <header className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="text-2xl font-bold text-white">
          <span className="text-indigo-500">Campus</span>Verse
        </div>

      
        <button
          onClick={() => navigate("/auth")}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Sign In / Sign Up
        </button>
      </header>

      
      <section className="relative py-20 md:py-32 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 z-10">
          <h1
            className={`text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight transform transition duration-1000 ease-out 
                        ${
                          headerVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
          >
            Welcome to <span className="text-indigo-500">CampusVerse</span>
          </h1>

          <p
            className={`text-xl md:text-2xl text-gray-300 mb-10 transform transition duration-1000 delay-200 ease-out 
                        ${
                          headerVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
          >
            The ultimate hub for student innovation and technical collaboration.
            Find your team, launch your idea, and build the future.
          </p>

          
          <button
            className={`px-10 py-4 bg-indigo-600 text-white text-xl font-bold rounded-xl shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 transition-all duration-300 hover:scale-105 transform 
                        ${
                          ctaVisible
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-95"
                        }`}
          >
            Join the Revolution Today <Zap className="inline w-5 h-5 ml-2" />
          </button>
        </div>
      </section>

     
      <section className="py-16 md:py-24 bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            Core Components of CampusVerse
          </h2>
          <p className="text-lg text-center text-gray-400 mb-16 max-w-2xl mx-auto">
            We provide everything you need to take an idea from concept to
            completion.
          </p>

          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      
      <footer className="p-6 text-center text-gray-500 text-sm border-t border-gray-700 bg-gray-900">
        &copy; {new Date().getFullYear()} CampusVerse. Built for Students, By
        Students.
      </footer>

      
      <style>
        {`
                @keyframes pulse-slow {
                    0%, 100% {
                        transform: scale(1) translate(0, 0);
                    }
                    50% {
                        transform: scale(1.05) translate(5%, 5%);
                    }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s infinite alternate ease-in-out;
                }
                `}
      </style>
    </div>
  );
};

export default Landing;
