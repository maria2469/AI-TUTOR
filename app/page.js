'use client';
import { Box, Stack, TextField, Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi, I am your personal tutor! I'm here to help you with your studies. 
      Whether you need assistance solving difficult questions, understanding concepts, 
      or taking quizzes related to your study level, I've got you covered. 
      Let's work together to achieve your academic goals!`
    }
  ]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const handleSendMessage = async () => {
    if (message.trim()) {
      setMessages([...messages, { role: 'user', content: message }, { role: 'assistant', content: "" }]);
      setMessage(""); // Clear the input field after sending the message

      try {
        const response = await fetch('/api/chat', { // Adjusted endpoint to match backend
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.message || "No response from the assistant";

        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: assistantMessage
            }
          ];
        });

        setError(null); // Clear error if successful
      } catch (error) {
        console.error("Error in handleSendMessage:", error);
        setError("An error occurred while sending your message. Please try again.");
        setMessages((prevMessages) => prevMessages.slice(0, -1)); // Optionally revert last message
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box 
      width={'100vw'} 
      height={'100vh'} 
      display={'flex'} 
      flexDirection={'column'} 
      justifyContent={'center'} 
      alignItems={'center'}
      sx={{
        backgroundImage: 'url(/images/image.jpg)', // Update the path to your image
        backgroundSize: 'cover', // Cover the entire page
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat' // Prevent repeating the image
      }}
    >
      <Stack direction={'column'} width={'600px'} height={'700px'} border={'3px solid black'} p={2} spacing={3}>
        <Stack direction={'column'} spacing={2} flexGrow={1} overflow={'auto'} maxHeight={'100%'}>
          {messages.map((msg, index) => (
            <Box key={index} display={'flex'} justifyContent={msg.role === 'assistant' ? "flex-start" : "flex-end"}>
              <Box bgcolor={msg.role === 'assistant' ? 'primary.main' : 'secondary.main'} p={3} borderRadius={16} color={'white'} lineHeight={1.5} maxWidth={'100%'}sx={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}>
                {msg.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        {error && (
          <Box p={2} bgcolor={'black'} color={'white'} borderRadius={16}>
            {error}
          </Box>
        )}
        <Stack direction={'row'} spacing={2}>
          <TextField 
            label="Message" 
            fullWidth 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
          />
          <Button 
            variant="contained" 
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
