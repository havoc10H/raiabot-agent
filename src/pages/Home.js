import React, { useState } from 'react';
import { FaPencilAlt, FaArrowUp, FaBars, FaTimes, FaStar, FaChevronDown, FaCheckCircle, FaEllipsisH, FaTrashAlt, FaUpload } from 'react-icons/fa';
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
    alert(chatId);
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


  const username = "shree jaybhay";

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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-custom-black text-white p-4 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-1/4`}
      >
        {/* Close button for mobile */}
        <div className="flex items-center justify-between md:hidden">
          <FaTimes className="text-2xl cursor-pointer" onClick={() => setIsSidebarOpen(false)} />
        </div>

        {/* App Icon, New Chat */}
        <div className="flex items-center justify-between my-2">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-full">
              <img
                src={appIcon}
                alt="App Icon"
                className="w-7 h-7 mb-4 rounded-full"
              />
            </div>
            <p className="font-semibold">New Chat</p>
          </div>
          <FaPencilAlt className="text-xl cursor-pointer" onClick={handleStartNewChat} />
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto space-y-2 text-sm min-h-[calc(100vh-300px)] max-h-[calc(100vh-200px)]">
          <span className="p-2 text-xs text-custom-gray">Today</span>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="p-2 rounded-lg hover:bg-custom-black2 cursor-pointer flex justify-between items-center group"
            >
              <p>{chat.title}</p>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center relative">
                <FaEllipsisH className="text-white flex-shrink-0 ml-2" onClick={() => toggleHistoryDropdown(chat.id)} />
                <FaTrashAlt className="text-white flex-shrink-0 ml-2" onClick={() => handleDelete(chat.id)}/>

                {/* Dropdown Menu */}
                {historyDropdownOpen === chat.id && (
                  <div className="absolute top-8 right-2 w-36 bg-custom-black5 rounded-lg">
                    <div
                      className="p-2 m-2 rounded-lg hover:bg-custom-black3 cursor-pointer flex items-center"
                      onClick={() => handleShare(chat.id)}
                    >
                      <FaUpload className="text-white mr-4" />
                      <p>Share</p>
                    </div>
                    <div
                      className="p-2 m-2 rounded-lg hover:bg-custom-black3 cursor-pointer flex items-center"
                      onClick={() => handleRename(chat.id)}
                    >
                      <FaPencilAlt className="text-white mr-4" />
                      <p>Rename</p>
                    </div>
                    <div
                      className="p-2 m-2 rounded-lg hover:bg-custom-black3 cursor-pointer flex items-center"
                      onClick={() => handleDelete(chat.id)}
                    >
                      <FaTrashAlt className="text-white mr-4" />
                      <p>Delete</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* User Info at the bottom, fixed position */}
        <div className="fixed bottom-0 left-0 p-4">
          <div className="flex-1 space-y-2 text-sm cursor-pointer">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex items-center justify-center h-7 w-7 rounded-full border-2 border-custom-black2">
                <FaStar className="text-lg text-white" />
              </div>
              <div>
                <p className="font-semibold">Upgrade plan</p>
                <p className="text-sm text-custom-gray">Get GPT-4, DALL·E, and more</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative flex items-center justify-center h-7 w-7 rounded-full bg-custom-red text-md">{username.charAt(0).toUpperCase()}</div>
              <div>
                <p className="font-semibold">{username}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative flex-1 flex flex-col bg-custom-black2 md:px-16">
        {/* Top Header for Mobile */}
        <div className="flex items-center justify-between p-4 bg-custom-black text-white md:hidden">
          <FaBars className="text-2xl cursor-pointer" onClick={() => setIsSidebarOpen(true)} />
          <FaPencilAlt className="text-xl cursor-pointer" onClick={handleStartNewChat} />
        </div>

        {/* Select ChatGPT Engine */}
        <div className="absolute top-2 left-40 md:left-4 z-10 w-1/3 text-white p-2 cursor-pointer" onClick={toggleDropdown}>
          <div className="flex items-center mb-4 ">
            <span>{selectedEngine.id}</span>
            <span className="text-custom-gray pl-2">{selectedEngine.version}</span>
            <FaChevronDown className="ml-2" />
          </div>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-1 w-full bg-custom-black5 rounded">
              {engines.map((engine) => (
                <div
                  key={engine.name}
                  className="p-2 m-2 rounded hover:bg-custom-black3 cursor-pointer flex justify-between items-center"
                  onClick={() => handleEngineChange(engine)}
                >
                  <div>
                    <p>{engine.name}</p>
                    <p className="text-sm text-custom-gray">{engine.description}</p>
                  </div>
                  {selectedEngine.name === engine.name && <FaCheckCircle className="text-white flex-shrink-0" />}
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
              className="w-12 h-12 mb-4 rounded-full"
            />
            <h1 className="text-white md:mb-36 mb-16 text-2xl text-bold">How can I help you today?</h1>
          </div>
        ) : (
          <>
            {/* Chat Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto md:mt-8">
              {messages.map((msg, index) => (
                <div key={index} className={`my-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <p className={`inline-block p-2 mb-4 rounded-xl 
                    ${msg.sender === 'user' ? 'bg-custom-gray text-white' : 'text-white border border-custom-gray mr-16'}`}>
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Input Area (always visible) */}
        <form onSubmit={handleSubmit} className="flex flex-col p-2 bg-custom-black2">
          {/* Suggestions Grid - Only show if no messages exist */}
          {messages.length === 0 && (
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.text}
                  className="flex justify-between items-center p-2 border border-custom-black3 rounded-xl text-white text-left cursor-pointer hover:bg-custom-black4 transition-all duration-200 group"
                  onClick={() => { handleStartChat(suggestion.text) }}
                >
                  <div className="flex flex-col">
                    <span className="block text-md font-semibold">{suggestion.text}</span> {/* Text in white */}
                    <span className="block text-sm text-custom-gray">{suggestion.description}</span> {/* Description in gray */}
                  </div>
                  {/* Button only visible on hover */}
                  <button className="ml-2 p-2 bg-custom-black2 text-white rounded-md flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <FaArrowUp className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Field and Submit Button in one row */}
          <div className="flex items-center py-2">
            <input
              type="text"
              value={message} // Use message state variable
              onChange={(e) => setMessage(e.target.value)} // Set message state
              className="flex-1 p-2 border rounded-lg bg-custom-black2 border-custom-black3 text-white focus:outline-none focus:border-custom-black3 placeholder-custom-gray"
              placeholder="Message ChatGPT ..."
            />
            
            {/* Submit Button */}
            <button type="submit" className="ml-2 p-2 bg-custom-black4 text-black rounded-lg flex items-center">
              <FaArrowUp className="text-xl" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;