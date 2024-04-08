import { useEffect, useState } from "react";
import "./styles.scss";
import profilePic from "./profile-pic.jpeg";
import arrow from "./arrow.png";
import XCircle from "./XCircle.png";
import 'dotenv/config'
require.resolve("crypto-browserify")

function App() {
  const [topSellingAuthors, setTopSellingAuthors] = useState([]);
  const [showAuthors, setShowAuthors] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  const handleInput = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const buildDatabase = async () => {
      await fetch("http://localhost:9000");
    };
    buildDatabase();
  }, []);

  const searchForTopSellingAuthors = async () => {
            // `http://localhost:9000/author?name=${searchText}`
    // http://localhost:9000/topAuthors
    try {
      const resp = await fetch(
        `https://krikey-challenge-server.vercel.app/${searchText}`
      );
      if (resp.status === 404) {
        setShowErrorMessage(true);
        setShowAuthors(false);
      } else {
        setShowErrorMessage(false);
        setShowAuthors(true);
        setShowSearch(false);
        setSearchText("");
        console.log(process.env)
        if (topSellingAuthors.length === 0) {
          const resp = await fetch("https://krikey-challenge-server.vercel.app/topAuthors");
          const json = await resp.json();
          setTopSellingAuthors(json);
        }
      }
    } catch (e) {}
  };

  const handleArrowClick = () =>{
    setShowSearch(true)
    setShowErrorMessage(false);
    setShowAuthors(false);
  }

  return (
    <div className="app">
      {showSearch && (
        <div className="search-container">
          <input onChange={handleInput} placeholder="enter author name"></input>
          <button
            className="search-button"
            onClick={searchForTopSellingAuthors}
          >
            Search
          </button>
        </div>
      )}
      {showErrorMessage && (
        <div className="error-message">Author not found.</div>
      )}
      {showAuthors && (
        <div className="authors-container">
          <button className="arrow-button" onClick={handleArrowClick}>
            <img src={arrow} className="arrow" />
          </button>
          {topSellingAuthors.map((authorData, i) => {
            return (
              <div className="author-box" key={`${i}-${authorData.name}`}>
                {" "}
                <img src={profilePic} className="profile-pic" />
                <div className="name-and-email">
                  <div className="name">{authorData.name}</div>
                  <div className="email">{authorData.email}</div>
                </div>
                <div className="x-circle-container">
                  <img src={XCircle} className="x-circle" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
