import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from "./styles/MusicPlayer.module.css";
import SongList from './SongList';
import Player from './Player';
import SearchBar from './SearchBar';
import TabSelector from './TabSelector';
import SpotifyLogo from '../assets/SpotifyLogo.svg';
import ProfileImage from '../assets/ProfileImage.png';

const MusicPlayer = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('For You');

    useEffect(() => {
        fetchSongs();
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.code === 'Space' && event.target.tagName !== 'INPUT') {
                event.preventDefault();
                setIsPlaying(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    const fetchSongs = async () => {
        try {
            const response = await axios.get('https://cms.samespace.com/items/songs');
            setSongs(response.data.data);
            if (response.data.data.length > 0) {
                setCurrentSong(response.data.data[0]);
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const getFilteredSongs = useCallback(() => {
        return songs.filter(song =>
            (song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                song.artist.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (activeTab === 'For You' || (activeTab === 'Top Tracks' && song.top_track))
        );
    }, [songs, searchTerm, activeTab]);

    const handleNext = useCallback(() => {
        const filteredSongs = getFilteredSongs();
        const currentIndex = filteredSongs.findIndex(song => song.id === currentSong.id);
        const nextSong = filteredSongs[(currentIndex + 1) % filteredSongs.length];
        setCurrentSong(nextSong);
    }, [currentSong, getFilteredSongs]);

    const handlePrevious = useCallback(() => {
        const filteredSongs = getFilteredSongs();
        const currentIndex = filteredSongs.findIndex(song => song.id === currentSong.id);
        const previousSong = filteredSongs[(currentIndex - 1 + filteredSongs.length) % filteredSongs.length];
        setCurrentSong(previousSong);
    }, [currentSong, getFilteredSongs]);

    const handleSearch = (term) => setSearchTerm(term);
    const handleTabChange = (tab) => setActiveTab(tab);

    const filteredSongs = getFilteredSongs();

    return (
        <div className={styles.musicPlayer} style={{ background: `linear-gradient(to bottom, ${currentSong?.accent || '#000000'}, #000000)` }}>
            <div className={styles.leftPanel}>
                <img src={SpotifyLogo} alt="Spotify" />
                <img src={ProfileImage} alt="Profile" />
            </div>
            <div className={styles.centerPanel}>
                <SearchBar onSearch={handleSearch} />
                <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />
                <SongList
                    songs={filteredSongs}
                    currentSong={currentSong}
                    onSongSelect={setCurrentSong}
                />
            </div>
            <div className={styles.rightPanel}>
                <Player
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                />
            </div>
        </div>
    );
};

export default MusicPlayer;