import PostTweetForm from "../components/post-tweet-form.tsx";
import styled from "styled-components";
import Timeline from "../components/timeline.tsx";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;

  // 스크롤바 숨기기
  &::-webkit-scrollbar {
    display: none;
  }
`;


export default function Home() {

  return (
      <Wrapper>
        <PostTweetForm />
        <Timeline />
      </Wrapper>
  );
}