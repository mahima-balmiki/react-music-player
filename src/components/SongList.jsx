import React from 'react';
import styles from './styles/SongList.module.css';

const SongList = ({ songs, currentSong, onSongSelect }) => {
    return (
        <div className={styles.songList}>
            {songs.map(song => (
                <div
                    key={song.id}
                    className={`${styles.songItem} ${currentSong?.id === song.id ? styles.active : ''}`}
                    onClick={() => onSongSelect(song)}
                >
                    <img src={`https://cms.samespace.com/assets/${song.cover}`} alt={song.name} className={styles.coverArt} />
                    <div className={styles.songInfo}>
                        <h3>{song.name}</h3>
                        <p>{song.artist}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SongList;