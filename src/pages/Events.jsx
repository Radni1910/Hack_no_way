import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";

// --- 1. FIREBASE INITIALIZATION & DB SETUP ---

const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";

const firebaseConfig =
  typeof __firebase_config !== "undefined"
    ? typeof _firebase_config === "string"
      ? JSON.parse(_firebase_config)
      : __firebase_config
    : {};
const initialAuthToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

let app, db, auth;
if (Object.keys(firebaseConfig).length > 0) {
  try {
   
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
   
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }
} else {
  console.warn("Firebase configuration not found. Using MOCK_EVENTS only.");
}


const getEventsCollectionRef = (database) => {
  if (!database) return null;
  
  const collectionPath = `/artifacts/${appId} / public / data / events`;
  return collection(database, collectionPath);
};

// --- 2. AUTH CONTEXT SIMULATION ---

const AuthContext = createContext({
  isAuthReady: false,
  userId: null,
  db: null,
});

const AuthProvider = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (!auth) {
      setIsAuthReady(true);
      return;
    }

    const handleAuth = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth error:", error);
        await signInAnonymously(auth); 
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
      setIsAuthReady(true);
    });

    handleAuth();
    return () => unsubscribe();
  }, []);

  const contextValue = useMemo(
    () => ({
      isAuthReady,
      userId,
      db, 
    }),
    [isAuthReady, userId]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// --- 3. MOCK DATA (Expanded for variety) ---
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Annual Hackathon 2025",
    date: "2025-11-15",
    location: "Campus Auditorium",
    domain: "Web Dev",
    college: "Tech University",
    link: "#",
    description:
      "Build innovative projects in 48 hours. A flagship event focusing on problem-solving and rapid prototyping.",
  },
  {
    id: "2",
    title: "AI Research Seminar",
    date: "2025-11-20",
    location: "Online",
    domain: "AI/ML",
    college: "Global College",
    link: "#",
    description:
      "Deep dive into LLMs and generative models. Featuring key speakers from industry and academia.",
  },
  {
    id: "3",
    title: "Startup Pitch Day",
    date: "2025-12-05",
    location: "Innovation Hub",
    domain: "Fintech",
    college: "Tech University",
    link: "#",
    description:
      "Present your business idea to VCs. Winners receive seed funding and mentorship.",
  },
  {
    id: "4",
    title: "Design Thinking Workshop",
    date: "2025-12-10",
    location: "Design Studio",
    domain: "UI/UX",
    college: "Art & Design School",
    link: "#",
    description:
      "Master the user-centric design process. Hands-on exercises and real-world case studies.",
  },
  {
    id: "5",
    title: "Cyber Security Summit",
    date: "2026-01-20",
    location: "City Convention Center",
    domain: "Security",
    college: "Tech University",
    link: "#",
    description:
      "Exploring the latest threats and defenses in enterprise security.",
  },
  {
    id: "6",
    title: "Mobile Development Meetup",
    date: "2026-02-14",
    location: "Tech Hub",
    domain: "Mobile Dev",
    college: "Global College",
    link: "#",
    description:
      "Focus on Flutter and React Native best practices for cross-platform development.",
  },
];

const EventCard = ({ event, showRegistrationToast }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 transition duration-300 ease-in-out hover:shadow-indigo-500/30 hover:border-indigo-500 transform hover:-translate-y-0.5 flex flex-col space-y-3">
    <h3 className="text-xl font-bold text-white">{event.title}</h3>

    <p className="text-sm text-gray-400">
      <span className="font-semibold text-indigo-400">{event.college}</span> |{" "}
      {event.location}
    </p>

    <div className="flex flex-wrap gap-2 text-xs">
      <span className="px-3 py-1 bg-indigo-500 text-white rounded-full font-medium shadow-md">
        {event.domain}
      </span>
      <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full font-medium border border-gray-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 inline mr-1 -mt-0.5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
        {event.date}
      </span>
    </div>

    <p className="text-gray-300 mt-2 line-clamp-3 flex-grow text-sm">
      {event.description}
    </p>

    <button
      onClick={showRegistrationToast}
      className="mt-4 text-center p-2 text-base font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition self-stretch shadow-lg shadow-indigo-500/40 hover:shadow-xl"
    >
      Register Now →
    </button>
  </div>
);


const Events = () => {
  const { isAuthReady, db: firestoreDb } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    domain: "",
    college: "",
    date: "",
  });
  const [showToast, setShowToast] = useState(false);
  const showRegistrationToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  useEffect(() => {
   
    if (!firestoreDb) {
      setEvents(MOCK_EVENTS);
      setLoading(false);
      return;
    }

    if (!isAuthReady) {
      return;
    }

    try {
      const collectionRef = getEventsCollectionRef(firestoreDb);
      if (!collectionRef) throw new Error("Collection reference is null.");

      const q = query(collectionRef);

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedEvents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate
              ? doc.data().date.toDate().toISOString().split("T")[0]
              : doc.data().date,
          }));

          const finalEvents =
            fetchedEvents.length > 0 ? fetchedEvents : MOCK_EVENTS;
          setEvents(finalEvents);
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching events from Firestore:", error);
          setEvents(MOCK_EVENTS);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e) {
      console.error("Error setting up onSnapshot:", e);
      setEvents(MOCK_EVENTS);
      setLoading(false);
    }
  }, [isAuthReady, firestoreDb]);

  const filteredEvents = useMemo(() => {
    let filtered = [...events];

  
    if (filters.domain)
      filtered = filtered.filter((e) =>
        e.domain?.toLowerCase().includes(filters.domain.toLowerCase())
      );
    if (filters.college)
      filtered = filtered.filter((e) =>
        e.college?.toLowerCase().includes(filters.college.toLowerCase())
      );
    if (filters.date) {
      filtered = filtered.filter((e) => e.date && e.date >= filters.date);
    }

 
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

    return filtered;
  }, [events, filters]);

  const allDomains = events.map((e) => e.domain).filter(Boolean);
  const allColleges = events.map((e) => e.college).filter(Boolean);

  const uniqueDomains = [...new Set(allDomains)].sort();
  const uniqueColleges = [...new Set(allColleges)].sort();

  const handleClearFilters = () =>
    setFilters({ domain: "", college: "", date: "" });


  const FilterSelect = ({ label, name, options, value, onChange }) => (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-semibold mb-2 text-gray-300"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2.5 border border-gray-600 rounded-xl shadow-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition"
      >
        <option value="">All {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-3xl font-bold text-indigo-400 animate-pulse">
          Loading Events...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 flex font-sans">
      
      <div className="lg:hidden w-full p-4 bg-gray-800 border-b border-gray-700 shadow-xl sticky top-0 z-10">
        <details
          open={isMobileFilterOpen}
          onToggle={(e) => setIsMobileFilterOpen(e.target.open)}
          className="group"
        >
          <summary className="cursor-pointer flex items-center justify-between text-lg font-bold text-white p-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition">
            Filter Events
            <span className="text-sm font-medium text-indigo-400">
              (
              {filters.domain || filters.college || filters.date
                ? "Active"
                : "None"}
              )
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 text-indigo-400 transition-transform ${
                isMobileFilterOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </summary>
          <div className="mt-4 space-y-4 p-4 border border-gray-700 rounded-xl bg-gray-800 shadow-inner">
            <FilterSelect
              label="Domain"
              name="domain"
              options={uniqueDomains}
              value={filters.domain}
              onChange={(e) =>
                setFilters({ ...filters, domain: e.target.value })
              }
            />
            <FilterSelect
              label="College"
              name="college"
              options={uniqueColleges}
              value={filters.college}
              onChange={(e) =>
                setFilters({ ...filters, college: e.target.value })
              }
            />
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-300">
                Starting From
              </label>
              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
                className="w-full p-2.5 border border-gray-600 rounded-xl shadow-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleClearFilters}
              className="w-full py-3 text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition duration-200 font-bold shadow-md"
            >
              Clear Filters
            </button>
          </div>
        </details>
      </div>

    
      <div className="w-64 p-8 bg-gray-800 border-r border-gray-700 shadow-2xl sticky top-0 h-screen overflow-y-auto hidden lg:block flex-shrink-0">
        <h2 className="text-3xl font-extrabold text-white mb-6 border-b border-gray-700 pb-3">
          Event Filters
        </h2>

        <div className="space-y-6">
          <FilterSelect
            label="Domain"
            name="domain"
            options={uniqueDomains}
            value={filters.domain}
            onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
          />
          <FilterSelect
            label="College"
            name="college"
            options={uniqueColleges}
            value={filters.college}
            onChange={(e) =>
              setFilters({ ...filters, college: e.target.value })
            }
          />
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Starting From
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full p-2.5 border border-gray-600 rounded-xl shadow-md bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleClearFilters}
            className="w-full py-3 bg-gray-700 text-gray-200 font-bold rounded-xl hover:bg-gray-600 transition duration-200 shadow-md"
          >
            Clear Filters
          </button>
        </div>
      </div>

      
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-2">
          Discover Student Events
        </h1>
        <p className="text-xl text-indigo-400 mb-8 font-light">
          Explore upcoming hackathons, seminars, and workshops.
        </p>

        <p className="text-gray-300 mb-6 font-medium">
          Showing{" "}
          <span className="text-indigo-400 font-bold">
            {filteredEvents.length}
          </span>{" "}
          results.
        </p>

        {filteredEvents.length === 0 && (
          <div className="text-center p-12 bg-gray-800 rounded-xl shadow-lg mt-10 border border-gray-700">
            <h3 className="text-2xl font-semibold text-gray-200">
              No Events Match Your Filters
            </h3>
            <p className="text-gray-400 mt-2">
              Try clearing your filters or selecting broader criteria.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 py-2 px-6 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium shadow-md"
            >
              Clear All Filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              showRegistrationToast={showRegistrationToast}
            />
          ))}
        </div>
        
        {showToast && (
          <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-out">
            Successfully Registered!
          </div>
        )}
      </div>
    </div>
  );
};

// --- 6. WRAPPER ---
const App = () => (
  <AuthProvider>
    <Events />
  </AuthProvider>
);

export default App;
