import { useState } from "react";
import SearchBar from "./SearchBar"; 
import  Map  from "./Map";

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "all", label: "Wszystkie spotkania" },
    { id: "mine", label: "Moje spotkania" },
    { id: "past", label: "Odbyte" },
    { id: "near", label: "Blisko Ciebie" },
  ];

  const dummyMeetings = [
    { id: 1, title: "Wspólne kodowanie w Pythonie", date: "24 Paź 2026, 18:00", city: "Wrocław", desc: "Szukamy ludzi do wspólnego projektu w Django." },
    { id: 2, title: "Piwo po pracy - IT", date: "26 Paź 2026, 20:00", city: "Kraków", desc: "Luźne pogaduchy, zero kodu, same narzekanie na PM-ów." },
    { id: 3, title: "Warsztaty z Reacta", date: "28 Paź 2026, 17:30", city: "Warszawa", desc: "Podstawy hooków i state managementu." },
    { id: 4, title: "Gry planszowe", date: "30 Paź 2026, 19:00", city: "Poznań", desc: "Gramy w Terraformację Marsa." },
  ];

  return (
    
    <div className="h-[calc(100vh-5rem)] flex flex-col bg-gray-900 text-gray-100 font-sans overflow-hidden">
      
      
      <div className="bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto py-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-1 py-2 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-400"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      
      <div className="flex-1 flex overflow-hidden">
        
        
        <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col border-r border-gray-700 bg-gray-900 z-10 shadow-xl">
          
          
          {activeTab === "all" && (
            <div className="p-4 border-b border-gray-800 bg-gray-800/30 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Szukaj spotkań..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-gray-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-gray-500"
                />
                <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          )}

          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {dummyMeetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-emerald-500/50 hover:bg-gray-800/80 transition-all cursor-pointer shadow-sm hover:shadow-md group"
              >
                <h3 className="text-lg font-bold text-gray-100 group-hover:text-purple-400 transition-colors">
                  {meeting.title}
                </h3>
                <p className="text-sm text-emerald-400 mt-1 font-medium">{meeting.date}</p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{meeting.desc}</p>
                
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {meeting.city}
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="hidden md:flex md:w-1/2 lg:w-2/3 bg-gray-800 relative items-center justify-center">
          <Map />
        </div>

      </div>
    </div>
  );
}