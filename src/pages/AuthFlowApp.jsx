import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  Briefcase,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const signInUser = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

const signUpUser = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

const LoginComponent = ({ onSignUpSuccess, onSignInSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (action) => {
    setError(null);

    if (action === "signup") {
      if (!firstName || !lastName || !email || !password) {
        setError("Please fill out all fields.");
        return;
      }
    } else {
      if (!email || !password) {
        setError("Please fill out all fields.");
        return;
      }
    }

    setLoading(true);

    try {
      if (action === "signup") {
        const result = await signUpUser(email, password);
        // Update user profile with display name
        const user = auth.currentUser;
        if (user) {
          await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
          });
        }
        onSignUpSuccess({ email, firstName, lastName });
      } else {
        await signInUser(email, password);
        onSignInSuccess("Login Successful!");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      let errorMessage = "Authentication Failed. Try Again.";

      // Provide more specific error messages
      if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (err.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (err.code === "auth/email-already-in-use") {
        errorMessage = "An account already exists with this email.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSigningUp(!isSigningUp);
    setError(null);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  };

  const title = isSigningUp ? "Create Your Account" : "Sign In to Your Profile";
  const buttonText = isSigningUp ? "Sign Up" : "Sign In";

  return (
    <div className="w-full max-w-lg bg-gray-800 p-10 rounded-2xl shadow-2xl shadow-indigo-500/10 border border-gray-700 transition duration-500">
      <h2 className="text-4xl font-extrabold text-white text-center mb-8">
        {title}
      </h2>

      {error && (
        <div className="bg-red-900/30 text-red-400 p-4 rounded-lg text-base mb-5 border border-red-800">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {isSigningUp && (
          <>
            {/* First Name */}
            <div>
              <label className="block text-lg font-medium text-gray-300">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-2 block w-full px-5 py-3 text-lg bg-gray-900 text-white border border-gray-700 rounded-xl 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-lg font-medium text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-2 block w-full px-5 py-3 text-lg bg-gray-900 text-white border border-gray-700 rounded-xl 
                focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </>
        )}

        {/* Email */}
        <div>
          <label className="block text-lg font-medium text-gray-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full px-5 py-3 text-lg bg-gray-900 text-white border border-gray-700 rounded-xl 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-lg font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full px-5 py-3 text-lg bg-gray-900 text-white border border-gray-700 rounded-xl 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Submit */}
        <button
          onClick={() => handleAuth(isSigningUp ? "signup" : "signin")}
          className="w-full py-4 text-2xl font-semibold bg-indigo-600 text-white rounded-xl shadow-lg
          hover:bg-indigo-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Please Wait..." : buttonText}
        </button>
      </div>

      <p className="mt-7 text-center text-lg text-gray-300">
        <button
          onClick={toggleMode}
          className="text-indigo-500 hover:text-indigo-400 hover:underline transition"
        >
          {isSigningUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </button>
      </p>
    </div>
  );
};

const skillCategories = [
  { name: "Frontend", skills: ["React", "Vue", "Angular", "Tailwind CSS"] },
  { name: "Backend", skills: ["Node.js", "Python/Django", "Go", "Firebase"] },
  {
    name: "Design",
    skills: ["Figma", "Sketch", "Prototyping", "User Research"],
  },
  {
    name: "Data Science",
    skills: ["Python/Pandas", "R", "Machine Learning", "SQL"],
  },
];

const interestsData = [
  { name: "Sustainable Tech", icon: "Leaf" },
  { name: "AI & ML", icon: "Brain" },
  { name: "Gaming", icon: "Gamepad" },
  { name: "Open Source", icon: "Code" },
  { name: "FinTech", icon: "DollarSign" },
  { name: "HealthTech", icon: "Heart" },
];

const Stepper = ({ currentStep, totalSteps }) => (
  <div className="flex justify-center space-x-2 mb-10">
    {[...Array(totalSteps)].map((_, index) => (
      <div
        key={index}
        className={`w-10 h-1 rounded-full transition-all duration-300 ${
          index === currentStep - 1 ? "bg-indigo-500" : "bg-gray-700"
        }`}
      />
    ))}
  </div>
);

const IconButton = ({
  children,
  onClick,
  disabled,
  primary = true,
  className = "",
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md ${
      primary
        ? "bg-indigo-600 text-white hover:bg-indigo-500 disabled:bg-indigo-900 disabled:text-gray-400"
        : "bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-900 disabled:text-gray-500"
    } ${className}`}
  >
    {children}
  </button>
);

const TagSelector = ({ name, selected, onClick }) => {
  const isSelected = selected.includes(name);
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 border rounded-full text-sm font-medium transition duration-200 ${
        isSelected
          ? "bg-indigo-500 text-white border-indigo-500 shadow-lg"
          : "bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-700"
      }`}
    >
      {name}
    </button>
  );
};

const Step2ProfileInfo = ({ formData, setFormData, onNext }) => {
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const isComplete =
    formData.firstName &&
    formData.lastName &&
    formData.collegeName &&
    formData.yearOfStudy;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-2">
        Tell Us About Yourself
      </h2>
      <p className="text-gray-400 mb-8">
        This helps us match you with the best projects and teammates.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isComplete) onNext();
        }}
      >
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-300 mb-1"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="collegeName"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            College/University
          </label>
          <input
            type="text"
            id="collegeName"
            name="collegeName"
            value={formData.collegeName || ""}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-900 text-white border border-gray-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="yearOfStudy"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Current Year of Study
          </label>
          <select
            id="yearOfStudy"
            name="yearOfStudy"
            value={formData.yearOfStudy || ""}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-white focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            <option value="" disabled>
              Select your current status
            </option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
            <option value="Graduate Student">Graduate Student</option>
          </select>
        </div>

        <IconButton
          type="submit"
          disabled={!isComplete}
          primary
          className="w-full"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </IconButton>
      </form>
    </div>
  );
};

const Step3Skills = ({ formData, setFormData, onPrev, onNext }) => {
  const handleSkillToggle = (skill) => {
    setFormData((prev) => {
      const currentSkills = prev.skills || [];
      if (currentSkills.includes(skill)) {
        return { ...prev, skills: currentSkills.filter((s) => s !== skill) };
      } else {
        return { ...prev, skills: [...currentSkills, skill] };
      }
    });
  };

  const selectedSkillsCount = formData.skills ? formData.skills.length : 0;
  const isComplete = selectedSkillsCount >= 3; // Enforce minimum of 3 skills

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-2">Your Core Skills</h2>
      <p className="text-gray-400 mb-8">
        Select a minimum of 3 skills. These will be used to match you with
        projects. ({selectedSkillsCount}/3 minimum)
      </p>

      <div className="space-y-6 mb-8">
        {skillCategories.map((category) => (
          <div key={category.name}>
            <h3 className="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-1">
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skill) => (
                <TagSelector
                  key={skill}
                  name={skill}
                  selected={formData.skills || []}
                  onClick={() => handleSkillToggle(skill)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <IconButton onClick={onPrev} primary={false}>
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </IconButton>
        <IconButton onClick={onNext} disabled={!isComplete}>
          <span>Next: Interests</span>
          <ArrowRight className="w-5 h-5" />
        </IconButton>
      </div>
    </div>
  );
};

const Step4Interests = ({ formData, setFormData, onPrev, onComplete }) => {
  const handleInterestToggle = (interest) => {
    setFormData((prev) => {
      const currentInterests = prev.interests || [];
      if (currentInterests.includes(interest)) {
        return {
          ...prev,
          interests: currentInterests.filter((i) => i !== interest),
        };
      } else {
        return { ...prev, interests: [...currentInterests, interest] };
      }
    });
  };

  const selectedInterestsCount = formData.interests
    ? formData.interests.length
    : 0;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-2">
        Your Passion Domains
      </h2>
      <p className="text-gray-400 mb-8">
        Select any interests that excite you. This helps connect you with
        relevant projects. ({selectedInterestsCount} selected)
      </p>

      <div className="flex flex-wrap gap-4 mb-8">
        {interestsData.map((interest) => (
          <TagSelector
            key={interest.name}
            name={interest.name}
            selected={formData.interests || []}
            onClick={() => handleInterestToggle(interest.name)}
          />
        ))}
      </div>

      <div className="flex justify-between">
        <IconButton onClick={onPrev} primary={false}>
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </IconButton>
        <IconButton
          onClick={onComplete}
          primary
          className="bg-green-600 hover:bg-green-500"
        >
          <Check className="w-5 h-5" />
          <span>Finish Setup</span>
        </IconButton>
      </div>
    </div>
  );
};

const MultiStepSignUp = ({ onSetupComplete, initialAuthData }) => {
  const [currentStep, setCurrentStep] = useState(2);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    email: initialAuthData?.email || "",
    username: initialAuthData?.username || "newuser123",

    firstName: "",
    lastName: "",
    collegeName: "",
    yearOfStudy: "",

    skills: [],
    interests: [],
  });

  const goToNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const goToPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleComplete = () => {
    console.log("Final User Data Submitted:", formData);
    onSetupComplete(formData);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 2:
        return (
          <Step2ProfileInfo
            formData={formData}
            setFormData={setFormData}
            onNext={goToNext}
          />
        );
      case 3:
        return (
          <Step3Skills
            formData={formData}
            setFormData={setFormData}
            onPrev={goToPrev}
            onNext={goToNext}
          />
        );
      case 4:
        return (
          <Step4Interests
            formData={formData}
            setFormData={setFormData}
            onPrev={goToPrev}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-xl shadow-2xl shadow-indigo-500/10 border border-gray-700 transition duration-500">
      {currentStep >= 2 && currentStep <= totalSteps && (
        <>
          <Stepper currentStep={currentStep - 1} totalSteps={totalSteps - 1} />{" "}
          {renderStep()}
        </>
      )}
    </div>
  );
};

const AuthFlowApp = () => {
  const navigate = useNavigate();

  const [view, setView] = useState("login");
  const [authData, setAuthData] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSignUpSuccess = (data) => {
    setAuthData(data);
    setMessage("Account created. Please complete your profile!");
    setTimeout(() => setView("multistep"), 1500);
  };

  const handleSignInSuccess = (msg) => {
    setMessage(msg);
    setView("success");
  };

  const handleSetupComplete = (finalData) => {
    setMessage("Setup Complete! Welcome to CampusVerse!");
    setView("success");
  };

  const handleReset = () => {
    setAuthData(null);
    setMessage(null);
    setView("login");
  };

  const renderCurrentView = () => {
    switch (view) {
      case "login":
        return (
          <LoginComponent
            onSignUpSuccess={handleSignUpSuccess}
            onSignInSuccess={handleSignInSuccess}
          />
        );
      case "multistep":
        return (
          <MultiStepSignUp
            onSetupComplete={handleSetupComplete}
            initialAuthData={authData}
          />
        );
      case "success":
        return (
          <div className="text-center p-12 bg-gray-800 rounded-xl shadow-2xl shadow-green-500/10 border border-gray-700 w-full max-w-2xl">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
            <p className="text-gray-400 mb-6 font-semibold">{message}</p>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-500 transition"
            >
              Go to Dashboard
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-indigo-500 mb-8">
        CampusVerse
      </h1>
      {renderCurrentView()}
      {message && view !== "success" && (
        <div className="mt-4 p-3 bg-indigo-900/30 text-indigo-400 rounded-lg text-sm border border-indigo-800">
          {message}
        </div>
      )}
    </div>
  );
};

export default AuthFlowApp;
