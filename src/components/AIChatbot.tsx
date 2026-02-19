import { useState, useEffect, useRef } from "react";

// Icon components to avoid lucide-react import issue
const MessageCircleIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const XIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SendIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const CopyIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const SparklesIcon = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

const Loader2Icon = ({ size, className }: { size?: number; className?: string }) => (
  <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isJson?: boolean;
  showActionButtons?: boolean; // New flag to control Copy/Use This Prompt buttons
  isEstimatorUpdate?: boolean; // Flag for "Estimator Updated!" messages — only show copy icon
  isCalendarBooking?: boolean; // Flag to render calendar booking interface
  calendarDuration?: '15min' | '30min' | '60min' | null; // Tracks selected duration
}

interface AIChatbotProps {
  currentPage: "home" | "estimator" | "quote";
  currentStep?: number;
  formData?: any;
  onInsertPrompt?: (prompt: string) => void;
  onAutofill?: (data: any) => void;
  aiActionTrigger?: { type: 'generate' | 'autofill', timestamp: number } | null;
}

export function AIChatbot({
  currentPage,
  currentStep = 1,
  formData,
  onInsertPrompt,
  onAutofill,
  aiActionTrigger,
}: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingIframeUrl, setBookingIframeUrl] = useState<string | null>(null);

  const formatMessageText = (text: string, sender: "user" | "bot") => {
    if (sender !== "bot") return text;
    
    const regex = /(Tech Project Estimator|Project Estimator)/g;
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (part === "Tech Project Estimator" || part === "Project Estimator") {
        return (
          <a
            key={index}
            href="https://estimator.bktadvisory.com/"
            className="underline text-blue-600 hover:text-blue-800"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initial greeting based on page
  useEffect(() => {
    if (!hasGreeted) {
      const greeting =
        currentPage === "estimator"
          ? "Hi there! 👋 I'm here to help you with the Tech Project Estimator. I can help you draft a structured project description to get the most accurate estimate. Just tell me about your project goals!"
          : "Hello! 👋 Welcome to BKT Advisory. I'm your AI assistant. I can help you scope your project, answer questions about our services, or guide you through the estimation process.";

      setMessages([
        {
          id: "1",
          text: greeting,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setHasGreeted(true);
    }
  }, [currentPage, hasGreeted]);

  // Reset greeting when page changes
  useEffect(() => {
    setHasGreeted(false);
  }, [currentPage]);

  // Handle external AI triggers
  useEffect(() => {
    if (aiActionTrigger) {
      setIsOpen(true);
      if (aiActionTrigger.type === 'generate') {
        handleGenerateFromSelections();
      } else if (aiActionTrigger.type === 'autofill') {
        handleAutofillFromDescription();
      }
    }
  }, [aiActionTrigger]);

  // Auto-resize textarea and adjust padding for scrollbar
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to correctly calculate scrollHeight
    textarea.style.height = "auto";
    
    const maxHeight = 88; // Approx 4 lines
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    
    textarea.style.height = `${newHeight}px`;
    
    // Check if scrollbar is needed (content exceeds max height)
    // We compare scrollHeight against maxHeight. 
    // Note: scrollHeight includes padding. 
    const isScrollable = textarea.scrollHeight > maxHeight;
    
    textarea.style.overflowY = isScrollable ? "auto" : "hidden";
    
    // Reduce left padding (16px default) by scrollbar width (6px) -> 10px
    // to keep visual balance when scrollbar appears
    textarea.style.paddingLeft = isScrollable ? "10px" : "16px";
    
  }, [inputValue]);

  const handleSendMessage = async (textOverride?: string, showActionButtons: boolean = false) => {
    const text = typeof textOverride === "string" ? textOverride : inputValue;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare payload for API
      const payload = {
        current_page: currentPage,
        current_date: new Date().toLocaleDateString(),
        project_goals: userMessage.text,
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-07a007e1/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.status === 429) {
        setMessages((prev) => [
          ...prev, 
          {
            id: Date.now().toString() + "-quota",
            text: "I've reached my usage limit for today. Please contact BKT Advisory directly for assistance or try again later.",
            sender: "bot",
            timestamp: new Date(),
          }
        ]);
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          // If it's not JSON, it's likely a server runtime error (HTML/text)
          throw new Error(`Server Error (${response.status}): ${errorText.substring(0, 200)}`);
        }
        
        throw new Error(errorData.details || errorData.error || `Server Error: ${response.status}`);
      }

      const data = await response.json();

      let botText = data.content || "";
      
      // Check for hidden OPEN_BOOKING tag from AI
      if (botText.includes(":::OPEN_BOOKING:::")) {
        // Strip the tag
        botText = botText.replace(":::OPEN_BOOKING:::", "").trim();
        // Enable inline booking cards in the chat
        isCalendarBooking = true;
      }

      let isJson = false;
      let parsedJson = null;
      let isCalendarBooking = false;
      let isEstimatorUpdate = false;

      // Check if the response contains the Google Calendar booking URL
      const calendarUrlRegex = /https:\/\/calendar\.google\.com\/calendar\/appointments\/[^\s]+/;
      if (calendarUrlRegex.test(botText)) {
        isCalendarBooking = true;
        // Keep the text as-is, we'll render an iframe instead
      }

      // Try to detect and parse JSON from the response text
      try {
        let jsonStr = botText.trim();
        
        // Handle markdown code blocks which o1 often uses
        const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          jsonStr = codeBlockMatch[1].trim();
        }

        // Simple check if it looks like JSON
        if (jsonStr.startsWith('{') || jsonStr.startsWith('[')) {
          parsedJson = JSON.parse(jsonStr);
          isJson = true;
          
          // If it's a configuration object for autofill
          if (parsedJson.selectedCRMs || parsedJson.selectedClouds || parsedJson.selectedIntegrations) {
            botText = "I've analyzed your project description and found the following configuration. Would you like to apply these to your estimator?";
            // Auto-apply if it's an autofill request? 
            // The user said "Action: ... update the Step 2 & 3 checkboxes."
            // So we'll apply it and also show a message.
            if (onAutofill) {
              onAutofill(parsedJson);
              botText = "✅ **Estimator Updated!** I've automatically selected the CRMs, Clouds, and Tools based on your description.\n\n" + 
                        "**Configuration Applied:**\n" +
                        (parsedJson.selectedCRMs?.length ? `- **CRMs:** ${parsedJson.selectedCRMs.join(', ')}\n` : "") +
                        (parsedJson.selectedClouds?.length ? `- **Clouds:** ${parsedJson.selectedClouds.join(', ')}\n` : "") +
                        (parsedJson.selectedIntegrations?.length ? `- **Integrations:** ${parsedJson.selectedIntegrations.join(', ')}\n` : "") +
                        (parsedJson.selectedAITools?.length ? `- **AI Tools:** ${parsedJson.selectedAITools.join(', ')}\n` : "") +
                        (parsedJson.additionalModules?.length ? `- **Modules:** ${parsedJson.additionalModules.join(', ')}\n` : "");
              isEstimatorUpdate = true;
            }
          } else {
            // Convert other JSON to readable markdown for the chat
            botText =
              `**PROJECT SCOPE**\n\n` +
              Object.entries(parsedJson)
                .map(([key, value]) => {
                  const formattedKey = key
                    .replace(/_/g, " ")
                    .toUpperCase();
                  return `**${formattedKey}**\n${value}`;
                })
                .join("\n\n");
          }
        }
      } catch (e) {
        // Not JSON, continue with original text
      }

      const botMessage: Message = {
        id: Date.now().toString() + "-bot",
        text: botText,
        sender: "bot",
        timestamp: new Date(),
        isJson: isJson,
        showActionButtons: showActionButtons, // Use the parameter passed in
        isEstimatorUpdate: isEstimatorUpdate,
        isCalendarBooking: isCalendarBooking,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
        isJson: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text: string, messageId: string) => {
    try {
      // Try modern Clipboard API first
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      // Fallback to older method if Clipboard API is blocked
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopiedId(messageId);
        setTimeout(() => setCopiedId(null), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy text:', fallbackErr);
        // Still show the copied state to indicate the attempt
        setCopiedId(messageId);
        setTimeout(() => setCopiedId(null), 1000);
      }
    }
  };

  const handleUsePrompt = (text: string) => {
    if (onInsertPrompt) {
      onInsertPrompt(text);
      setIsOpen(false);
    }
  };

  const handleGenerateFromSelections = () => {
    if (!formData) return;
    
    // Construct Prompt with Scope Details and Selections
    const prompt = `Write a comprehensive project description based on these details:
      
      Current Description Draft: "${formData.projectDescription || ''}"
      
      Scope:
      - Problems: ${formData.scopeProblems || 'Not specified'}
      - Requirements: ${formData.scopeRequirements || 'Not specified'}
      - Goals: ${formData.scopeGoals || 'Not specified'}
      
      Technical Configuration:
      - CRMs: ${formData.selectedCRMs.join(', ') || 'None selected'}
      - Clouds: ${formData.selectedClouds.join(', ') || 'None selected'}
      - Integrations: ${formData.selectedIntegrations.join(', ') || 'None selected'}
      - AI Tools: ${formData.selectedAITools.join(', ') || 'None selected'}
      - Modules: ${formData.additionalModules.join(', ') || 'None selected'}
      
      In a succinctly articulate manner, synthesize the above scope and technical configurations into a cohesive, structured Scope of Work in a bullet-point outline while using the EXACT headers below. Map the input data to the most relevant section:
      - PROJECT SCOPE & OBJECTIVES
      - CURRENT TECH STACK
      - PROBLEMS
      - REQUIREMENTS
      - AUTOMATIONS & INTEGRATIONS
      - TIMELINE & CONSTRAINTS`;
      
    handleSendMessage(prompt, true); // Pass true to show action buttons
  };

  const handleAutofillFromDescription = () => {
    if (!formData?.projectDescription?.trim()) {
      setIsOpen(true); // Open chat when empty
      handleSendMessage("I'd like to autofill the estimator, but the project description is empty. Can you please provide details using this format?\n\n- **Systems:** (e.g. Salesforce, Slack)\n- **Pain Points:** (e.g. manual data entry)\n- **Goals:** (e.g. automate lead routing)\n- **Users:** (e.g. 50 sales reps)");
      return;
    }

    // Check for critical information in the project description
    const description = formData.projectDescription.toLowerCase();
    const hasSystems = /salesforce|dynamics|gohighlevel|hubspot|monday|zoho|crm|slack|asana|jira|github|google|microsoft|zoom|docusign|make|zapier|n8n|mulesoft|cloud|integration/i.test(description);
    const hasPainPoints = /pain|challenge|issue|problem|difficulty|struggle|bottleneck|manual|inefficient/i.test(description);
    const hasGoals = /goal|outcome|objective|want|need|require|automate|improve|increase|reduce|streamline/i.test(description);
    const hasAutomations = /automate|automation|workflow|integrate|integration|connect|sync/i.test(description);
    const hasDeliverables = /deliver|deliverable|requirement|feature|functionality|capability|module/i.test(description);
    
    const missingCriticalInfo = [];
    if (!hasSystems) missingCriticalInfo.push('**Current systems/infrastructure**');
    if (!hasPainPoints) missingCriticalInfo.push('**Pain points/challenges**');
    if (!hasGoals) missingCriticalInfo.push('**Desired outcomes & goals**');
    if (!hasAutomations) missingCriticalInfo.push('**Required automations/integrations**');
    if (!hasDeliverables) missingCriticalInfo.push('**Key deliverables/requirements**');

    // If critical info is missing, open the chat and ask for it
    if (missingCriticalInfo.length > 0) {
      setIsOpen(true); // Open chat to request missing info
      const missingList = missingCriticalInfo.join('\n• ');
      handleSendMessage(`I'd like to autofill your estimator, but I need more information. Please add details about:\n\n• ${missingList}\n\nOptionally, you can also include:\n• Timeline & budget constraints\n\nThis will help me provide a more accurate configuration!`);
      return;
    }

    // If all critical info is present, autofill silently (don't open chat)
    const prompt = `Parse the following project description and return ONLY a JSON object containing the matching configurations. 
      Description: "${formData.projectDescription}"
      
      Use these keys: selectedCRMs, selectedClouds, selectedIntegrations, selectedAITools, additionalModules.
      
      Valid options for CRMs: Salesforce, Dynamics 365, GoHighLevel, HubSpot, Monday.com, Zoho.
      Valid Clouds: Sales Cloud, Service Cloud, Marketing Cloud, Commerce Cloud, Financial Services Cloud, Experience Cloud, Agentforce.
      Valid Integrations: Slack, Asana, Jira, GitHub, Google Workspace, Microsoft 365, Zoom, DocuSign, Make.com, Zapier, n8n, MuleSoft.
      Valid AI Tools: OpenAI ChatGPT, Gemini, Copilot, Claude.
      Valid Modules: Reporting and Dashboards, Workflow Automation, Custom Development, Lead Management, Data Migration, User Training.`;
    
    // Don't open chat - just send the message silently
    handleSendMessage(prompt, true); // Pass true to show action buttons
  };

  const handleDurationSelect = (messageId: string, duration: '15min' | '30min' | '60min') => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, calendarDuration: duration }
          : msg
      )
    );
  };

  const getCalendarUrl = (duration: '15min' | '30min' | '60min') => {
    const urls = {
      '15min': 'https://sites.google.com/bktadvisory.com/booking-page/',
      '30min': 'https://sites.google.com/bktadvisory.com/booking-page/',
      '60min': 'https://sites.google.com/bktadvisory.com/booking-page/',
    };
    return urls[duration];
  };

  const openBookingModal = (url: string) => {
    setBookingIframeUrl(url);
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setBookingIframeUrl(null);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-slate-700"
            : "bg-gradient-to-r from-blue-600 to-indigo-600"
        }`}
        aria-label="AI Assistant"
      >
        {isOpen ? (
          <XIcon size={24} className="text-white" />
        ) : (
          <div className="relative">
            <MessageCircleIcon size={24} className="text-white" />
            <SparklesIcon
              size={12}
              className="absolute -top-1 -right-1 text-yellow-300 animate-pulse"
            />
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden min-h-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <SparklesIcon size={20} />
              </div>
              <div>
                <h3 className="text-white">AI Assistant</h3>
                <p className="text-blue-100 text-sm">
                  Powered by OpenAI gpt-4.1
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-slate-50 overscroll-contain chat-scroll-area [-webkit-overflow-scrolling:touch]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.isCalendarBooking && message.sender === "bot" ? (
                  /* Google Calendar Booking - Inline Service Cards */
                  <div className="w-full max-w-full">
                    {/* Message Bubble */}
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 mb-4 max-w-[85%]">
                      <p className="text-sm text-slate-800">
                        Certainly! You can book a call with John directly here. Please select your preferred time (15, 30, or 60 mins) and enter your details directly on that page.
                      </p>
                    </div>
                    
                    {/* Service Cards Grid */}
                    <div className="flex flex-wrap gap-4 justify-center w-full">
                      {/* 15-Min Discovery */}
                      <div
                        onClick={() => openBookingModal('https://calendar.app.google/26nkEZE18gENpuGo8')}
                        className="relative flex flex-col justify-between w-[215px] h-[115px] bg-white border border-[#c4c7c5] rounded-lg p-4 cursor-pointer transition-all duration-[280ms] hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:border-transparent"
                      >
                        <h3 className="text-[1.15rem] font-normal text-[#1f1f1f] mb-2.5 leading-5" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                          Discovery Call
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-[#444746]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 -960 960 960" fill="#444746">
                              <path d="M480-240q100 0 170-70t70-170q0-100-70-170t-170-70v240L310-310q35 33 78.5 51.5T480-240Zm0 160q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                            </svg>
                            <span>15 mins</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-[#444746]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            <img 
                              src="https://ssl.gstatic.com/calendar/images/conferenceproviders/logo_meet_2020q4_192px.svg" 
                              className="w-4 h-4 object-contain" 
                              alt="Google Meet"
                            />
                            <span>Google Meet</span>
                          </div>
                        </div>
                      </div>

                      {/* 30-Min Strategy */}
                      <div
                        onClick={() => openBookingModal('https://calendar.app.google/ybjY5qL32semyiJ88')}
                        className="relative flex flex-col justify-between w-[215px] h-[115px] bg-white border border-[#c4c7c5] rounded-lg p-4 cursor-pointer transition-all duration-[280ms] hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:border-transparent"
                      >
                        <h3 className="text-[1.15rem] font-normal text-[#1f1f1f] mb-2.5 leading-5" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                          Strategic Planning
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-[#444746]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 -960 960 960" fill="#444746">
                              <path d="M480-240q100 0 170-70t70-170q0-100-70-170t-170-70v240L310-310q35 33 78.5 51.5T480-240Zm0 160q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                            </svg>
                            <span>30 min</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-[#444746]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            <img 
                              src="https://ssl.gstatic.com/calendar/images/conferenceproviders/logo_meet_2020q4_192px.svg" 
                              className="w-4 h-4 object-contain" 
                              alt="Google Meet"
                            />
                            <span>Google Meet</span>
                          </div>
                        </div>
                      </div>

                      {/* 1-Hr Deep Dive */}
                      <div
                        onClick={() => openBookingModal('https://calendar.app.google/SDquXNuRq74gJFq46')}
                        className="relative flex flex-col justify-between w-[215px] h-[115px] bg-white border border-[#c4c7c5] rounded-lg p-4 cursor-pointer transition-all duration-[280ms] hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:border-transparent"
                      >
                        <h3 className="text-[1.15rem] font-normal text-[#1f1f1f] mb-2.5 leading-5" style={{ fontFamily: "'Google Sans', sans-serif" }}>
                          Workshop
                        </h3>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-[#444746]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 -960 960 960" fill="#444746">
                              <path d="M480-240q100 0 170-70t70-170q0-100-70-170t-170-70v240L310-310q35 33 78.5 51.5T480-240Zm0 160q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                            </svg>
                            <span>60 min</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-[#444746]" style={{ fontFamily: "'Roboto', sans-serif" }}>
                            <img 
                              src="https://ssl.gstatic.com/calendar/images/conferenceproviders/logo_meet_2020q4_192px.svg" 
                              className="w-4 h-4 object-contain"
                              alt="Google Meet"
                            />
                            <span>Google Meet</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-slate-200 text-slate-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {formatMessageText(message.text, message.sender)}
                    </p>

                    {/* Copy and Use Prompt buttons for bot messages that look like scopes */}
                    {message.sender === "bot" &&
                      message.showActionButtons &&
                      !message.isEstimatorUpdate && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                          <button
                            onClick={() =>
                              handleCopy(message.text, message.id)
                            }
                            className="flex items-center gap-1 text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700"
                          >
                            {copiedId === message.id ? (
                              <>
                                <CheckIcon size={14} />
                                Copied!
                              </>
                            ) : (
                              <>
                                <CopyIcon size={14} />
                                Copy
                              </>
                            )}
                          </button>
                          {onInsertPrompt && (
                            <button
                              onClick={() =>
                                handleUsePrompt(message.text)
                              }
                              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                            >
                              <SparklesIcon size={14} />
                              Insert Scope
                            </button>
                          )}
                        </div>
                      )}

                    {/* Estimator Updated: icon-only copy button, bottom-left */}
                    {message.sender === "bot" &&
                      message.isEstimatorUpdate && (
                        <div className="flex mt-2 pt-2">
                          <button
                            onClick={() =>
                              handleCopy(message.text, message.id)
                            }
                            className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-700"
                            aria-label="Copy to clipboard"
                            title={copiedId === message.id ? "Copied!" : "Copy"}
                          >
                            {copiedId === message.id ? (
                              <CheckIcon size={14} className="text-green-600" />
                            ) : (
                              <CopyIcon size={14} />
                            )}
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-slate-500">
                  <Loader2Icon size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-200">
            {/* Quick Prompts */}
            <div className="mb-3 flex flex-wrap gap-2">
              {(currentPage === "estimator"
                ? (currentStep >= 2 
                    ? [
                        "Write Project Description based on my configurations.",
                        "Autofill the Project Estimator from my Project Description.",
                      ]
                    : []
                  )
                : [
                    "Schedule a call with John Burkhardt.",
                    "Guide me through the Project Estimator and get a Quote.",
                    "Please write me a project description.",
                  ]
              ).map((prompt, i) => {
                const isPrimaryAI = 
                  prompt === "Write Project Description based on my configurations." || 
                  prompt === "Autofill the Project Estimator from my Project Description.";
                
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (prompt === "Write Project Description based on my configurations.") {
                        handleGenerateFromSelections();
                      } else if (prompt === "Autofill the Project Estimator from my Project Description.") {
                        handleAutofillFromDescription();
                      } else {
                        handleSendMessage(prompt);
                      }
                    }}
                    disabled={isLoading}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all text-left border flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isPrimaryAI
                        ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm font-medium"
                        : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {isPrimaryAI && <SparklesIcon size={12} className="text-blue-500 animate-pulse" />}
                    {prompt}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSendMessage())
                }
                placeholder="Describe your project..."
                disabled={isLoading}
                rows={1}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 resize-none overflow-hidden min-h-[40px] max-h-[88px] chat-scroll-area"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <SendIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={closeBookingModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-[800px] w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {!bookingIframeUrl ? (
              <>
                {/* Header */}
                <div className="flex flex-col items-center p-6 text-center border-b border-slate-200">
                  <img 
                    alt="John Burkhardt" 
                    src="https://lh3.googleusercontent.com/a-/ALV-UjUKsVkb4rL7QwPkEtDwipBhlu3deHrsCazzdAfDDA_HQI9kdPI=s112-c-mo" 
                    className="rounded-full w-16 h-16 object-cover mb-2"
                  />
                  <h2 className="text-2xl font-normal text-slate-900 mb-1">John Burkhardt</h2>
                  <p className="text-sm text-slate-600">Appointments</p>
                </div>

                {/* Service Cards */}
                <div className="p-6 flex flex-wrap gap-4 justify-center">
                  {/* 15-Min Discovery Call */}
                  <div
                    onClick={() => openBookingModal('https://calendar.app.google/26nkEZE18gENpuGo8')}
                    className="relative flex flex-col justify-between w-[215px] h-[115px] bg-white border border-slate-300 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:border-transparent"
                  >
                    <h3 className="text-lg font-normal text-slate-900 mb-2">Discovery Call</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>15 min</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <img 
                          src="https://ssl.gstatic.com/calendar/images/conferenceproviders/logo_meet_2020q4_192px.svg" 
                          className="w-5 h-5" 
                          alt="Google Meet"
                        />
                        <span>Google Meet</span>
                      </div>
                    </div>
                  </div>

                  {/* 30-Min Strategic Planning */}
                  <div
                    onClick={() => openBookingModal('https://calendar.app.google/ybjY5qL32semyiJ88')}
                    className="relative flex flex-col justify-between w-[215px] h-[115px] bg-white border border-slate-300 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:border-transparent"
                  >
                    <h3 className="text-lg font-normal text-slate-900 mb-2">Strategic Planning</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>30 min</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <img 
                          src="https://ssl.gstatic.com/calendar/images/conferenceproviders/logo_meet_2020q4_192px.svg" 
                          className="w-5 h-5" 
                          alt="Google Meet"
                        />
                        <span>Google Meet</span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Hr Workshop */}
                  <div
                    onClick={() => openBookingModal('https://calendar.app.google/SDquXNuRq74gJFq46')}
                    className="relative flex flex-col justify-between w-[215px] h-[115px] bg-white border border-slate-300 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] hover:border-transparent"
                  >
                    <h3 className="text-lg font-normal text-slate-900 mb-2">Workshop</h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>60 min</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <img 
                          src="https://ssl.gstatic.com/calendar/images/conferenceproviders/logo_meet_2020q4_192px.svg" 
                          className="w-5 h-5" 
                          alt="Google Meet"
                        />
                        <span>Google Meet</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <div className="p-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={closeBookingModal}
                    className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Booking Frame View */}
                <div className="relative h-[800px] flex items-center justify-center p-6">
                  {/* Back Button */}
                  <button
                    onClick={() => setBookingIframeUrl(null)}
                    className="absolute top-3 left-3 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors text-slate-600"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={closeBookingModal}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors text-slate-600 text-2xl font-bold"
                  >
                    ×
                  </button>
                  <iframe
                    src={bookingIframeUrl}
                    className="w-full h-full border-0 rounded-2xl"
                    title="Google Calendar Booking"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}