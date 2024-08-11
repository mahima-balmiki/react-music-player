import React, { useEffect, useRef, useState } from 'react';
import styles from './styles/Player.module.css';
import OptionsButton from '../assets/OptionsButton.svg';
import PreviousButton from '../assets/PreviousButton.svg';
import PlayButton from '../assets/PlayButton.svg';
import PauseButton from '../assets/PauseButton.svg';
import NextButton from '../assets/NextButton.svg';
import SoundOnButton from '../assets/SoundOnButton.svg';
import SoundOffButton from '../assets/SoundOffButton.svg';

const Player = ({ currentSong, isPlaying, onPlay, onPause, onNext, onPrevious }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => onNext();

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [onNext]);

    useEffect(() => {
        const audio = audioRef.current;
        if (currentSong) {
            if (audio.src !== currentSong.url) {
                audio.src = currentSong.url;
                audio.load();
            }
            if (isPlaying) {
                audio.play().catch(error => console.error('Error playing audio:', error));
            }
        }
    }, [currentSong, isPlaying]);


    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.play().catch(error => console.error('Error playing audio:', error));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    const rangeRef = useRef(null);

    useEffect(() => {
        const updateRangeColor = () => {
            if (rangeRef.current) {
                const value = (currentTime / (duration || 100)) * 100;
                rangeRef.current.style.setProperty('--range-progress', `${value}%`);
            }
        };
        updateRangeColor();
    }, [currentTime, duration]);

    const handleSeek = (e) => {
        const seekTime = parseFloat(e.target.value);
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
    };

    const toggleMute = () => {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    if (!currentSong) return null;

    return (
        <div className={styles.player}>
            <div className={styles.songInfo}>
                <h2>{currentSong.name}</h2>
                <p>{currentSong.artist}</p>
            </div>
            <img src={`https://cms.samespace.com/assets/${currentSong.cover}`} alt={currentSong.name} className={styles.coverArt} />
            <div className={styles.seekbarContainer}>
                {/* <span className={styles.time}>{formatTime(currentTime)}</span> */}
                <input
                    ref={rangeRef}
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className={styles.seekbar}
                />
                {/* <span className={styles.time}>{formatTime(duration)}</span> */}
            </div>
            <div className={styles.controls}>
                <button className={styles.controlButton}>
                    <img src={OptionsButton} alt="Options" />
                </button>
                <div className={styles.middleControl}>
                    <button onClick={onPrevious} className={styles.controlButton}>
                        <img src={PreviousButton} alt="Previous" />
                    </button>
                    {isPlaying ? (
                        <button onClick={onPause} className={`${styles.controlButton} ${styles.playPauseButton}`}>
                            <img src={PauseButton} alt="Pause" />
                        </button>
                    ) : (
                        <button onClick={onPlay} className={`${styles.controlButton} ${styles.playPauseButton}`}>
                            <img src={PlayButton} alt="Play" />
                        </button>
                    )}
                    <button onClick={onNext} className={styles.controlButton}>
                        <img src={NextButton} alt="Next" />
                    </button>
                </div>
                <button onClick={toggleMute} className={styles.controlButton}>
                    <img src={isMuted ? SoundOffButton : SoundOnButton} alt={isMuted ? "Unmute" : "Mute"} />
                </button>
            </div>

        </div>
    );
};

export default Player;