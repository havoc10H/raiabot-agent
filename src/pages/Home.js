import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import qs from "qs";
import config from '../config.json';

const Home = () => {
  const appName = config.appName;
  const appIcon = config.appIcon;

  const siteUrl = config.siteUrl;

  const apiKey  = config.apiKey;
  const secretKey = config.secretKey;

  const loginKey = localStorage.getItem('raia-loginKey');
  const loginUsername = localStorage.getItem('raia-loginUsername');

  const handleGetAgents = useCallback(() => {
    const data = qs.stringify({
      'APIKEY': apiKey,
      'SECRETKEY': secretKey,
      'loginKey': loginKey,
    });
    
    const requestConfig = {
      method: 'post',
      url: siteUrl + "/api/getAgents.cfm",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };
    
    axios.request(requestConfig)
    .then((response) => {
      const fetchedEngines = response.data;

      if (fetchedEngines && fetchedEngines.length > 0) {
        setEngines(fetchedEngines); // Set the fetched engines
        setSelectedEngine(fetchedEngines[0]); // Set the first engine as the selected engine
      }
    })
    .catch((error) => {
      console.error(error.response ? error.response.data : error.message);
    });
  }, [apiKey, secretKey, loginKey, siteUrl]); // Dependencies

  useEffect(() => {
    handleGetAgents();
  }, [handleGetAgents]); 

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([
    { id: 1, title: 'Web Development' },
    { id: 2, title: 'Software Development Practices' },
    { id: 3, title: 'Mobile Development' },
    { id: 4, title: 'Project Management' },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [engines, setEngines] = useState([]);

  const [selectedEngine, setSelectedEngine] = useState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEngineChange = (engine) => {
    setSelectedEngine(engine);
    toggleDropdown();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const [historyDropdownOpen, setHistoryDropdownOpen] = useState(null); // State to manage dropdown visibility

  const toggleHistoryDropdown = (chatId) => {
    setHistoryDropdownOpen(historyDropdownOpen === chatId ? null : chatId);
  };

  const handleShare = (chatId) => {
    console.log(`Share chat with ID: ${chatId}`);
    // Implement share functionality
  };

  const handleRename = (chatId) => {
    console.log(`Rename chat with ID: ${chatId}`);
    // Implement rename functionality
  };

  const handleDelete = (chatId) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      setChats(chats.filter(chat => chat.id !== chatId));
    }
  };

  const suggestions = [
    { text: `Suggest some codenames`, description: `for a project introducing flexible work` },
    { text: `Explain options trading`, description: `if I'm familiar with buying and selling` },
    { text: `Create a personal webapge for me`, description: `after asking me three questions` },
    { text: `Suggest fun activities`, description: `for a family of 4 to do indoors` },
  ];
  
  const handleStartNewChat = () => {
    setMessage('');
    setMessages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleStartChat(message);
  };

  const handleSaveMessage = async (messageData, role, created_at, message_id) => {
    const data = qs.stringify({
      'APIKEY': apiKey,
      'SECRETKEY': secretKey,
      'loginKey': loginKey,
      'thread_id': 0,
      'assistant_id': 0,
      'message_id': message_id,
      'created_at': created_at,
      'run_id': 0,
      'message': messageData,
      'role': role,
    });
    
    const requestConfig = {
      method: 'post',
      url: siteUrl + "/api/saveMessage.cfm",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };
    
    axios.request(requestConfig)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error.response ? error.response.data : error.message);
    });
  }

  const handleStartChat = async (newMessage) => {
    if (!newMessage.trim()) return; // Check if the message is empty or only whitespace

    const newMessages = [...messages, { text: newMessage, sender: 'user' }];
    setMessages(newMessages);
    setMessage('');

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo', // Specify the model
          messages: [{ role: 'user', content: newMessage }],
        },
        {
          headers: {
            'Authorization': `Bearer ${selectedEngine.openai_api_key}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);
      const responeData = response.data;
      const replyMessage = responeData.choices[0].message.content;
      setMessages([...newMessages, { text: replyMessage, sender: 'assistant' }]);

      handleSaveMessage(newMessage, 'user', responeData.created, responeData.id);
      handleSaveMessage(replyMessage, 'assistant', responeData.created, responeData.id);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
   
  }

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div
        className={`fixed inset-y-0 z-50 w-64 bg-sidebar-background text-white p-3 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-1/4 flex flex-col`}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between md:hidden">
          <i 
            className="fas fa-times text-md cursor-pointer mb-2" 
            onClick={() => setIsSidebarOpen(false)} 
          ></i>
        </div>

        {/* App Icon, New Chat */}
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-custom-hover-gray cursor-pointer" onClick={handleStartNewChat}>
          <div className="flex items-center">
            <img
              src={appIcon}
              alt={appName}
              className="w-7 h-7 rounded-full mr-2"
            />
            <p className="text-sm font-medium text-white">{selectedEngine?selectedEngine.name:''}</p>
          </div>
          <i className="fas fa-pencil-alt text-md" style={{ width: '18px', height: '18px' }}></i>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto text-sm">
          <h1 className="p-3 pt-6 text-xs font-medium text-custom-text-gray">Conversations</h1>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="p-3 text-sm font-normal rounded-lg hover:bg-custom-hover-gray cursor-pointer flex justify-between items-center group"
            >
              <h2 className="truncate mr-2">{chat.title}</h2>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center relative gap-3">
                <i className="fas fa-ellipsis-h text-md hover:text-custom-hover-gray2" style={{ width: '18px', height: '18px' }} onClick={() => toggleHistoryDropdown(chat.id)}></i>
                <i className="fas fa-trash-alt text-md hover:text-custom-hover-gray2" style={{ width: '18px', height: '18px' }} onClick={() => handleDelete(chat.id)}></i>

                {/* Dropdown Menu */}
                {historyDropdownOpen === chat.id && (
                  <div className="absolute bg-threeoptions-background text-sm font-normal rounded-lg top-8 right-2 w-36">
                    <div
                      className="p-3 m-2 rounded-md hover:bg-threeoptions-hover cursor-pointer flex items-center gap-3"
                      onClick={() => handleShare(chat.id)}
                    >
                      <i className="fas fa-upload icon-md" style={{ width: '18px', height: '18px' }}></i>
                      <span>Share</span>
                    </div>
                    <div
                      className="p-3 m-2 rounded-md hover:bg-threeoptions-hover cursor-pointer flex items-center gap-3"
                      onClick={() => handleRename(chat.id)}
                    >
                      <i className="fas fa-pencil-alt icon-md" style={{ width: '18px', height: '18px' }}></i>
                      <span>Rename</span>
                    </div>
                    <div
                      className="p-3 m-2 rounded-md hover:bg-threeoptions-hover cursor-pointer flex items-center gap-3 text-delete-color"
                      onClick={() => handleDelete(chat.id)}
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

        {/* User Info at the bottom */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-3 py-[10px] pl-3 hover:bg-custom-hover-gray3 w-auto rounded-xl cursor-pointer">
            <div className="text-white border-2 rounded-full w-7 h-7 border-custom-bother-gray flex justify-center items-center">
              <i className="fas fa-star icon-sm shrink-0"></i>
            </div>
            <div>
              <h1 className="text-sm font-normal text-white">ask raia</h1>
              <p className="text-xs font-normal text-custom-text-gray">
                Do you need help?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-[10px] pl-2 hover:bg-custom-hover-gray3 w-auto rounded-xl cursor-pointer">
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
            {selectedEngine && (
            <div className="flex items-center p-3 rounded-lg hover:bg-custom-hover-gray4 cursor-pointer" onClick={toggleDropdown}>
              <span className="text-lg font-semibold">{selectedEngine.alias}</span>
              <span className="text-engine-version-text pl-2">
                {selectedEngine.version}
                <i className="fas fa-chevron-down text-token-text-tertiary pl-2 text-xs"></i>
              </span>
            </div>
            )}
            {isDropdownOpen && (
            <div className="absolute mt-14 2xl:w-[400px] md:w-[45vw] lg:w-[45vw] xl:w-[25vw] bg-threeoptions-background rounded-lg max-h-48 overflow-y-auto">
              
              {engines.map((engine) => (
              <div
                key={engine.name}
                className="p-3 m-2 rounded hover:bg-custom-hover-gray5 cursor-pointer flex justify-between items-center"
                onClick={() => handleEngineChange(engine)}
              >
                <div className="text-sm font-medium">
                  <p>{engine.name}</p>
                  <p className="text-engine-version-text">{engine.description}</p>
                </div>
                {selectedEngine.name === engine.name && <i className="fas fa-check-circle text-white flex-shrink-0"></i>}
              </div>
              ))}

            </div>
            )}
          </div>

          <i className="fas fa-edit cursor-pointer md:hidden" onClick={handleStartNewChat} ></i>
        </div>

        {/* Initial view with app icon*/}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <img
              src={appIcon}
              alt={appName}
              className="w-12 h-12 my-3 rounded-full"
            />
            <h1 className="text-white md:mb-8 text-2xl text-medium">How can I help you today?</h1>
          </div>
        ) : (
          <>
            {/* Chat Messages Area */}
            <div className="flex-1 p-3 overflow-y-auto md:mt-8">
              {messages.map((msg, index) => (
                <div key={index} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <p className={`inline-block p-3 rounded-xl 
                    ${msg.sender === 'user' ? 'bg-custom-hover-gray3 text-white' : 'text-white border border-suggestion-border mr-16'}`}>
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col p-3 md:px-16">
          {/* Suggestions Grid - Only show if no messages exist */}
          {messages.length === 0 && (
            <div className="grid lg:grid-cols-2 gap-3">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.text}
                  className="flex justify-between items-center p-3 border border-suggestion-border rounded-xl text-white text-left cursor-pointer hover:bg-custom-hover-gray4 transition-all duration-200 group"
                  onClick={() => { handleStartChat(suggestion.text) }}
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-white">{suggestion.text}</p> 
                    <p className="text-sm font-medium text-suggestion-decription-text">{suggestion.description}</p>
                  </div>
                  {/* Button only visible on hover */}
                  <button className="ml-2 p-3 bg-main-background text-white rounded-md flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <i className="fas fa-arrow-up icon-sm text-token-text-primary"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Field and Submit Button in one row */}
          <div className="flex items-center py-2 relative">
            <input
              type="text"
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              className="flex-1 p-3 border rounded-lg bg-transparent border-suggestion-border text-white focus:outline-none placeholder-suggestion-decription-text pr-12" // Add padding right for the button
              placeholder="Ask me anything ..."
            />
            
            {/* Submit Button */}
            <button type="submit" className="absolute right-2 top-5 p-1 bg-button-background text-black rounded-lg flex items-center">
              <i className="fas fa-arrow-up icon-sm text-token-text-primary"></i>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Home;