SyncUp Relay
Live Link: https://syncuprelay.onrender.com/

Project Description
SyncUp Relay is a full-stack, real-time chat application inspired by modern communication platforms like Slack and Discord. The application allows users to create communities (servers), organize conversations into channels, and communicate through live messaging. The core of the app is its real-time functionality, powered by WebSockets, which ensures that all messages, reactions, and server updates appear instantly for all users without needing a page refresh.

Technologies Used
Backend
Python

Flask: A lightweight web framework for building the server and API.

SQLAlchemy & Alembic: For database modeling, object-relational mapping (ORM), and migrations.

PostgreSQL: The primary database for storing all application data.

Flask-SocketIO: For enabling real-time, bidirectional communication with WebSockets.

Gunicorn: A production-ready web server used for deployment.

Frontend
JavaScript

React: A component-based library for building the user interface.

Redux: For managing the application's global state.

Socket.IO Client: The client-side library for connecting to the WebSocket server.

Vite: A modern frontend build tool for fast development.

CSS: For custom styling and creating a responsive, dark-themed layout.

Features
Servers
Users can view a list of all publicly available servers.

Logged-in users can create new servers, becoming the server owner.

Server owners can update their server's name.

Server owners can delete their servers.

All server updates are broadcast to connected clients in real-time.

Channels
Users can view the channels within any server.

Server owners can create, update, and delete channels within their server.

Channel updates are also broadcast in real-time.

Messages
Users can view the message history in any channel.

Logged-in users can send new messages, which appear instantly for all users in the channel.

Users can edit and delete their own messages, with changes reflected in real-time.

Message timestamps and usernames are displayed.

Reactions
Users can view all emoji reactions on any message.

Logged-in users can add an emoji reaction to a message.

Users can remove a reaction they've previously added.

All reaction changes are updated in real-time.

User Experience
A welcome page guides new users to log in, sign up, or continue as a guest.

A clean, modern, dark-themed UI inspired by professional chat applications.

A seamless, single-page application experience built with React Router.
