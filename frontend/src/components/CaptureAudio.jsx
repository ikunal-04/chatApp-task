import React, {useEffect, useRef, useState, useContext} from "react";
import trash from "./trash.svg";
import axios from "axios";
import play from "./playButton.svg";
import pause from "./pauseButton.svg";
import voiceRecorder from "./voice-recorder.svg";
import io from "socket.io-client";
import sendButton from "./sendButton.svg";
import Wavesurfer from "wavesurfer.js";
import { AuthContext } from "../context/context";

// let socket;

function CaptureAudio({ hide }) {
    // const [{user, selectedChat}] = useContext(AuthContext);
    
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [waveform, setWaveform] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [renderedAudio, setRenderedAudio] = useState(null);

    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const waveFromRef = useRef(null);
    
    useEffect(() => {                                 
        let interval; 
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingDuration((prevduration) => {
                    setTotalDuration(prevduration + 1);
                    return prevduration + 1;
                });
            }, 1000);
        }
    },[isRecording])

    useEffect(() => {
        const wavesurfer = Wavesurfer.create({
            container: waveFromRef.current,
            waveColor: "#ccc",
            progressColor: "#4a9eff",
            cursorColor: "7ae3c3",
            barWidth: 2,
            barRadius: 3,
            responsive: true,
            height: 30,
        });
        setWaveform(wavesurfer);

        wavesurfer.on("finish", () => {
            setIsPlaying(false);
        });

        return () => {
            wavesurfer.destroy();
        }
    },[]);

    useEffect(() => {
        if(waveform) handleStartRecording();
    },[waveform]);

    const formatTime = (time) => {
        if(isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes.toString().padStart(2, "0")}:
            ${seconds.toString().padStart(2, "0")}`;
    }

    useEffect(() => {
        if(recordedAudio) {
            const updatePlaybackTime = () => {
                setCurrentPlaybackTime(recordedAudio.currentTime);
            };
            recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
            return () => {
                recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
            };
        }
    }, [recordedAudio]);

    const handlePlayRecording = () => {
        if (recordedAudio) {
            waveform.stop();
            waveform.play();
            recordedAudio.play();
            setIsPlaying(true);
        }
    }
    const handlePauseRecording = () => {
        waveform.stop();
        recordedAudio.pause();
        setIsPlaying(false);
    }

    const handleStartRecording = () => {
        setRecordingDuration(0);
        setCurrentPlaybackTime(0);
        setTotalDuration(0);
        setIsRecording(true);
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioRef.current.srcObject = stream;

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                chunks.push(e.data);
            };
            mediaRecorder.onstop = (e) => {
                const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
                const audioURL = URL.createObjectURL(blob);
                const audio = new Audio(audioURL);
                setRecordedAudio(audio);

                waveform.load(audioURL);
            };

            mediaRecorder.start();
        })
        .catch((error) => {
            console.log("Error accessing microphone: ", error);
        })
    }
    const handleStopRecording = () => {
        if(mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            waveform.stop();

            const audioChunks = [];
            mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
                audioChunks.push(event.data);
            });

            mediaRecorderRef.current.addEventListener("stop", () => {
                const audioBlob = new Blob(audioChunks, {type: "audio/mp3" });
                const audioFile = new File([audioBlob], "recording.mp3");
                setRenderedAudio(audioFile);
            });
        }
    }

    const sendRecording = async () => {
        // try {
        //     const formData = new FormData();
        //     formData.append("audio", renderedAudio);
        //     const response = await axios.post(`${process.env.REACT_APP_URL}/audio`, formData, {
        //         headers: {
        //             "Content-Type": "multipart/form-data",
        //             Authorization: `Bearer ${user.token}`,
        //         },
        //     });
        //     socket.emit("new-message", {
        //         senderId: user.id,
        //         receiverId: selectedChat.id,
        //         text: "",
        //         audio: response.data,
        //     });
        // } catch (error) {
        //     console.log(error);
        // }
    }

    return (
    <div className="flex text-2xl w-full justify-end items-center">
        <div className="pt-1">
        <img
            src={trash}
            height="20px"
            width="20px"
            className="text-panel-header-icon"
            onClick={() => hide()}
        />
        </div>
        <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
            {isRecording ? (
                <div className="text-red-500 animate-pulse 2-60 text-center">
                    Recording <span>{recordingDuration}s</span>
                </div>
            ) : (
                <div>
                    {
                        recordedAudio && (
                            <>
                            {!isPlaying ? ( 
                                <img src={play} alt="playbutton" height="20px" width="20px" onClick={handlePlayRecording}/>
                            ) : ( 
                                <img src={pause} alt="pausebutton" height="20px" width="20px" onClick={handlePauseRecording}/>   
                            )}
                            </>
                        )
                    }
                </div>
            )}
            <div className="w-60" ref={waveFromRef} hidden={isRecording}></div>
            {recordedAudio && isPlaying && (
                <span>{formatTime(currentPlaybackTime)}</span>
            )}
            {recordedAudio && !isPlaying && (
                <span>{formatTime(totalDuration)}</span>)
            }
            <audio ref={audioRef} hidden />
        
            <div className="mr-4">
                {!isRecording ? (
                    <img src={voiceRecorder} alt="voiceRecorder" 
                    height="20px"
                    width="20px"
                    onClick={handleStartRecording}
                    />
                ) : (
                <img src={pause} 
                className="text-red-500" 
                height="20px"
                width="20px"
                onClick={handleStopRecording}
                />)}
            </div>
            <div>
                <img src={sendButton} alt="" 
                height="20px"
                width="20px"
                className="text-panel-header-icon cursor-pointer mr-4"
                title="Send"
                onClick={sendRecording}
                />
            </div>
        </div>
    </div>
  );
}

export default CaptureAudio;