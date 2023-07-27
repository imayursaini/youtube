import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
import Home from "./Home";
import Spinner from "./Spinner";

function VideoList({ query , progress}) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [list, setList] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  

  const API_KEY = "AIzaSyCvgf8XAamuyxLC59Ef4Dy7uuCZBN9I6OM";
  const AUTHORIZATION_HEADER = "AIzaSyCvgf8XAamuyxLC59Ef4Dy7uuCZBN9I6OM";

  useEffect(() => {
    setSelectedVideoUrl(null);
    searchYouTube(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const searchYouTube = async (q) => {
    progress(10);
    setIsLoading(true);
    setList([]);
    const encodedQuery = encodeURIComponent(q);
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&type=video&key=${API_KEY}&q=${encodedQuery}`,
      {
        method: "GET",
        headers: {
          Authorization: AUTHORIZATION_HEADER,
          Accept: "application/json",
        },
      }
    );
    const body = await response.json();
    progress(40);
    setList(body.items);
    progress(80);
    setNextPageToken(body.nextPageToken);
    setIsLoading(false);
    progress(100);
  };

  const fetchMoreData = async () => {
    setIsLoading(true);
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&pageToken=${nextPageToken}&type=video&key=${API_KEY}&q=${encodedQuery}`,
      {
        method: "GET",
        headers: {
          Authorization: AUTHORIZATION_HEADER,
          Accept: "application/json",
        },
      }
    );
    const body = await response.json();
    setList((prevList) => prevList.concat(body.items));
    setNextPageToken(body.nextPageToken);
    setIsLoading(false);
  };

  const handleClick = (e, videoUrl, index) => {
    e.preventDefault();
    setSelectedVideoUrl(videoUrl);
    window.scrollTo(0, 0);
    console.log("The link was clicked.");
  };

  if (!query) {
    return (
      <div>
        <Home />
      </div>
    );
  }

  return (
    <>
      <div style={{ backgroundColor: "black", minHeight: "100vh" }}>
        {selectedVideoUrl && (
          <div className="player-wrapper">
            <ReactPlayer
              className="react-player"
              url={`http://www.youtube.com/watch?v=${selectedVideoUrl}`}
              controls={true}
              playing={true}
              width="100%"
              height="100%"
            />
          </div>
        )}
        <InfiniteScroll
          dataLength={list.length}
          next={fetchMoreData}
          hasMore={nextPageToken !== null}
          loader={
            isLoading ? (
              <div>
                {" "}
                Loading ... <Spinner />
              </div>
            ) : null
          }
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {list &&
              list.map((item, index) => (
                <div
                  onClick={(e) => handleClick(e, item.id.videoId, index)}
                  className="video-item"
                >
                  <div className="thumbnail-wrapper">
                    <img
                      className="thumbnail"
                      src={item.snippet.thumbnails.medium.url}
                      alt="thumbnail"
                    />
                  </div>
                  <div className="info-wrapper">
                    <div className="title">{item.snippet.title}</div>
                    <div className="channel">{item.snippet.channelTitle}</div>
                  </div>
                </div>
              ))}
          </div>
        </InfiniteScroll>
      </div>
    </>
  );
}

export default VideoList;
