import {
  useState,
  useEffect,
  FC,
  ChangeEvent
} from 'react';
import useMusicSearch from './hooks/useMusicSearch';

const SongsList: FC = () => {
  const initialAlbums = ['A', 'B', 'C', 'D', 'E'];
  const renderedItemsTotalCount = 5;
  const rotateInterval = 1000;

  const [albumsList, setAlbumsList] = useState<string[]>(initialAlbums);
  const [inputValue, setInputValue] = useState<string>('');
  const [timer, setTimer] = useState<number | null>(null);

  const { data, isLoading, error } = useMusicSearch(inputValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlbumsList(prevAlbums => {
        const currentAlbums = [...prevAlbums];
        currentAlbums.shift();
        if (currentAlbums.length <= renderedItemsTotalCount) {
          const defaultAlbums = initialAlbums.filter(album => (
            !currentAlbums.slice(0, renderedItemsTotalCount).includes(album)
          ));
          const defaultAlbum = defaultAlbums.shift();
          if (defaultAlbum) {
            currentAlbums.push(defaultAlbum);
          }
        }

        return currentAlbums;
      });
    }, rotateInterval);

    return () => {
      clearInterval(interval);
    };
  }, [inputValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (timer) {
      clearTimeout(timer);
    }
    setTimer(
      window.setTimeout(() => {
        setInputValue(e.target.value);
      }, rotateInterval)
    );
  };

  useEffect(() => {
    if (data) {
      const filteredAlbums = Array.from(new Set(data.results.map(res => res.collectionName)))
        .sort((a, b) => a.localeCompare(b))
        .slice(0, renderedItemsTotalCount)

      setAlbumsList(albumsList.slice(0, renderedItemsTotalCount).concat(filteredAlbums));
    }
  }, [data]);

  return (
    <div className="albums-container">
      <h1>Find albums</h1>
      <div className="input-wrap">
        <input
          type="text"
          onChange={handleInputChange}
          placeholder="Enter singer"
        />
        {isLoading && <span>Loading...</span>}
      </div>
      {error && <span>{error.message}</span>}
      <div className="albums-wrap">
        {albumsList.slice(0, renderedItemsTotalCount).map((album, index) => (
          <div
            className="album"
            key={album + index}
          >
            { album }
          </div>
        ))}
      </div>
    </div>
  );
}

export default SongsList;
