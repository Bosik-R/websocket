const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

const socket = io();

let userName;

socket.on('message', ({author, content}) => addMessage(author, content));

const login = e => {
  e.preventDefault();
  if(userNameInput.value.length > 0) {
    userName = userNameInput.value;
    socket.emit('login', userName);
  } else {
    alert('Please enter user name');
  }
  socket.on('banned', response => {

    if(response === false) {
      loginForm.classList.remove('show');
      messagesSection.classList.add('show');
    } else {
      alert('You have ben Banned from this Chat!!!')
    }
  });
};

const sendMessage = (e) => {
  e.preventDefault();
  if(messageContentInput.value.length > 0) {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', {author: userName, content: messageContentInput.value} )
    messageContentInput.value = '';
  } else {
    alert('please type a message');
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');
  const messageAuthor = document.createElement('H3');
  const messageContent = document.createElement('DIV');

  message.classList.add('message', 'message--received');
  messageAuthor.classList.add('message__author');
  messageContent.classList.add('message__content');
  
  if(author === userName){
    message.classList.add('message--self')
    messageAuthor.innerHTML = 'You';
  } else {
    messageAuthor.innerHTML = author;
  }
  
  messageContent.innerHTML = content;

  message.appendChild(messageAuthor);
  message.appendChild(messageContent);

  messagesList.appendChild(message);
}

loginForm.addEventListener('submit', e => {
  login(e);
});

addMessageForm.addEventListener('submit', e => {
  sendMessage(e);
});
