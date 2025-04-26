import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
// import AIAssistant from "@/components/AiBotComponents/AIAssistant"
// import TabButton from "@/components/AiBotComponents/TabButton"
//import GeneralChat from "@/components/AiBotComponents/GeneralChat"
// import TravelRecommender from "@/components/AiBotComponents/TravelRecommender"
// import EmergencyContact from "@/components/AiBotComponents/EmergencyContact"
//import PhotoCaption from "@/components/AiBotComponents/PhotoCaption"
// import PhotoCaption from "@/components/AiBotComponents/PhotoCaption"
//import HealthAndSafety from "@/components/AiBotComponents/HealthAndSafety"
//import StreamingContent from "@/components/AiBotComponents/StreamingContent"
import {
  MapPin,
  Globe,
  Calendar,
  Heart,
  X,
  Brain,
  MessageSquare,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

// AI Assistant Main Components
const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("generalChat");
  const panelRef = useRef(null);

  const toggleAssistant = () => {
    setIsOpen(!isOpen);
  };

  const closeAssistant = () => {
    setIsOpen(false);
  };

  // Handle clicks outside the panel to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !event.target.closest(".ai-button")
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* AI Button */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-50 ai-button"
        onClick={toggleAssistant}
      >
        <Brain className="h-7 w-7 text-white" />
      </button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="fixed top-0 right-0 w-1/3 h-full bg-black text-white z-40 shadow-xl overflow-y-auto transition-all duration-300 ease-in-out"
        >
          <div className="p-4 h-full flex flex-col">
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">AI Travel Assistant</h2>
              <button
                className="text-white hover:text-gray-300"
                onClick={closeAssistant}
                aria-label="Close panel"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto space-x-4 mb-6 pb-2">
              <TabButton
                name="generalChat"
                icon={<MessageSquare className="h-4 w-4 mr-1" />}
                active={activeTab === "generalChat"}
                onClick={() => setActiveTab("generalChat")}
              />
              <TabButton
                name="travelRecommender"
                active={activeTab === "travelRecommender"}
                onClick={() => setActiveTab("travelRecommender")}
              />
              <TabButton
                name="emergencyContact"
                active={activeTab === "emergencyContact"}
                onClick={() => setActiveTab("emergencyContact")}
              />
              <TabButton
                name="healthAndSafety"
                active={activeTab === "healthAndSafety"}
                onClick={() => setActiveTab("healthAndSafety")}
              />
              <TabButton
                name="photoCaption"
                active={activeTab === "photoCaption"}
                onClick={() => setActiveTab("photoCaption")}
              />
              <TabButton
                name="streamingContent"
                active={activeTab === "streamingContent"}
                onClick={() => setActiveTab("streamingContent")}
              />
            </div>

            {/* Tab Content - Full height */}
            <div className="bg-gray-900 rounded-lg p-4 flex-1 overflow-y-auto">
              {activeTab === "generalChat" && <GeneralChat />}
              {activeTab === "travelRecommender" && <TravelRecommender />}
              {activeTab === "emergencyContact" && <EmergencyContact />}
              {activeTab === "healthAndSafety" && <HealthAndSafety />}
              {activeTab === "photoCaption" && <PhotoCaption />}
              {activeTab === "streamingContent" && <StreamingContent />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TabButton = ({ name, icon = null, active, onClick }) => {
  return (
    <button
      className={`px-4 py-2 rounded-t-lg whitespace-nowrap flex items-center ${
        active
          ? "bg-gray-900 text-white font-medium"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      {icon}
      {name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())}
    </button>
  );
};

// Add GeneralChat Component
const GeneralChat = () => {
  // Define API base URL
  const API_BASE_URL = "http://localhost:3000"; // Change this to your actual backend URL

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI travel assistant. How can I help with your travel plans today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Modified to match your API endpoint and request format with complete URL
      const response = await fetch(`${API_BASE_URL}/api/generateContent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input.trim(),
          model: "gemini-2.0-flash",
        }),
      });

      const data = await response.json();

      // Check if the response contains a result and add it to messages
      if (data.result) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.result },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm sorry, I couldn't process your request. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error connecting to AI service:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, there was an error connecting to the service. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block max-w-3/4 rounded-lg px-4 py-2 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left mb-4">
            <div className="inline-block max-w-3/4 rounded-lg px-4 py-2 bg-gray-700 text-gray-100">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="mt-auto">
        <div className="flex">
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Ask me anything about your travels..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-md font-medium"
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

// Feature Components
const TravelRecommender = () => {
  const [interests, setInterests] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/travel/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interests, location }),
      });

      const data = await response.json();

      if (data.success) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions("Error: " + data.error);
      }
    } catch (error) {
      setSuggestions("Failed to get suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Travel Recommendations</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Your Interests
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white"
            placeholder="Nature, adventure, food, history..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Destination</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white"
            placeholder="Italy, Tokyo, California..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
          disabled={loading}
        >
          {loading ? "Finding Ideas..." : "Get Recommendations"}
        </button>
      </form>

      {suggestions && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg whitespace-pre-line">
          <h4 className="text-md font-medium mb-2">Your Travel Ideas:</h4>
          <div className="text-sm text-gray-300">{suggestions}</div>
        </div>
      )}
    </div>
  );
};

const EmergencyContact = () => {
  const [destination, setDestination] = useState("");
  const [contacts, setContacts] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/travel/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination }),
      });

      const data = await response.json();

      if (data.success) {
        setContacts(data.emergencyContacts);
      } else {
        setContacts("Error: " + data.error);
      }
    } catch (error) {
      setContacts("Failed to get emergency information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Emergency Contacts</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Destination</label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white"
            placeholder="Paris, Tokyo, New York..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium"
          disabled={loading}
        >
          {loading ? "Finding Contacts..." : "Get Emergency Info"}
        </button>
      </form>

      {contacts && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg whitespace-pre-line">
          <h4 className="text-md font-medium mb-2">Emergency Information:</h4>
          <div className="text-sm text-gray-300">{contacts}</div>
        </div>
      )}
    </div>
  );
};

const PhotoCaption = () => {
  // Define API base URL - adjust this based on your actual backend URL
  const API_BASE_URL = "http://localhost:3000";

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [captionStyle, setCaptionStyle] = useState("funny");
  const [description, setDescription] = useState("");
  const [captions, setCaptions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) return;

    setLoading(true);
    setError("");

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(photo);
      reader.onloadend = async () => {
        try {
          const base64data =
            typeof reader.result === "string"
              ? reader.result.split(",")[1]
              : "";

          const response = await fetch(
            `${API_BASE_URL}/api/generatePhotoCaption`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                photoBase64: base64data,
                captionStyle,
                description,
              }),
            }
          );

          const data = await response.json();

          if (data.success) {
            setCaptions(data.captions);
          } else {
            setError(data.error || "Failed to generate captions");
            setCaptions("");
          }
        } catch (fetchError) {
          console.error("Error in fetch operation:", fetchError);
          setError(
            "Network error. Please check your connection and try again."
          );
          setCaptions("");
        } finally {
          setLoading(false);
        }
      };
    } catch (fileReadError) {
      console.error("Error reading file:", fileReadError);
      setError("Error processing your image. Please try another photo.");
      setLoading(false);
    }
  };

  const captionStyles = [
    "funny",
    "poetic",
    "dramatic",
    "simple",
    "creative",
    "romantic",
    "patriotic",
    "adventurous",
  ];

  return (
    <div className="max-w-md mx-auto p-4">
      <h3 className="text-lg font-medium mb-4">AI Photo Caption Generator</h3>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Upload Photo</label>
          <input
            type="file"
            accept="image/*"
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white"
            onChange={handlePhotoChange}
            required
          />

          {photoPreview && (
            <div className="mt-2">
              <img
                src={photoPreview}
                alt="Preview"
                className="h-40 rounded-md object-cover"
              />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Caption Style
          </label>
          <select
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white"
            value={captionStyle}
            onChange={(e) => setCaptionStyle(e.target.value)}
          >
            {captionStyles.map((style) => (
              <option key={style} value={style}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Photo Description (Optional)
          </label>
          <textarea
            className="w-full px-3 py-2 bg-gray-800 rounded-md text-white"
            placeholder="Briefly describe what's in the photo..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium"
          disabled={loading || !photo}
        >
          {loading ? "Generating..." : "Generate Captions"}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {captions && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg whitespace-pre-line">
          <h4 className="text-md font-medium mb-2">Your Captions:</h4>
          <div className="text-sm text-gray-300">{captions}</div>
        </div>
      )}
    </div>
  );
};

const HealthAndSafety = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Health & Safety Information</h3>
      <p className="text-gray-300 mb-4">
        Get travel health advisories, vaccination requirements, and safety tips
        for your destination.
      </p>

      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-400">
          This feature is coming soon. Check back for updates!
        </p>
      </div>
    </div>
  );
};

const StreamingContent = () => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Streaming Content</h3>
      <p className="text-gray-300 mb-4">
        Find movies, documentaries, and shows about your destination to prepare
        for your trip.
      </p>

      <div className="p-4 bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-400">
          This feature is coming soon. Check back for updates!
        </p>
      </div>
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-r from-journey-800 to-journey-950 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-journey-800 to-journey-950 opacity-90"></div>
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
            alt="Travel background"
            className="w-full h-full object-cover object-center opacity-20"
          />
        </div>

        <div className="container relative z-10 max-w-screen-xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Plan Your Perfect Journey
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/80">
            Create detailed travel itineraries, organize activities by day, and
            keep track of all your adventures in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-journey-950 hover:bg-white/90"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/explore")}
              className="text-white bg-transparent hover:bg-white/10"
            >
              Explore Trips
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Plan Every Detail of Your Trip
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Journey gives you all the tools you need to create detailed travel
              plans and capture your memories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Destinations</h3>
              <p className="text-muted-foreground">
                Keep track of all the places you want to visit on your journey.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Itineraries</h3>
              <p className="text-muted-foreground">
                Organize activities by day to make the most of your time.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Trip Types</h3>
              <p className="text-muted-foreground">
                Categorize trips as adventure, leisure, work, family, and more.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Favorites</h3>
              <p className="text-muted-foreground">
                Save your favorite itineraries for future reference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-journey-100 to-journey-50 dark:from-journey-900 dark:to-journey-800">
        <div className="container max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Planning?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Create an account and start building your detailed travel
            itineraries today.
          </p>
          <Button size="lg" onClick={() => navigate("/auth")}>
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">Journey</span>
            </div>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                About
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Features
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Terms
              </a>
            </div>

            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Journey. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant Component */}
      <AIAssistant />
    </div>
  );
};

export default Index;
