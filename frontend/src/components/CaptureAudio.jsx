import React, {useRef, useState} from "react";
import trash from "./trash.svg";
import play from "./playButton.svg";
import pause from "./pauseButton.svg";
import voiceRecorder from "./voice-recorder.svg";
import sendButton from "./sendButton.svg";

function CaptureAudio({ hide }) {
    // const [{userInfo, currentChatUser, socket}, dispatch] = useStateProvider();
    
    const [isRecording, setIsRecording] = useState(false);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [waveform, setWaveform] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const waveFromRef = useRef(null);
    
    const formatTime = (time) => {}

    const handlePlayRecording = () => {}
    const handlePauseRecording = () => {}

    const handleStartRecording = () => {}
    const handleStopRecording = () => {}

    const sendRecording = async () => {}

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
                                <img src={play} alt="playbutton" onClick={handlePlayRecording}/>
                            ) : ( 
                                <img src={pause} alt="pausebutton" onClick={handlePauseRecording}/>   
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
                    className="text-red-500"
                    onClick={handleStartRecording}
                    />
                ) : (
                <img src={pause} 
                className="text-red-500" 
                onClick={handleStopRecording}
                />)}
            </div>
            <div>
                <img src={sendButton} alt="" 
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