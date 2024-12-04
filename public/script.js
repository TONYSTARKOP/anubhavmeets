const socket = io(); // Connect to the Socket.IO server

// HTML elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const endCallButton = document.getElementById('endCallButton');

let localStream;
let remoteStream;
let peer;

// Get user media (camera and microphone)
navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localStream = stream;
        localVideo.srcObject = stream;

        // Initialize PeerJS
        peer = new Peer();

        peer.on('open', (id) => {
            console.log(`My PeerJS ID: ${id}`);
            socket.emit('join-room', id);
        });

        // Listen for incoming calls
        peer.on('call', (call) => {
            call.answer(localStream); // Answer with the local stream
            call.on('stream', (userVideoStream) => {
                remoteStream = userVideoStream;
                remoteVideo.srcObject = remoteStream;
            });
        });
    })
    .catch((error) => {
        console.error('Error accessing media devices:', error);
    });

// Listen for other users joining
socket.on('user-connected', (userId) => {
    console.log(`User connected: ${userId}`);
    const call = peer.call(userId, localStream);

    call.on('stream', (userVideoStream) => {
        remoteStream = userVideoStream;
        remoteVideo.srcObject = remoteStream;
    });
});

// End call button
endCallButton.addEventListener('click', () => {
    if (peer) peer.disconnect();
    if (socket) socket.disconnect();
    localStream.getTracks().forEach((track) => track.stop());
    remoteVideo.srcObject = null;
    localVideo.srcObject = null;
    alert('Call ended');
});
