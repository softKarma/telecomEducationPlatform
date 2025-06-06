import { useState } from "react";
import PDUParser from "@/components/PDUParser";
import PDUEncoder from "@/components/PDUEncoder";
import PDULearn from "@/components/PDULearn";
import SATParser from "@/components/SATParser";
import SMPPParser from "@/components/SMPPParser";

type TabType = "parser" | "encoder" | "learn" | "sat" | "smpp";
type MainSectionType = "tools" | "knowledge";

export default function Home() {
  const [mainSection, setMainSection] = useState<MainSectionType>("tools");
  const [activeTab, setActiveTab] = useState<TabType>("parser");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              <path d="M16 2v4"></path>
              <path d="M8 22v-4"></path>
              <path d="M22 8h-4"></path>
              <path d="M2 16h4"></path>
            </svg>
            <h1 className="text-xl font-semibold">Telecom Knowledge Hub</h1>
            <span className="text-xs bg-muted px-2 py-1 rounded">3GPP & SMS Technologies</span>
          </div>
          
          <div className="flex sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0 flex-col items-end mt-4 sm:mt-0">
            {/* Main section toggle */}
            <div className="bg-muted rounded-lg p-1 flex">
              <button
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  mainSection === "tools" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted-foreground/10"
                }`}
                onClick={() => setMainSection("tools")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                Tools & Parsers
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  mainSection === "knowledge" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted-foreground/10"
                }`}
                onClick={() => setMainSection("knowledge")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Knowledge Base
              </button>
            </div>
            
            <div className="flex space-x-4 text-sm">
              <a href="#documentation" className="text-muted-foreground hover:text-primary flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg> 
                Documentation
              </a>
              <a href="#about" className="text-muted-foreground hover:text-primary flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                About
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {mainSection === "tools" ? (
          <>
            {/* Tools Tab Navigation */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Telecom Protocol Tools</h2>
              <p className="text-muted-foreground mb-6">
                Interactive tools for parsing, encoding, and analyzing telecom protocols and data formats.
              </p>
              
              <div className="border-b border-border overflow-x-auto">
                <ul className="flex flex-nowrap -mb-px" id="tab-nav">
                  <li className="mr-2">
                    <button 
                      className={`inline-block py-2 px-4 border-b-2 font-medium whitespace-nowrap ${
                        activeTab === "parser" 
                          ? "text-primary border-primary" 
                          : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
                      }`}
                      onClick={() => setActiveTab("parser")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
                        <polyline points="16 18 22 12 16 6"></polyline>
                        <polyline points="8 6 2 12 8 18"></polyline>
                      </svg>
                      SMS PDU Parser
                    </button>
                  </li>
                  <li className="mr-2">
                    <button 
                      className={`inline-block py-2 px-4 border-b-2 font-medium whitespace-nowrap ${
                        activeTab === "encoder" 
                          ? "text-primary border-primary" 
                          : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
                      }`}
                      onClick={() => setActiveTab("encoder")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      SMS PDU Encoder
                    </button>
                  </li>
                  <li className="mr-2">
                    <button 
                      className={`inline-block py-2 px-4 border-b-2 font-medium whitespace-nowrap ${
                        activeTab === "sat" 
                          ? "text-primary border-primary" 
                          : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
                      }`}
                      onClick={() => setActiveTab("sat")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
                        <rect width="16" height="10" x="4" y="4" rx="2" />
                        <rect width="4" height="2" x="10" y="14" />
                        <rect width="8" height="2" x="8" y="16" />
                        <path d="M17 18h1a4 4 0 0 1 0 8h-1" />
                        <circle cx="5" cy="22" r="2" />
                      </svg>
                      SIM Application Toolkit
                    </button>
                  </li>
                  <li className="mr-2">
                    <button 
                      className={`inline-block py-2 px-4 border-b-2 font-medium whitespace-nowrap ${
                        activeTab === "smpp" 
                          ? "text-primary border-primary" 
                          : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted"
                      }`}
                      onClick={() => setActiveTab("smpp")}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block mr-1">
                        <path d="M4 11a9 9 0 0 1 9 9"></path>
                        <path d="M4 4a16 16 0 0 1 16 16"></path>
                        <circle cx="5" cy="19" r="2"></circle>
                      </svg>
                      SMPP Protocol
                    </button>
                  </li>

                </ul>
              </div>
            </div>

            {/* Tools Tab Content */}
            {activeTab === "parser" && <PDUParser />}
            {activeTab === "encoder" && <PDUEncoder />}
            {activeTab === "sat" && <SATParser />}
            {activeTab === "smpp" && <SMPPParser />}
          </>
        ) : (
          <>
            {/* Knowledge Base Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">Telecom Knowledge Base</h2>
              <p className="text-muted-foreground mb-6">
                Comprehensive reference materials on telecommunications technologies, from fundamental concepts to detailed protocol specifications.
              </p>
            </div>
            
            {/* Knowledge Base Content */}
            <PDULearn />
          </>
        )}
      </main>

      <footer className="bg-card border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-base font-medium mb-4">Telecom Knowledge Hub</h3>
              <p className="text-sm text-muted-foreground">
                A comprehensive resource for telecommunications professionals and enthusiasts, offering both educational content and practical tools.
              </p>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors" onClick={() => setMainSection("knowledge")}>
                    Knowledge Base
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors" onClick={() => setMainSection("tools")}>
                    Protocol Tools
                  </a>
                </li>
                <li>
                  <a href="https://www.3gpp.org/specifications" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                    3GPP Specifications
                  </a>
                </li>
                <li>
                  <a href="https://www.etsi.org/" className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">
                    ETSI Standards
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-medium mb-4">About</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This platform is for educational purposes to understand telecom technologies, from high-level concepts to detailed protocol specifications.
              </p>
              <p className="text-sm text-muted-foreground">
                Based on 3GPP 23.040 and other telecom standards.
              </p>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Telecom Knowledge Hub. All educational content for reference purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
