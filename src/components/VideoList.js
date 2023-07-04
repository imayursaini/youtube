import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import InfiniteScroll from "react-infinite-scroll-component";
import Home from "./Home";
import Spinner from "./Spinner";

function VideoList({ query }) {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [list, setList] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const API_KEY = "AIzaSyDa2NSmiM4LZhGZSgYGfVyexvo3NHx6dPk";
  const AUTHORIZATION_HEADER = "AIzaSyDa2NSmiM4LZhGZSgYGfVyexvo3NHx6dPk";

  useEffect(() => {
    searchYouTube(query);
  }, [query]);

  const searchYouTube = async (q) => {
    setisLoading(true);
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
    setList(body.items);
    setNextPageToken(body.nextPageToken);
    setisLoading(false);
  };

  const fetchMoreData = async () => {
    setisLoading(true);
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
    setisLoading(false);
  };

  const handleClick = (e, videoUrl) => {
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
      <div style={{ height: "auto", backgroundColor: "grey" }}>
      <div  
        className='player-wrapper'
        style={{
          padding: "10px",
          marginLeft: "10px",
          position: "relative",
          width:'100%',
          height:'100%',
        }}
      >
        {selectedVideoUrl && (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${selectedVideoUrl}`}
            controls={true}
            plsying={true}
          />
        )}
      </div>
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
            }}
          >
            {list &&
              list.map((item) => (
                <div>
                  <div
                    onClick={(e) => handleClick(e, item.id.videoId)}
                    style={{
                      margin: "10px",
                      overflow: "hidden",
                      width: "320px",
                      height: "320px",
                      boxShadow:
                        "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                      borderRadius: "12px",
                    }}
                  >
                    <img
                      style={{
                        borderRadius: "12px",
                        alignItems: "center",
                      }}
                      src={item.snippet.thumbnails.medium.url}
                      alt="thumbnail"
                    />
                    <div
                      style={{
                        padding: "5px",
                        color: "white",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "18px",
                          marginBottom: "5px",
                          fontWeight: "bold",
                          display: "-webkit-box",
                          webkitBoxOrient: "vertical",
                          webkitLineClamp: "3",
                          overflow: "hidden",
                        }}
                      >
                        {item.snippet.title}
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        {item.snippet.channelTitle}
                      </div>
                    </div>
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
