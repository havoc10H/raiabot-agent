import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const appIcon = 'https://raiabot.com/assets/images/favicon.ico';

  const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([
    { id: 1, title: 'Web Development' },
    { id: 2, title: 'Software Development Practices' },
    { id: 3, title: 'Mobile Development' },
    { id: 4, title: 'Project Management' },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const engines = [
    { id: 'ChatGPT', name: 'Sales Assistant', version: '3.5', description: 'Converting and Qualifying Leads' },
    { id: 'ChatGPT', name: 'GPT-4', version: '4.0', description: 'Our smartest and most capable model, Includes DALL·E, browsing and more.' },
  ];

  const [selectedEngine, setSelectedEngine] = useState(engines[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEngineChange = (engineId) => {
    setSelectedEngine(engineId);
    setIsDropdownOpen(false);
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


  const username = "John Smith";

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
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const replyMessage = response.data.choices[0].message.content;
      setMessages([...newMessages, { text: replyMessage, sender: 'bot' }]);
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
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-custom-hover-gray cursor-pointer" onClick={handleStartNewChat}>
          <div className="flex items-center">
            <img
              src={appIcon}
              alt="App Icon"
              className="w-7 h-7 rounded-full mr-2"
            />
            <p className="text-sm font-medium text-white">AI Agent Name</p>
          </div>
          <i className="fas fa-pencil-alt text-md" style={{ width: '18px', height: '18px' }}></i>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto text-sm">
          <h1 className="p-2 pt-6 text-xs font-medium text-custom-text-gray">Conversations</h1>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="p-2 text-sm font-normal rounded-lg hover:bg-custom-hover-gray cursor-pointer flex justify-between items-center group"
            >
              <h2 className="truncate mr-2">{chat.title}</h2>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center relative gap-2">
                <i className="fas fa-ellipsis-h text-md hover:text-custom-hover-gray2" style={{ width: '18px', height: '18px' }} onClick={() => toggleHistoryDropdown(chat.id)}></i>
                <i className="fas fa-trash-alt text-md hover:text-custom-hover-gray2" style={{ width: '18px', height: '18px' }} onClick={() => handleDelete(chat.id)}></i>

                {/* Dropdown Menu */}
                {historyDropdownOpen === chat.id && (
                  <div className="absolute bg-threeoptions-background text-sm font-normal rounded-lg top-8 right-2 w-36">
                    <div
                      className="p-2 m-2 rounded-md hover:bg-threeoptions-hover cursor-pointer flex items-center gap-2"
                      onClick={() => handleShare(chat.id)}
                    >
                      <i className="fas fa-upload icon-md" style={{ width: '18px', height: '18px' }}></i>
                      <span>Share</span>
                    </div>
                    <div
                      className="p-2 m-2 rounded-md hover:bg-threeoptions-hover cursor-pointer flex items-center gap-2"
                      onClick={() => handleRename(chat.id)}
                    >
                      <i className="fas fa-pencil-alt icon-md" style={{ width: '18px', height: '18px' }}></i>
                      <span>Rename</span>
                    </div>
                    <div
                      className="p-2 m-2 rounded-md hover:bg-threeoptions-hover cursor-pointer flex items-center gap-2 text-custom-red"
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
          <div id="upgrade-plan" className="flex items-center gap-2 Upgrade-plan py-[10px] pl-2 hover:bg-[#2F2F2F] w-auto rounded-xl cursor-pointer">
            <div className="text-white border-2 rounded-full w-7 h-7 border-[#292929] flex justify-center items-center">
              <i className="fas fa-star icon-sm shrink-0"></i>
            </div>
            <div>
              <h1 className="text-sm font-normal text-white">ask raia</h1>
              <p className="text-xs font-normal text-[#676767]">
                Do you need help?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 Upgrade-plan py-[10px] pl-2 hover:bg-custom-hover-gray3 w-auto rounded-xl cursor-pointer">
            <div className="flex items-center justify-center w-8 text-white">
              <img 
                className="rounded-full" 
                src="https://lh3.googleusercontent.com/a/ACg8ocKu7kRG0wBgGFLTuqOultb-EdeAZAyAsRPfwLOuiA5i=s96-c" 
                alt="Profile"
              />
            </div>
            <div>
              <h1 className="text-sm font-normal text-white">{username}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col bg-main-background md:px-16">
        {/* Top Header for Mobile */}
        <div className="flex items-center justify-between border-b-2 border-gray-600 p-3 text-white md:hidden">
          <i class="fas fa-bars cursor-pointer" onClick={() => setIsSidebarOpen(true)} ></i>
          <i class="fas fa-edit cursor-pointer" onClick={handleStartNewChat} ></i>
        </div>

        {/* Select ChatGPT Engine */}
        <div className="absolute md:top-2 left-48 md:left-4 z-10 w-1/3 text-white cursor-pointer" onClick={toggleDropdown}>
          <div className="flex items-center w-36 p-2 rounded-lg hover:bg-custom-hover-gray4">
            <span className="text-lg font-semibold">{selectedEngine.id}</span>
            <span className="text-engine-version-text pl-2">
              {selectedEngine.version}
              <i class="fas fa-chevron-down text-token-text-tertiary pl-2 text-xs"></i>
            </span>
          </div>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-1 2xl:w-[400px] md:w-[45vw] lg:w-[45vw] xl:w-[24.890190336749633vw] bg-threeoptions-background rounded-lg">
              {engines.map((engine) => (
                <div
                  key={engine.name}
                  className="p-2 m-2 rounded hover:bg-custom-hover-gray5 cursor-pointer flex justify-between items-center"
                  onClick={() => handleEngineChange(engine)}
                >
                  <div class="text-sm font-medium">
                    <p>{engine.name}</p>
                    <p className="text-engine-version-text">{engine.description}</p>
                  </div>
                  {selectedEngine.name === engine.name && <i className="fas fa-check-circle text-white flex-shrink-0"></i> }
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Initial view with app icon*/}
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <img
              src={appIcon}
              className="w-12 h-12 mb-3 rounded-full"
            />
            <h1 className="text-white mb-16 text-2xl text-medium">How can I help you today?</h1>
          </div>
        ) : (
          <>
            {/* Chat Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto md:mt-8">
              {messages.map((msg, index) => (
                <div key={index} className={`my-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <p className={`inline-block p-2 mb-4 rounded-xl 
                    ${msg.sender === 'user' ? 'bg-custom-hover-gray3 text-white' : 'text-white border border-suggestion-border mr-16'}`}>
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Input Area (always visible) */}
        <form onSubmit={handleSubmit} className="flex flex-col p-2 md:px-16">
          {/* Suggestions Grid - Only show if no messages exist */}
          {messages.length === 0 && (
            <div className="grid md:grid-cols-2 gap-4 mb-4">
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
                  <button className="ml-2 p-2 bg-main-background text-white rounded-md flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <i class="fas fa-arrow-up icon-sm text-token-text-primary"></i>
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
            <button 
              type="submit" 
              className="absolute right-3 top-4 p-2 bg-button-background text-black rounded-lg flex items-center"
            >
              <i className="fas fa-arrow-up icon-sm text-token-text-primary"></i>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Home;