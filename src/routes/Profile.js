import React, { useEffect } from "react";
import { authService, dbService } from "../fbase";
import { useHistory } from "react-router-dom";

const Profile = ({ userObj }) => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyNweets = async () => {
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();
    console.log(nweets.docs.map((doc) => doc.data()));
  };
  useEffect(() => {
    getMyNweets();
  }, []);
  const onSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="display Name" />
        <input type="submit" value="update Profiel" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
