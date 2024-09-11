import React, { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import ChatSidebar from '../../../widgets/ChatSideBar';
import ChatWindow from '../../../widgets/ChatWindow';
import MessageInput from '../../../widgets/MessageInput';
import Navbar from '../../../components/Navbar';
import { useParams } from 'react-router-dom';

const ChatLayout = () => {
  const { url } = useParams();

  const [conversation, setConversation] = useState([]);

  const addMessageToConversation = (message) => {
    setConversation((prevConversation) => [...prevConversation, message]);
  };

  const updateLastMessage = (updatedMessage) => {
    setConversation((prevConversation) => {
      const newConversation = [...prevConversation];
      newConversation[newConversation.length - 1] = updatedMessage;
      return newConversation;
    });
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', height: '100vh', py: 8 }}>
        <CssBaseline />
        <ChatSidebar />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <ChatWindow conversation={conversation} />
          <MessageInput model_url={url} addMessage={addMessageToConversation} updateLastMessage={updateLastMessage} />
        </Box>
      </Box>
    </>
  );
};

export default ChatLayout;
