import React, { useState, useEffect, useRef } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { useNavigate, Link } from "react-router-dom";
import { differenceInCalendarDays, isToday, isYesterday } from 'date-fns'; // Import date functions
import OpenAI from 'openai';
import Swal from 'sweetalert2';
import Toast from './Toast'; // Adjust the path as necessary
import config from '../config.json';
import AxiosPostRequest from '../api/AxiosPostRequest'; 

const Home = ({ setIsAuthenticated }) => {
  const defaultAgentIcon = config.defaultAgentIcon;
  const siteUrl = config.siteUrl;

  const navigate = useNavigate();

  const handleSignout = async () => {
    
    const result = await Swal.fire({
      title: '<h2 class="text-lg text-white">Are you sure you want to sign out?</h2>',
      icon: 'warning',
      background: '#1F2937', // Dark background
      showCancelButton: true,
      confirmButtonText: 'Yes, sign out!!',
      cancelButtonText: 'No, cancel',
      customClass: {
        confirmButton: 'bg-delete-color hover:bg-red-700 text-white text-sm', // Custom delete button
        cancelButton: 'bg-threeoptions-background hover:threeoptions-hover text-white text-sm', // Custom cancel button
        popup: 'border border-custom-bother-gray w-full md:w-2/5', // Smaller popup size with padding
      },
    });

    if (result.isConfirmed) {
       
      localStorage.removeItem('raia-loginKey'); // Replace with your specific keys
      localStorage.removeItem('raia-loginUsername'); // Example of another item to remove
    
      setIsAuthenticated(false);

      navigate('/');
    }
  };

  const apiKey  = config.apiKey;
  const secretKey = config.secretKey;

  const loginKey = localStorage.getItem('raia-loginKey');
  const loginUsername = localStorage.getItem('raia-loginUsername');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState();

  const hasAgentsFetched = useRef(false); // Create a ref to track fetch status
  
  const handleGetAgents = async () => {
    if (!hasAgentsFetched.current) {
      hasAgentsFetched.current = true; // Set the flag to true
    } else {
      return;
    }
    
    const data = {
      'APIKEY': apiKey,
      'SECRETKEY': secretKey,
      'loginKey': loginKey,
    };
    
    try {
      const response = await AxiosPostRequest(`${siteUrl}/api/getAgents.cfm`, data);
      if (response.Agents && response.Agents.length > 0) {
        setAgents(response.Agents);
        setSelectedAgent(response.Agents[0]);
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
    
  }; 

  useEffect(() => {
    handleGetAgents();
  }, []); 

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAgentChange = (agent) => {
    setSelectedAgent(agent);
    toggleDropdown();

    handleStartNewChat();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const [historyDropdownOpen, setHistoryDropdownOpen] = useState(null); // State to manage dropdown visibility

  const toggleHistoryDropdown = (threadId) => {
    setHistoryDropdownOpen(historyDropdownOpen === threadId ? null : threadId);
  };

  const handleShare = (threadId) => {
    console.log(`Share chat with ID: ${threadId}`);
  };

  const [renameThreadId, setRenameThreadId] = useState(null); // State to track which thread is being renamed
  const [newThreadName, setNewThreadName] = useState(''); // State to hold the new name

  const handleRename = (threadId, currentName) => {
    setRenameThreadId(threadId); // Set the thread being renamed
    setNewThreadName(currentName); // Set the current name as default in the input
  };
  
  const handleRenameSubmit = async(threadId) => {
    toggleHistoryDropdown(null);
    
    const data = {
      'APIKEY': apiKey,
      'SECRETKEY': secretKey,
      'loginKey': loginKey,
      'thread_id': threadId,
      'thread_name': newThreadName
    };

    try {
      await AxiosPostRequest(`${siteUrl}/api/updateThread.cfm`, data);
      
      setThreadList(prevThreadList =>
        prevThreadList.map(oneThread =>
          oneThread.thread_id === threadId
            ? { ...oneThread, message: newThreadName } // Update the thread message with the new name
            : oneThread
        )
      );
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
    
    setRenameThreadId(null);
  };

  const handleDeleteThread = async(threadId) => {
    toggleHistoryDropdown(null);

    const result = await Swal.fire({
      title: '<h2 class="text-lg text-white">Are you sure you want to delete this thread?</h2>',
      html: '<p class="text-sm text-gcustom-text-gray">You won\'t be able to revert this!</p>',
      icon: 'warning',
      background: '#1F2937', // Dark background
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
      customClass: {
        confirmButton: 'bg-delete-color hover:bg-red-700 text-white text-sm', // Custom delete button
        cancelButton: 'bg-threeoptions-background hover:threeoptions-hover text-white text-sm', // Custom cancel button
        popup: 'border border-custom-bother-gray w-full md:w-2/5', // Smaller popup size with padding
      },
    });
    
    

    if (result.isConfirmed) {
       
      if (thread && thread.id === threadId) {
        handleStartNewChat();
      }

      const response = await openai.beta.threads.del(threadId);

      if (response.deleted) {
        const data = {
          'APIKEY': apiKey,
          'SECRETKEY': secretKey,
          'loginKey': loginKey,
          'thread_id': threadId,
        };
    
        try {
          const response = await AxiosPostRequest(`${siteUrl}/api/deleteThread.cfm`, data);
          
          if (response.status === 'success') {
            setThreadList(threadList.filter(oneThread => oneThread.thread_id !== threadId));
          }
    
        } catch (error) {
          console.error(error.response ? error.response.data : error.message);
        }
      }
    }
  };

  const [mobileSuggestions, setMobileSuggestions] = useState([]);
  const [webSuggestions, setWebSuggestions] = useState([]);
  const [mobileSuggestionDescs, setMobileSuggestionDescs] = useState([]);
  const [webSuggestionDescs, setWebSuggestionDescs] = useState([]);
  
  const handleStartNewChat = () => {
    setIsSidebarOpen(false);
    setMessage('');
    setMessages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleStartChat(message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async (newMessage, isSuggestion = false) => {
    const newMessages = [...messages, { message: newMessage, role: 'user' }];
    setMessages(newMessages);
    setMessage('');

    setIsLoading(true);

    const { replyText, message_id, thread_id } = await sendMessage(newMessage, isSuggestion);
    setMessages(prevMessages => [...prevMessages, 
      { 
        message: replyText, 
        role: 'assistant',
        message_id: message_id,
        thread_id: thread_id
      }
    ]);

    setIsLoading(false);
  }

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [realHeight, setRealHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1024);
    setRealHeight(window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  const suggestionsToDisplay = isMobile ? mobileSuggestions : webSuggestions;
  const suggestionDescsToDisplay = isMobile ? mobileSuggestionDescs : webSuggestionDescs;

  const [openai, setOpenAI] = useState(null);
  const [thread, setThread] = useState(null);

  const createOpenAI = () => {
    const openaiClient = new OpenAI({ 
      apiKey: selectedAgent.openai_api_key,
      dangerouslyAllowBrowser: true,
    });
    setOpenAI(openaiClient);
  };

  const [threadList, setThreadList] = useState(null);

  const getThreadsList = async () => {
    const data = {
      'APIKEY': apiKey,
      'SECRETKEY': secretKey,
      'loginKey': loginKey,
      'assistant_id': selectedAgent.openai_assistant_id,
    };

    try {
      const response = await AxiosPostRequest(`${siteUrl}/api/getThreads.cfm`, data);
      const filteredResponse = Array.isArray(response)
      ? response
          .filter(thread => thread.message !== "")  // Filter out empty messages
      : [];
      setThreadList(filteredResponse);

      const categorized = categorizeThreadsByDate(filteredResponse); // Categorize threads after fetching
      setCategorizedThreads(categorized); // Update categorized threads state

    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  }

  const createThread = async () => {
    try {
      const newThread = await openai.beta.threads.create({ });
      setThread(newThread);
      saveThread(newThread);

      return newThread;
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  const saveThread = async (newThread) => {
    const data = {
      'APIKEY': apiKey,
      'SECRETKEY': secretKey,
      'LOGINKEY': loginKey,
      'thread_id': newThread.id,
      'assistant_id': selectedAgent.openai_assistant_id,
      'created_at': newThread.created_at,
    };

    try {
      await AxiosPostRequest(`${siteUrl}/api/saveThread.cfm`, data);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  }

  const cleanJsonString = (str) => {
    return str.replace(/[^\x20-\x7E]/g, ''); // Remove non-printable ASCII characters
  };

  const getThread = async (threadId) => {
    const data = {
      'APIKEY': apiKey,
      'SECRETKEY': secretKey,
      'LOGINKEY': loginKey,
      'thread_id': threadId,
    };

    const response = await AxiosPostRequest(`${siteUrl}/api/getThread.cfm`, data);
  
    let responseThread;

    if (response && Array.isArray(response.Thread) && response.Thread.length > 0) {
      responseThread = response.Thread[0]; // Get the first thread
    } else {
      const cleanedString = cleanJsonString(response);
      const responseString = JSON.parse(cleanedString); // Convert JSON string to object
      responseThread = responseString.Thread[0];
    }
           // Create a new array of messages with associated comments
    const messagesWithComments = responseThread.Messages.map((message) => {
      // Find comments that match the current message ID
      const responseComments = responseThread.Comments || [];
      const associatedComments = responseComments.filter(comment => comment.message_id === message.message_id);
      
      return {
        ...message, // Spread existing message properties
        thread_id: threadId,
        comments: associatedComments[0] // Add the comments array
      };
    });

    messagesWithComments.sort((a, b) => {
      return a.created_at - b.created_at; // Ascending order for older first
    });

    setMessages(messagesWithComments);
  }

  const openThread = async (selectedThread) => {
    if (thread && thread.thread_id === selectedThread.thread_id) 
      return;

    selectedThread.id = selectedThread.thread_id;

    setThread(selectedThread);

    getThread(selectedThread.thread_id);

    setIsSidebarOpen(false);

    handleCancelComment();
  }

  const sendMessage = async (userMessageContent, isSuggestion = false) => {
    if (!openai) {
      console.error("OpenAI client is not initialized.");
      return; // Exit if openai is null
    }

    const currentThread = isSuggestion?await createThread():thread || await createThread();

    if (messages.length === 0) {
      setThreadList((prevThreadList) => {
        const threadWithId = {
          ...currentThread,
          thread_id: currentThread.id, // Set thread_id to the same value as id
          message: userMessageContent
        };

        const updatedThreadList = [...prevThreadList, threadWithId];
    
        return updatedThreadList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      });
    }

    try {
      const userMessage = await openai.beta.threads.messages.create(currentThread.id,
        {
          role: "user",
          content: userMessageContent
        }
      );

      const run = await openai.beta.threads.runs.createAndPoll(currentThread.id, {
        assistant_id: selectedAgent.openai_assistant_id,
      });

      if (run.status === 'completed') {
        const assistantMessage = await openai.beta.threads.messages.list(run.thread_id, 
          {
            limit: 1,
            order: "desc" // Assuming 'desc' orders messages from latest to oldest
          }
        );
        
        if (assistantMessage) {
          saveMessage(currentThread.id, run.id, userMessage.id, userMessage.created_at, userMessageContent, userMessage.role);

          const assistantMessageData = assistantMessage.data[0];
          const replyText = assistantMessageData.content[0].text.value; 
          saveMessage(currentThread.id, run.id, assistantMessageData.id, assistantMessageData.created_at, replyText, assistantMessageData.role);

          return {
            replyText: replyText,
            message_id: assistantMessageData.id,
            thread_id: currentThread.id
          }; // Return the reply text
        }
       
      } else {
        console.log(run.status);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const saveMessage = async (thread_id, run_id, message_id, message_created_at, messageContent, role) => {
    const data = {
      'APIKEY': apiKey,
      'SECRETKEY': secretKey,
      'LOGINKEY': loginKey,
      'thread_id': thread_id,
      'assistant_id': selectedAgent.openai_assistant_id,
      'message_id': message_id,
      'created_at': message_created_at,
      'run_id': run_id,
      'message': messageContent,
      'role': role,
    };

    try {
      await AxiosPostRequest(`${siteUrl}/api/saveMessage.cfm`, data);
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
    }
  }

  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [comment, setComment] = useState('');

  const [commentThreadId, setCommentThreadId] = useState(null);
  const [commentMessageId, setCommentMessageId] = useState(null);
  const [commentThumbsUp, setCommentThumbsUp] = useState(true);

  const writeComment = async(threadId, messageId, isThumbsUp) => {
    setCommentThreadId(threadId);
    setCommentMessageId(messageId);
    setCommentThumbsUp(isThumbsUp);

    setCommentModalOpen(true); // Open the modal
  }

  const handleSaveComment = async() => {
    const data = {
      'APIKEY': apiKey,
      'SECRETKEY': secretKey,
      'loginKey': loginKey,
      'thread_id': commentThreadId,
      'message_id': commentMessageId,
      'comment': comment,
      'isThumbsUp': commentThumbsUp?1:0,
      'isThumbsDown': commentThumbsUp?0:1,
      'created_at': Date.now()
    };

    try {
      await AxiosPostRequest(`${siteUrl}/api/newComment.cfm`, data);
      
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.message_id === commentMessageId && msg.thread_id === commentThreadId) {
            const updatedComments = msg.comments
              ? { ...msg.comments, isThumbsUp: commentThumbsUp ? "1" : "0", comment: data.comment } // Update thumbs up state
              : { isThumbsUp: commentThumbsUp ? "1" : "0", comment: data.comment}; // Create new comments if none exist
            return { ...msg, comments: updatedComments }; // Return updated message
          }
          return msg; // Return unchanged message
        })
      );

    } catch (error) {
      console.error("Error fetching agents:", error);
    }

    setCommentModalOpen(false);
    setComment('');
  };

  const handleCancelComment = () => {
    setCommentModalOpen(false); // Close modal
    setCommentThreadId(null);
    setCommentMessageId(null);
    setComment(''); // Clear the comment input
  };

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = async (copyText) => {
    try {
      await navigator.clipboard.writeText(copyText);
      setToastMessage("Copied to clipboard!");
      setShowToast(true);
    } catch (err) {
      setToastMessage("Failed to copy!");
      setShowToast(true);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const extractSuggestions = (agent) => {
    const starters = [];
    const descriptions = [];

    for (let i = 1; i <= 4; i++) {
        const starter = agent[`ConversationStarter${i}`];
        const desc = agent[`ConversationStarter${i}_desc`];

        if (starter) starters.push(starter);
        if (desc) descriptions.push(desc);
    }

    return { starters, descriptions };
  };

  useEffect(() => {
    if (selectedAgent) {
      const { starters: conversationStarters, descriptions: conversationStartersDesc } = extractSuggestions(selectedAgent);

      setMobileSuggestions(conversationStarters.slice(0, 2));
      setMobileSuggestionDescs(conversationStartersDesc.slice(0, 2));

      setWebSuggestions(conversationStarters);
      setWebSuggestionDescs(conversationStartersDesc);

      createOpenAI();
    }
  }, [selectedAgent]);

  useEffect(() => {
    if (openai) {
      getThreadsList();
    }
  }, [openai]);

  useEffect(() => {
    const categorized = categorizeThreadsByDate(threadList);
    setCategorizedThreads(categorized);
  }, [threadList]);

  const [categorizedThreads, setCategorizedThreads] = useState({
    today: [],
    yesterday: [],
    previous7Days: [],
    past30Days: [],
    older: [],
  });
  
  const categorizeThreadsByDate = (threads) => {
    const today = [];
    const yesterday = [];
    const previous7Days = [];
    const past30Days = [];
    const older = [];

    if (threads && threads.length > 0) {
      threads.forEach((thread) => {
        const createdAt = new Date(thread.created_at * 1000); // No need to convert since it's already in milliseconds
        const daysDiff = differenceInCalendarDays(new Date(), createdAt);
        if (isToday(createdAt)) {
          today.push(thread);
        } else if (isYesterday(createdAt)) {
          yesterday.push(thread);
        } else if (daysDiff <= 7) {
          previous7Days.push(thread);
        } else if (daysDiff <= 30) {
          past30Days.push(thread);
        } else {
          older.push(thread);
        }
      });
    }
  
    const sortByCreatedAt = (a, b) => b.created_at - a.created_at; // Sort function for descending order
    return {
      today: today.sort(sortByCreatedAt),
      yesterday: yesterday.sort(sortByCreatedAt),
      previous7Days: previous7Days.sort(sortByCreatedAt),
      past30Days: past30Days.sort(sortByCreatedAt),
      older: older.sort(sortByCreatedAt),
    };
  };

  const renderThreads = (threads, title) => (
    <div key={title}>
      <h1 className="p-2 text-xs font-medium text-custom-text-gray">{title}</h1>
      {threads.map((oneThread) => (
        <div
          key={oneThread.thread_id}
          className="p-2 scrollbar-thumb-rounded scrollbar-track-gray-200 scrollbar-thumb-gray-600 text-sm font-normal rounded-lg hover:bg-custom-hover-gray flex justify-between items-center cursor-pointer group "
        >
          {renameThreadId === oneThread.thread_id ? (
            <input
              type="text"
              value={newThreadName}
              onChange={(e) => setNewThreadName(e.target.value)}
              onBlur={() => handleRenameSubmit(oneThread.thread_id)} // Submit on blur
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSubmit(oneThread.thread_id); // Submit on Enter key
              }}
              className="mr-3 w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          ) : (
            <h2 className="truncate mr-2 w-full" onClick={() => openThread(oneThread)} >{oneThread.message}</h2>
          )}
          
          <div 
            className="opacity-30 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center relative gap-2 cursor-pointer">
            <i
              className="fas fa-ellipsis-h text-md hover:text-custom-hover-gray2"
              style={{ width: '18px', height: '18px' }}
              onClick={() => toggleHistoryDropdown(oneThread.thread_id)}
            ></i>
            <i
              className="fas fa-trash-alt text-md hover:text-custom-hover-gray2"
              style={{ width: '18px', height: '18px' }}
              onClick={() => handleDeleteThread(oneThread.thread_id)}
            ></i>

            {/* Dropdown Menu */}
            {(historyDropdownOpen === oneThread.thread_id) && (
              <div 
                onMouseLeave={() => toggleHistoryDropdown(null)}  // Clear hovered thread
                className="absolute bg-threeoptions-background text-sm font-normal rounded-lg top-8 right-2 w-36 z-10">
                <div
                  onBlur={() => setHistoryDropdownOpen(null)} 
                  className="p-3 m-2 rounded-md hover:bg-threeoptions-hover cursor-pointer flex items-center gap-3"
                  onClick={() => handleRename(oneThread.thread_id, oneThread.message)}
                >
                  <i className="fas fa-pencil-alt icon-md" style={{ width: '18px', height: '18px' }}></i>
                  <span>Rename</span>
                </div>
                <div
                  className="p-3 m-2 rounded-md hover:bg-threeoptions-hover cursor-pointer flex items-center gap-3 text-delete-color"
                  onClick={() => handleDeleteThread(oneThread.thread_id)}
                >
                  <i className="fas fa-trash-alt icon-md" style={{ width: '18px', height: '18px' }}></i>
                  <span>Delete</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex" style={{ height: realHeight }}>
      {isCommentModalOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-dialog-background p-3 rounded shadow-lg mx-8 w-full md:w-1/3">
          <h2 className="text-lg font-semibold mb-4 text-white">Write Comment</h2>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment here..."
            rows="5"
            className="w-full bg-transparent text-white border border-gray-300 rounded p-2 mb-4"
          />
          <div className="flex justify-between">
            <button 
              onClick={handleSaveComment}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save&nbsp;
              {commentThumbsUp ? (
                <i className="far fa-thumbs-up"></i>
              ) : (
                <i className="far fa-thumbs-down"></i>
              )}
            </button>
            <button 
              onClick={handleCancelComment}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Left Sidebar */}
      <div
        className={`fixed inset-y-0 z-50 w-3/4 md:w-1/3 bg-sidebar-background text-white p-3 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col`}
      >
        {/* App Icon, New Chat */}
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-custom-hover-gray cursor-pointer" >
          <i 
            className="fas fas fa-bars cursor-pointer md:hidden text-md" style={{ width: '18px', height: '18px' }}
            onClick={() => {
              setIsSidebarOpen(false); // Close the sidebar
              toggleHistoryDropdown(null); // Toggle the dropdown visibility
            }}>
          </i>
          {selectedAgent && (
          <div className="flex items-center">
            <img 
              src={selectedAgent.icon} 
              alt={selectedAgent.alias} 
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite looping
                e.target.src = defaultAgentIcon; // Replace with your default image URL
              }}
              className="w-7 h-7 rounded-full mr-2" />
            <p className="text-sm font-medium text-white">{selectedAgent.alias}</p>
          </div>
          )}
          <i 
            className="fas fa-pencil-alt text-md cursor-pointer" style={{ width: '18px', height: '18px' }}
            onClick={() => {
              handleStartNewChat(); 
              toggleHistoryDropdown(null); // Toggle the dropdown visibility
            }}>
          </i>
        </div>

        {/* Thread History */}
        <div className="flex-1 overflow-y-auto text-sm">
          {threadList && threadList.length > 0 ? (
            <>
              {categorizedThreads.today.length > 0 && renderThreads(categorizedThreads.today, 'Today')}
              {categorizedThreads.yesterday.length > 0 && renderThreads(categorizedThreads.yesterday, 'Yesterday')}
              {categorizedThreads.previous7Days.length > 0 && renderThreads(categorizedThreads.previous7Days, 'Previous 7 days')}
              {categorizedThreads.past30Days.length > 0 && renderThreads(categorizedThreads.past30Days, 'Past 30 days')}
              {categorizedThreads.older.length > 0 && renderThreads(categorizedThreads.older, 'Older')}
            </>
          ) : (
            <div className="p-2 text-xs font-medium text-custom-text-gray">No conversations</div> // Optional message for empty state
          )}
        </div>


        {/* User Info at the bottom */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-3 py-[10px] pl-2 hover:bg-custom-hover-gray3 w-auto rounded-xl cursor-pointer">
            <div className="text-white border-2 rounded-full w-7 h-7 border-custom-bother-gray flex justify-center items-center">
              <i className="fas fa-star icon-sm shrink-0"></i>
            </div>
            <Link to={siteUrl}>
              <h1 className="text-sm font-normal text-white">ask raia</h1>
              <p className="text-xs font-normal text-custom-text-gray">
                Do you need help?
              </p>
            </Link>
          </div>

          <div className="flex items-center gap-3 py-[10px] pl-2 hover:bg-custom-hover-gray3 w-auto rounded-xl cursor-pointer"
            onClick={() => handleSignout()} 
          >
            <div className="flex items-center justify-center w-8 h-8 bg-custom-red rounded-full text-white">
              <span className="text-sm">{loginUsername.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-sm font-normal text-white">{loginUsername}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-main-background">
        {/* Top Header for Mobile */}
        <div className="flex items-center justify-between border-b-2 border-gray-600 md:border-0 p-3 text-white">
          <i className="fas fa-bars cursor-pointer md:hidden" onClick={() => setIsSidebarOpen(true)} ></i>

          <div className="relative flex-1 flex justify-center md:justify-start" >
            {selectedAgent && (
            <div className="flex items-center p-3 rounded-lg hover:bg-custom-hover-gray4 cursor-pointer" onClick={toggleDropdown}>
              <span className="text-lg font-semibold">{selectedAgent.alias}</span>
              <span className="text-engine-version-text pl-2">
                {/* {selectedAgent.version} */}
                <i className="fas fa-chevron-down text-token-text-tertiary pl-2 text-xs"></i>
              </span>
            </div>
            )}
            {isDropdownOpen && (
            <div className="absolute mt-14 2xl:w-[400px] md:w-[45vw] lg:w-[45vw] xl:w-[25vw] bg-threeoptions-background rounded-lg max-h-48 overflow-y-auto">
              
              {agents.map((agent) => (
              <div
                key={agent.apikey}
                className="p-3 m-2 rounded hover:bg-custom-hover-gray5 cursor-pointer flex justify-between items-center"
                onClick={() => handleAgentChange(agent)}
              >
                <div className="text-sm font-medium">
                  <p>{agent.name}</p>
                  <p className="text-agent-version-text">{agent.description}</p>
                </div>
                {selectedAgent.apikey === agent.apikey && <i className="fas fa-check-circle text-white flex-shrink-0"></i>}
              </div>
              ))}

            </div>
            )}
          </div>

          <i className="fas fa-edit cursor-pointer md:hidden" onClick={handleStartNewChat} ></i>
        </div>

        {/* Initial view with app icon*/}
        {messages.length === 0 ? (
          <>
          {selectedAgent && (
          <div className="flex flex-col items-center justify-center flex-1">
            <img 
              src={selectedAgent.icon} 
              alt={selectedAgent.alias} 
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite looping
                e.target.src = defaultAgentIcon; // Replace with your default image URL
              }}
              className="w-12 h-12 mb-2 rounded-full" />
            <h1 className="text-white md:mb-8 text-2xl text-medium p-3 md:px-16">{selectedAgent.intro}</h1>
          </div>
          )}
          </>
        ) : (
          <>
            {/* Chat Messages Area */}
            <div className="flex-1 p-3 overflow-y-auto md:mt-4">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                    <p className={`p-2 rounded-xl text-white 
                      ${msg.role === 'user' ? 'bg-custom-hover-gray3' : 'border border-suggestion-border'}`}
                    >
                      {msg.message}
                    </p>

                    {/* Icons Row */}
                    {msg.role !== 'user' && (
                      <div className="flex space-x-2 text-comment-text">
                        {msg.comments ? (
                          msg.comments.isThumbsUp === "1" ? (
                            // Show thumbs up icon if user liked the comment
                            <button className="p-2 rounded-full">
                              <i className="fas fa-thumbs-up"></i>
                              <span className="pl-1 text-xs">{msg.comments.comment}</span>
                            </button>
                          ) : (
                            <button className="p-2 rounded-full">
                              <i className="fas fa-thumbs-down"></i>
                              <span className="pl-1 text-xs">{msg.comments.comment}</span>
                            </button>
                          )
                        ) : (
                          <>
                          <button className="p-2 rounded-full" onClick={() => writeComment(msg.thread_id, msg.message_id, true)}>
                            <i className="far fa-thumbs-up"></i>
                          </button>
                          <button className="p-2 rounded-full" onClick={() => writeComment(msg.thread_id, msg.message_id, false)}>
                            <i className="far fa-thumbs-down"></i>
                          </button>
                          </>
                        )}
                        
                        {/* Copy Icon */}
                        <button className="p-1 rounded-full" onClick={() => copyToClipboard(msg.message)}>
                          <i className="far fa-copy"></i>
                        </button>
                        {showToast && <Toast message={toastMessage} onClose={handleCloseToast} />}
                      </div>
                    )}
                  </div>
                </div>

              ))}
            </div>
          </>
        )}

        <div className="flex-shrink-0 flex flex-col p-3 md:px-16">
          {/* Suggestions Grid - Only show if no messages exist */}
          {messages.length === 0 && (
            <div className="grid lg:grid-cols-2 gap-3">
              {suggestionsToDisplay.map((suggestion, index) => (
              <div
                key={suggestion}
                className="flex justify-between items-center p-3 border border-suggestion-border rounded-xl text-white text-left cursor-pointer hover:bg-custom-hover-gray4 transition-all duration-200 group"
                onClick={() => { handleStartChat(suggestion, true) }}
              >
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white">{suggestion}</p> 
                  <p className="text-sm font-medium text-suggestion-decription-text">{suggestionDescsToDisplay[index]}</p>
                </div>
                {/* Button only visible on hover */}
                <button className="ml-2 p-3 bg-main-background text-white rounded-md flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <i className="fas fa-arrow-up icon-sm text-token-text-primary"></i>
                </button>
              </div>
              ))}
            </div>
          )}


          <form onSubmit={handleSubmit} >
            {/* Show loader */}
            {isLoading && <ThreeDots height="32" width="32" color="grey" />} 

            {/* Input Field and Submit Button in one row */}
            <div className="flex items-center py-2 relative">
              <input
                type="text"
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                disabled={isLoading}
                className="flex-1 p-3 border rounded-lg bg-transparent border-suggestion-border text-white focus:outline-none placeholder-suggestion-decription-text pr-12" // Add padding right for the button
                placeholder="Ask me anything ..."
              />
              {/* Submit Button */}
              <button type="submit" disabled={isLoading || !message.trim()} className="absolute right-2 top-5 p-1 bg-button-background text-black rounded-lg flex items-center">
                <i className="fas fa-arrow-up icon-sm text-token-text-primary"></i>
              </button>
            </div>

            <div className="flex items-center justify-center py-2">
              <span className="text-sm font-normal text-white md:font-light md:text-xs">A.I. can make mistakes. Consider checking important information.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;