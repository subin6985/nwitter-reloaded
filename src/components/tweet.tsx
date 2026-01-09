import styled from "styled-components";
import type {ITweet} from "./timeline.tsx";
import {auth, db, storage} from "../firebase.ts";
import {deleteDoc, doc} from "firebase/firestore";
import {ref, deleteObject} from "firebase/storage";
import {useState} from "react";
import EditTweet from "./edit-tweet.tsx";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: dodgerblue;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin-left: 5px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({username, photo, tweet, userId, id}: ITweet) {
  const user = auth.currentUser;

  const [editMode, setEditMode] = useState(false);

  // 로그인 한 유저가 작성자와 같을 경우에만 삭제 가능
  const onDelete = async() => {
    const ok = confirm("Are you sure you want to delte this tweet?");

    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "tweets", id));

      // 이미지가 있는 경우 이미지도 삭제
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch(e) {
      console.log(e);
    }
  }

  const onEdit = () => {
    if (user?.uid !== auth.currentUser?.uid) return;

    setEditMode(true);
  }

  return (
      <Wrapper>
        <Column>
          <Username>{username}</Username>
          {editMode ? (
              <EditTweet
                originalTweet={tweet}
                photo={photo}
                id={id}
                setEditMode={setEditMode}
              />
              ) : (
                  <>
                    <Payload>{tweet}</Payload>
                    {user?.uid === userId && <DeleteButton onClick={onDelete}>Delete</DeleteButton>}
                    {user?.uid === userId && <EditButton onClick={onEdit}>Edit</EditButton>}
                  </>
          )}
        </Column>
        {(!editMode && photo) ? (
            <Column>
              <Photo src={photo} />
            </Column>
        ) : null}
      </Wrapper>
  );
}