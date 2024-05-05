import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useRef } from 'react';
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import red from "@mui/material/colors/red";
import { IoMdSend } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import ChatItem from '../components/chat/ChatItem';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communicator';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

type Message = {
  role: 'user' | 'assistant',
  content:string
}

const chatMessages = [
  {
      role: "assistant",
      content: "Hello! How can I assist you today?"
  },
  {
      role: "user",
      content: "Hi! I'm interested in learning about socket programming."
  },
  {
      role: "assistant",
      content: "Socket programming is a way of connecting two nodes on a network to communicate with each other. Are you looking for resources to learn more about it?"
  },
  {
      role: "user",
      content: "Yes, exactly! Could you recommend some tutorials or documentation?"
  },
  {
      role: "assistant",
      content: "Sure! Here are some resources you might find helpful:\n1. Beej's Guide to Network Programming: http://beej.us/guide/bgnet/\n2. Socket Programming in C/C++: https://www.geeksforgeeks.org/socket-programming-cc/\n3. Python Socket Programming Documentation: https://docs.python.org/3/library/socket.html\n4. Java Socket Programming Tutorial: https://www.javatpoint.com/socket-programming\nI hope these help!"
  }
];


const Chat = () => {
  const navigate=useNavigate()
  const inputRef=useRef<HTMLInputElement | null>(null)
  const auth = useAuth();
  const [chatMessages,setChatMessages]=useState<Message[]>([])
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string
    if (inputRef && inputRef.current) {
      inputRef.current.value = " "
    }
    const newMessage:Message = { role: 'user', content };
    setChatMessages((prev) => [...prev, newMessage]);
    const chatData = await sendChatRequest(content)
    setChatMessages([...chatData.chats])
  }

  const handleDeleteChat = async () => {
    try {
    toast.loading("Deleting chats", {id:"deletechats"})
      await deleteUserChats();
      setChatMessages([])
      toast.success("Deleted chat successfully", {id:"deletechats"})
    }
    catch (err) {
      console.log(err)
      toast.error("Deleted chat failed", {id:"deletechats"})
    }
  }

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" })
      getUserChats().then((data) => {
        setChatMessages([...data.chats])
        toast.success("Successfully loaded chat messages", { id: "loadchats" })
      })
        .catch(err => {
          console.log(err);
          toast.error('loading failed', { id: "loadchats" })
        }) 
    }
  }, [auth])
  
  useEffect(() => {
    if (!auth?.user) {
      return navigate('/login')
    }
  },[auth])
  return (
    <Box
    sx={{
      display: "flex",
      flex: 1,
      width: "100%",
      height: "100%",
      mt: 3,
      gap: 3,
    }}
  >
    <Box
      sx={{
        display: { md: "flex", xs: "none", sm: "none" },
        flex: 0.2,
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "60vh",
          bgcolor: "rgb(17,29,39)",
          borderRadius: 5,
          flexDirection: "column",
          mx: 3,
        }}
      >
        <Avatar
          sx={{
            mx: "auto",
            my: 2,
            bgcolor: "white",
            color: "black",
            fontWeight: 700,
          }}
        >
          {/* {auth?.user?.name[0]}
          {auth?.user?.name.split(" ")[1][0]} */}
        </Avatar>
        <Typography sx={{ mx: "auto", fontFamily: "Poppins" }}>
          You are talking to a ChatBOT
        </Typography>
        <Typography sx={{ mx: "auto", fontFamily: "Poppins", my: 4, p: 3 }}>
          You can ask some questions related to Knowledge, Business, Advices,
          Education, etc. But avoid sharing personal information
        </Typography>
        <Button
         onClick={handleDeleteChat}
          sx={{
            width: "200px",
            my: "auto",
            color: "white",
            fontWeight: "700",
            borderRadius: 3,
            mx: "auto",
            bgcolor: red[300],
            ":hover": {
              bgcolor: red.A400,
            },
          }}
        >
          Clear Conversation
        </Button>
      </Box>
    </Box>
    <Box
      sx={{
        display: "flex",
        flex: { md: 0.8, xs: 1, sm: 1 },
        flexDirection: "column",
        px: 3,
      }}
    >
      <Typography
        sx={{
          fontSize: "40px",
          color: "white",
          mb: 2,
          mx: "auto",
          fontWeight: "600",
        }}
      >
        Model - GPT 3.5 Turbo
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: "60vh",
          borderRadius: 3,
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
          overflowX: "hidden",
          overflowY: "auto",
          scrollBehavior: "smooth",
        }}
      >
        {chatMessages.map((chat, index) => (
          //@ts-ignore
          <ChatItem content={chat.content} role={chat.role} key={index} />
        ))}
      </Box>
      <div
        style={{
          width: "100%",
          borderRadius: 8,
          backgroundColor: "rgb(17,27,39)",
          display: "flex",
          margin: "auto",
        }}
      >
        {" "}
        <input
          ref={inputRef}
          type="text"
          style={{
            width: "100%",
            backgroundColor: "transparent",
            padding: "30px",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: "20px",
          }}
        />
        <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
          <IoMdSend />
        </IconButton>
      </div>
    </Box>
  </Box>
  )
}

export default Chat
