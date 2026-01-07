import styled from "styled-components";
import {useState} from "react";
import {addDoc, collection, updateDoc} from "firebase/firestore";
import {ref, uploadBytes, getDownloadURL} from "firebase/storage";
import {auth, db, storage} from "../firebase.ts";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
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

const SubmitBtn = styled.input`
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

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File|null>(null);

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

  const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user || isLoading || tweet === "" || tweet.length > 180) return;

    try {
      setIsLoading(true);

      // firestore의 collection에 document 생성
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid
      });

      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = getDownloadURL(result);

        await updateDoc(doc, {
          photo: url,
        })
      }

      setTweet("");
      setFile(null);
    } catch(e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <Form onSubmit={onSubmit}>
        <TextArea
            required
            rows={5}
            maxLength={180}
            onChange={onChange}
            value={tweet}
            placeholder="What is happening?"
        />
        <AttachFileButton htmlFor="file">{file ? "Photo added ✅" : "Add photo"}</AttachFileButton>
        <AttachFileInput
            onChange={onFileChange}
            type="file"
            id="file"
            accept="image/*" />
        <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tweet"} />
      </Form>
  );
}