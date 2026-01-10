import styled from "styled-components";
import {auth, db, storage} from "../firebase.ts";
import {useEffect, useState} from "react";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {updateProfile} from "firebase/auth";
import {collection, limit, orderBy, query, where, getDocs} from "firebase/firestore";
import type {ITweet} from "../components/timeline.tsx";
import Tweet from "../components/tweet.tsx";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg{
    width: 50px;
  }
`;

const AvatarImg = styled.img`
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NameEditBtn = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-left: 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`

const EditCancelBtn = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin: -10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const EditCompleteBtn = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const NameTextArea = styled.textarea`
  border: 2px solid white;
  padding: 5px;
  width: 50%;
  border-radius: 10px;
  font-size: 16px;
  color: white;
  background-color: black;
  resize: none;
  box-sizing: border-box;
  text-align: center;
`

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.displayName);

  const onAvatarChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target;

    if (!user) return;

    if (files && files.length == 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);

      setAvatar(avatarUrl);

      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  }

  const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setName(e.target.value);
  }

  const onNameChange = async () => {
    if (!user || name === null) return;

    await updateProfile(user, {
      displayName: name,
    });

    setEditMode(false);
  }

  const fetchTweets = async () => {
    // 콘솔에서 링크를 통해 색인 저장해줘야 함
    const tweetQuery = query(
        collection(db, "tweets"),
        where("userId", "==", user?.uid), // 조건 설정
        orderBy("createdAt", "desc"),
        limit(25)
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map(doc => {
      const {tweet, createdAt, userId, username, photo} = doc.data();
      return {
        tweet,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    })

    setTweets(tweets);
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
      <Wrapper>
        <AvatarUpload htmlFor="avatar">
          {avatar ? (
              <AvatarImg src={avatar}/>
          ) : (
              <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
              >
                <path
                    d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z"/>
              </svg>
          )}
          <AvatarImg/>
        </AvatarUpload>
        <AvatarInput
            onChange={onAvatarChange}
            id="avatar"
            type="file"
            accept="image/*"
        />
        {editMode ? (
            <>
              <NameTextArea
                  required
                  rows={1}
                  maxLength={10}
                  onChange={onChange}
                  value={name ?? ""}
              />
              <EditCancelBtn onClick={() => setEditMode(false)}>Edit Cancel</EditCancelBtn>
              <EditCompleteBtn onClick={onNameChange}>Edit Complete</EditCompleteBtn>
            </>
            )
          : (
              <>
                <Name>{user?.displayName ?? "Anonymous"}</Name>
                <NameEditBtn onClick={() => setEditMode(true)}>Edit</NameEditBtn>
              </>
          )
        }
        <Tweets>
          {tweets.map((tweet) => (
              <Tweet key={tweet.id} {...tweet} />
          ))}
        </Tweets>
      </Wrapper>
  );
}