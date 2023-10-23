import { useState, useEffect } from 'react';

interface ITunesData {
  results: Array<{ collectionName: string }>;
}

const useMusicSearch = (inputValue: string) => {
  const [data, setData] = useState<ITunesData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`https://itunes.apple.com/search?term=${inputValue}`);
        if (!response.ok) {
          throw new Error('Error in network response');
        }

        const result: ITunesData = await response.json();
        setData(result);
    
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (inputValue) {
      fetchData();
    } else {
      setData(null);
    }
  }, [inputValue]);

  return { data, isLoading, error };
}

export default useMusicSearch;
