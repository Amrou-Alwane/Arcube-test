import React,{ useState } from 'react';

const  App= () =>{
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://147.189.175.89:5005/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (response.ok) {
        setShortenedUrl(data.shortenedUrl);
        setUrl('');
      } else {
        setErrorMessage(data.error || "An error occurred while shortening the URL.");
      }
    } catch (error) {
      setErrorMessage("Error: Network error");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center p-6">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          URL Shortener
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter URL"
              className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-600"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-white border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition duration-300 w-full px-4 py-2 rounded-md"
          >
            Shorten URL
          </button>
        </form>

        {shortenedUrl && (
          <div className="mt-6">
            <p className="text-gray-800 text-center">Shortened URL:</p>
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 text-center mt-2 hover:underline"
            >
              {shortenedUrl}
            </a>
          </div>
        )}
         {errorMessage && (
          <div className="mt-6 text-red-500 text-center">
            <p>{errorMessage}</p>
          </div>
        )}
       
      </div>
    </div>
  );
}

export default App;
