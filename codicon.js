let isStreaming = false;
let isMicActive = true;
let isCamActive = true;
let streamVideo;
let mediaRecord;
let frames = [];

const videoElement = document.getElementById('videoElement');
const streamButton = document.getElementById('streamButton');
const saveButton = document.getElementById('saveButton');
const micToggle = document.getElementById('micToggle');
const camToggle = document.getElementById('camToggle');



camToggle.addEventListener('click', function() {
    isCamActive = !isCamActive;
    if (streamVideo) {
        const tracks = streamVideo.getVideoTracks();
        tracks.forEach(track => {
            track.enabled = isCamActive;
            console.log(track);
        })
    }
    camToggle.textContent = isCamActive ? 'Desactivar Cam' : 'Activar Cam'
})

micToggle.addEventListener('click', function() {
    isMicActive = !isMicActive;
    if (streamVideo) {
        const tracks = streamVideo.getAudioTracks();
        tracks.forEach(track => {
            track.enabled = isMicActive;
        })
    }
    micToggle.textContent = isMicActive ? 'Desactivar Cam' : 'Activar Cam'
})


streamButton.addEventListener('click', () => {
    if (!isStreaming) {
        navigator.mediaDevices.getUserMedia({ video: isCamActive, audio: isMicActive })
            .then(function (media) {
                streamVideo = media;
                videoElement.srcObject = streamVideo;
                isStreaming = true;
                streamButton.textContent = 'Detener'

                startRec();
            })

            .catch(function (error) {
                console.error("No se obtuvo acceso a la camara", error)
            })
    } else {

        stopRec();
    }
})

function startRec() {
    mediaRecord = new MediaRecorder(streamVideo);
    mediaRecord.ondataavailable = function (e) {
        frames.push(e.data);
    }
    mediaRecord.start();
}

function stopRec() {
    if (mediaRecord && mediaRecord.state !== 'inactive') {
        mediaRecord.stop();
        mediaRecord.onstop = function () {
            const blob = new Blob(frames, {type: 'video/mp4'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'g.mp4'
            document.getElementById('functions').appendChild(a);
            a.click();
            setTimeout(function() {
                document.getElementById('functions').removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            frames = [];
        }
        
        isStreaming = false;
        streamButton.textContent = 'Iniciar';
    }

}


