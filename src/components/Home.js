import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

const HomePage = () => {
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(true);

  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  const fetchTrendingVideos = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/videos?" +
          new URLSearchParams({
            part: "snippet",
            chart: "mostPopular",
            regionCode: "IN",
            maxResults: 20,
            key: "AIzaSyCvgf8XAamuyxLC59Ef4Dy7uuCZBN9I6OM",
          })
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setTrendingVideos(data.items);
    } catch (error) {
      console.error("Error fetching trending videos:", error);
    }
  };

  const handleClick = (e, videoUrl) => {
    e.preventDefault();
    setSelectedVideoUrl(videoUrl);
    setShowSearchResults(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    console.log("The link was clicked.");
  };

  return (
    <div className="wrapper">
      <div className="typing-demo"></div>

      {showSearchResults && (
        <div className="search-results">
          <p>Top 20 Trending Video</p>
        </div>
      )}
      <div className="search-results">
      {selectedVideoUrl && (
        <div className="player-wrapper"
        >
          <ReactPlayer
            className="react-player"
            url={selectedVideoUrl}
            controls={true}
            playing={true}
            width="100%"
            height="100%"
          />
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {trendingVideos.map((video) => (
          <div
            className="video-item"
            onClick={(e) =>
              handleClick(e, `http://www.youtube.com/watch?v=${video.id}`)
            }
          >
            <div className="thumbnail-wrapper">
              <img
                className="thumbnail"
                src={video.snippet.thumbnails.medium.url}
                alt="thumbnail"
              />
            </div>
            <div className="info-wrapper">
              <div className="title">{video.snippet.title}</div>
              <div className="channel">{video.snippet.channelTitle}</div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default HomePage;
