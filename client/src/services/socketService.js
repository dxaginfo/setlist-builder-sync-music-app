import { io } from 'socket.io-client';

let socket;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

const initSocket = (token) => {
  if (!token) {
    console.error('Authentication token is required to initialize socket');
    return null;
  }

  if (socket) {
    socket.disconnect();
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('Socket connected');
  });

  socket.on('disconnect', (reason) => {
    console.log(`Socket disconnected: ${reason}`);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem('token');
    if (token) {
      return initSocket(token);
    }
    return null;
  }
  return socket;
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

const joinSetlistRoom = (setlistId) => {
  const socket = getSocket();
  if (socket) {
    socket.emit('join-setlist', setlistId);
  }
};

const leaveSetlistRoom = (setlistId) => {
  const socket = getSocket();
  if (socket) {
    socket.emit('leave-setlist', setlistId);
  }
};

const onSetlistUpdated = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('setlist-updated', callback);
  }
  return () => {
    if (socket) {
      socket.off('setlist-updated', callback);
    }
  };
};

const onSetlistItemUpdated = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('setlist-item-updated', callback);
  }
  return () => {
    if (socket) {
      socket.off('setlist-item-updated', callback);
    }
  };
};

const onSetlistItemReordered = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('setlist-reordered', callback);
  }
  return () => {
    if (socket) {
      socket.off('setlist-reordered', callback);
    }
  };
};

const onNewComment = (callback) => {
  const socket = getSocket();
  if (socket) {
    socket.on('new-comment', callback);
  }
  return () => {
    if (socket) {
      socket.off('new-comment', callback);
    }
  };
};

const socketService = {
  initSocket,
  getSocket,
  disconnectSocket,
  joinSetlistRoom,
  leaveSetlistRoom,
  onSetlistUpdated,
  onSetlistItemUpdated,
  onSetlistItemReordered,
  onNewComment,
};

export default socketService;
