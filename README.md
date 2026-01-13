# 트위터 클론코딩
Nomad Coders의 [Nwitter 강의]를 기반으로 진행한 트위터 클론 프로젝트입니다.  
React + TypeScript 환경에서 Firebase를 활용해 인증, 게시글 및 이미지 업로드, 프로필 기능을 구현했습니다.

## 🔗 배포 링크
- https://nwitter-reloaded-de1c0.web.app/

## 🛠 사용 스택
- Frontend: React, TypeScript, Vite
- Backend / DB: firebase
  - Authentication (Email, Github)
  - firestore (Tweet CRUD)
  - Storage (이미지)

## ⚙ 주요 기능
- 이메일, 비밀번호 / 깃허브 회원가입 및 로그인
- 트윗 작성 / 수정 / 삭제 (작성자만 가능)
- 이미지 업로드 및 수정
- 실시간 타임라인 (Firestore onSnapshot)
- 프로필 수정 (이미지, 닉네임)

## 📝 강의 정리
- https://octagonal-drawbridge-f49.notion.site/React-2e0f4c3b8a098046ae83d6a84bae6281?source=copy_link

[Nwitter 강의]: https://nomadcoders.co/nwitter
