import {useState} from "react";
import styled from "styled-components";
import {auth, db, storage} from "../firebase.ts";
import {doc, updateDoc} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 5px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  box-sizing: border-box;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  cursor: pointer;
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const CancelBtn = styled.button`
  background-color: tomato;
  color: white;
  border: none;
  text-align: center;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

const EditBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function EditTweet({originalTweet, photo, id, setEditMode}) {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File|null>(null);
  const [tweet, setTweet] = useState(originalTweet);

  const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  }
  const onFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { files } = e?.target;
    // 파일을 1개만 업로드 가능
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  }

  const onCancel = () => {
    setEditMode(false);
  }

  const onEdit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user || isLoading || tweet === "" || tweet.length > 180
        || (file != null && file!.size > 1 * 1024 * 1024)) return;
    // 파일 크기가 1MB를 넘지 않게 함

    try {
      setIsLoading(true);

      const tweetRef = doc(db, "tweets", id);

      // 내용 갱신
      await updateDoc(tweetRef, {
        tweet
      });

      if (file != null) {
        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, file); // 기존에 있으면 덮어쓰기 됨
        const url = await getDownloadURL(result.ref);

        // 사진 갱신
        await updateDoc(tweetRef, {
          photo: url,
        })
      }

      setEditMode(false);
    } catch(e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <Form onSubmit={onEdit}>
        <TextArea
            required
            rows={5}
            maxLength={180}
            onChange={onChange}
            value={tweet}
        />
        <AttachFileButton htmlFor="editedFile">{file ? "Photo added ✅" : (photo ? "Change photo 🔄" : "Add photo")}</AttachFileButton>
        <CancelBtn onClick={onCancel}>Cancel Edit</CancelBtn>
        <AttachFileInput
            onChange={onFileChange}
            type="file"
            id="editedFile"
            accept="image/*" />
        <EditBtn type="submit" value={isLoading ? "Editing..." : "Edit Tweet"} />
      </Form>
  );
}