import {useEffect, useState} from "react";
import styled from "styled-components";
import {collection, query, orderBy, limit, onSnapshot} from "firebase/firestore";
import {db} from "../firebase.ts";
import Tweet from "./tweet.tsx";
import type {Unsubscribe} from "firebase/firestore";

export interface ITweet {
  id:string;
  photo:string;
  tweet:string;
  userId:string;
  username:string;
  createdAt:number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async() => {
      const tweetsQuery = query(
          collection(db, "tweets"),
          orderBy("createdAt", "desc"), // 생성시간 기준으로 내림차순 정렬
          limit(25)
      );

      // 이벤트 리스너 연결 (변경 유형도 알 수 있음)
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map(doc => {
          const {tweet, createdAt, userId, username, photo} = doc.data();
          return {
            tweet,
            createdAt,
            userId,
            username,
            photo,
            id:doc.id,
          };
        });
        setTweet(tweets);
      });
    };

    fetchTweets();

    return () => {
      unsubscribe && unsubscribe();
    }
  }, []);

  return (
      <Wrapper>
        {tweets.map(tweet =>
            <Tweet key={tweet.id}
                   createdAt={tweet.createdAt}
                   username={tweet.username}
                   photo={tweet.photo}
                   tweet={tweet.tweet}
                   userId={tweet.userId}
                   id={tweet.id}
            />
        )}
      </Wrapper>
  );
}