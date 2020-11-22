import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "../fbase";
import Nweet from "../components/Nweet";
const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");
  useEffect(() => {
    dbService.collection("nweets").onSnapshot((snapShot) => {
      const nweetArray = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if (attachment != "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorID: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishdE) => {
      const {
        currentTarget: { result },
      } = finishdE;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttachment = () => {
    setAttachment("");
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="whatsonyourmind"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear Image</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorID === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
