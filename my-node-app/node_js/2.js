// Import the events module
import EventEmitter from "events";

// const emitter = new EventEmitter();
//
// // Emit event with arguments
// emitter.on('userJoined', (username, userId) => {
//   console.log(`${username} (${userId}) has joined the chat`);
// });
//
// emitter.emit('userJoined', 'JohnDoe', 42);
// // Outputs: JohnDoe (42) has joined the chat


// 2. Handling Events Only Once
const emitter = new EventEmitter();

// This listener will be called only once
emitter.once('connection', () => {
  console.log('First connection established');
});

emitter.emit('connection'); // This will trigger the listener
emitter.emit('connection'); // This won't trigger the listener again