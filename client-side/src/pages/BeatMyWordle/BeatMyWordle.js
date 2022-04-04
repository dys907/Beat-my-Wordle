import React, { useEffect, useState } from "react";
import Homepage from "../Homepage/Homepage";
import GamePage from "../GamePage/GamePage";
import LoginPage from "../LoginPage/LoginPage";
import ProfilePage from "../ProfilePage/ProfilePage";
import LeaderboardPage from "../LeaderboardPage/LeaderboardPage";
import CustomModal from "../../components/CustomModal/CustomModal";
import UploadPage from "../UploadPage/UploadPage";
import {
    noWordTitle,
    noWordText,
    noGameTitle,
    noGameText,
} from './strings';
import { SC } from '../../configs/httpResponseCodes';

const BeatMyWordle = () => {
  //Homepage, Login, Game,
  const [pageFlow, setPageFlow] = useState("Homepage");
  const [word, setWord] = useState();
  const [gameOpponent, setGameOpponent] = useState();
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState("");
  const [ownWord, setOwnWord] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalText, setModalText] = useState("");

  const xhttp = new XMLHttpRequest();
  const userID = localStorage.getItem("username"); // testing
  const endPointRoot = "https://wordle.itsvicly.com/";
  const [isLoggedIn, setIsLoggedIn] = useState();

  //Will probably need some kind of token check for login status
  useEffect(() => {
    if (localStorage.getItem("username")) {
      setIsLoggedIn(true);
    }
  }, []);

  const homeHandler = () => {
    setPageFlow("Homepage");
  };

  const loginHandler = () => {
    setPageFlow("Login");
  };

  const playGameHandler = () => {
    checkWord().then((res0) => {
        let response0 = JSON.parse(res0);
        let s0 = response0.word;
        if (s0 === "") {
            setModalTitle(noWordTitle);
            setModalText(noWordText);
            setModalOpen(true);
        } else {
            checkGameStatus().then((res) => {
                let response = JSON.parse(res);
                if (response.length == 0) {
                  lookForGame().then((res2) => {
                    createLobby(res2).then(() => {
                      setPageFlow("Game");
                    }).catch((error1) => console.log(error1));
                  }).catch((err1) => console.log(err1));
                } else {
                  setGameOpponent(response[0].opponent);
                  setWord(response[0].word);
                  setPageFlow("Game");
                }
              }).catch((error) => console.log(error));
        }
    }).catch((err) => console.log(err))

  };

  const profileHandler = () => {
    checkScore().then((res) => {
      let response = JSON.parse(res);
      let s = response[0].score;
      setScore(s);
      checkWord().then((res2) => {
        let response2 = JSON.parse(res2);
        let s2 = response2.word;
        setOwnWord(s2);
        setPageFlow("Profile");
      }).catch((error) => console.log(error));
    }).catch((err) => console.log(err));
  };

  const leaderboardHandler = () => {
    getLeaderboard().then((res) => {
      setLeaderboard(res);
      setPageFlow("Leaderboard");
    }).catch((err) => console.log(err));
  };

  const uploadHandler = () => {
    setPageFlow("Upload");
  };

  const getLeaderboard = () => {
    return new Promise((res, rej) => {
      const resourceScore = "1/scores/all";
      xhttp.open("GET", endPointRoot + resourceScore, true);
      xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"))
      xhttp.onload = () => {
        if (xhttp.status === SC.OK) {
          res(xhttp.response);
        } else {
          rej(xhttp.statusText);
        }
      };
      xhttp.send();
    });
  };

  const checkScore = () => {
    return new Promise((res, rej) => {
      const resourceScore = "1/scores/?username=" + userID;
      xhttp.open("GET", endPointRoot + resourceScore, true);
      xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"))
      xhttp.onload = () => {
        if (xhttp.status === SC.OK) {
          res(xhttp.response);
        } else {
          rej(xhttp.statusText);
        }
      };
      xhttp.send();
    });
  };

  const checkWord = () => {
    return new Promise((res, rej) => {
      const resourceWord = "1/words/?username=" + userID;
      xhttp.open("GET", endPointRoot + resourceWord, true);
      xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"))
      xhttp.onload = () => {
        if (xhttp.status === SC.OK) {
          res(xhttp.response);
        } else {
          rej(xhttp.statusText);
        }
      };
      xhttp.send();
    });
  };

  const checkGameStatus = () => {
    return new Promise((res, rej) => {
      const resourceCheck = "1/users/gamestatus/?username=" + userID;
      xhttp.open("GET", endPointRoot + resourceCheck, true);
      xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"))
      xhttp.onload = () => {
        if (xhttp.status === SC.OK) {
          res(xhttp.response);
        } else {
          rej(xhttp.statusText);
        }
      };
      xhttp.send();
    });
  };

  const lookForGame = () => {
    return new Promise((res, rej) => {
      const resourceLook = "1/games/?username=" + userID;
      xhttp.open("GET", endPointRoot + resourceLook, true);
      xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"))
      xhttp.onload = () => {
        if (xhttp.status === SC.OK) {
          res(xhttp.response);
        } else if (xhttp.status === SC.FORBIDDEN) {
          rej(xhttp.statusText);
          setModalText(noGameText);
          setModalTitle(noGameTitle);
          setModalOpen(true);
        }
      };
      xhttp.send();
    });
  };

  const createLobby = (res) => {
    const response = JSON.parse(res);
    const opponent = response.username;
    setGameOpponent(opponent);
    setWord(response.word);
    return new Promise((res, rej) => {
      const resourceCreate = "1/games";
      xhttp.open("POST", endPointRoot + resourceCreate, true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.setRequestHeader("authorization", "bearer " + localStorage.getItem("jwt"))
      const jsonObj = {
        player: userID,
        opponent: opponent,
      };
      const params = JSON.stringify(jsonObj);
      xhttp.onload = () => {
        if (xhttp.status === SC.OK) {
          res(xhttp.response);
        } else {
          rej(xhttp.statusText);
        }
      };
      xhttp.send(params);
    });
  };

  const postLoginHandler = (user) => {
    setIsLoggedIn(true);
    localStorage.setItem("username", user);
    homeHandler();
  };

    const logoutHandler = async() => {
        const logoutRoute = '1/users/logout';
        const URL = endPointRoot + logoutRoute;
        const username = localStorage.getItem('username');
        const submitObject = {
            username: username
        }

        try {
            const response = await fetch(`${URL}/`, {
                method: 'POST',
                headers: new Headers({
                    "Content-Type": "application/json",
                    'Authorization': 'bearer '+ localStorage.getItem("jwt"), 
                }),
                body: JSON.stringify(submitObject),
            });

            setIsLoggedIn(false);
            localStorage.removeItem("username");
            localStorage.removeItem('jwt');
        } catch(e) {
            setIsLoggedIn(false);
            localStorage.removeItem("username");
            localStorage.removeItem('jwt');
            console.log('Error logging out: ' + e);
        }
        
    };

  return (
    <>
      {pageFlow === "Homepage" ? (
        <Homepage
          isLoggedIn={isLoggedIn}
          loginHandler={loginHandler}
          playBtnHandler={playGameHandler}
          profileHandler={profileHandler}
          uploadHandler={uploadHandler}
          leaderboardHandler={leaderboardHandler}
          logoutHandler={logoutHandler}
        />
      ) : pageFlow === "Login" ? (
        <LoginPage
          postLoginHandler={postLoginHandler}
          homeHandler={homeHandler}
        />
      ) : pageFlow === "Game" ? (
        <GamePage
          homeHandler={homeHandler}
          word={word}
          opponent={gameOpponent}
        />
      ) : pageFlow === "Profile" ? (
        <ProfilePage
          score={score}
          homeHandler={homeHandler}
          playBtnHandler={playGameHandler}
          ownWord={ownWord}
          uploadHandler={uploadHandler}
        />
      ) : pageFlow === "Leaderboard" ? (
        <LeaderboardPage
          homeHandler={homeHandler}
          playBtnHandler={playGameHandler}
          jsonList={leaderboard}
        />
      ) : pageFlow === "Upload" ? (
        <UploadPage
          homeHandler={homeHandler}
          playBtnHandler={playGameHandler}
          setOwnWord={setOwnWord}
          profileHandler={profileHandler}
        />
      ) : (
        <></>
      )}
      <CustomModal
        openModal={modalOpen}
        title={modalTitle}
        text={modalText}
        handleOpen={setModalOpen}
      />
    </>
  );
};

export default BeatMyWordle;
