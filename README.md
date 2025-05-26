# 회원 관리 시스템

## 프로젝트 개요
회원 정보를 관리하는 웹 애플리케이션입니다. 회원의 기본 정보와 커스텀 필드를 관리할 수 있으며, 로컬 스토리지를 활용한 데이터 영속성을 제공합니다.

## 기술 스택
- React
- TypeScript
- Ant Design (UI 컴포넌트)
- Vitest (테스트)
- Zod (타입 검증)

## 주요 기능
1. 회원 관리
   - 회원 목록 조회
   - 회원 추가
   - 회원 정보 수정
   - 회원 삭제
   - 다중 회원 삭제

2. 데이터 영속성
   - 로컬 스토리지 기반 데이터 저장
   - 기본 데이터 제공 (defaultRecords)

## 프로젝트 구조
```
📦src
 ┣ 📂assets
 ┃ ┗ 📜react.svg
 ┣ 📂components
 ┃ ┣ 📂FieldManager
 ┃ ┃ ┣ 📜FieldForm.tsx
 ┃ ┃ ┗ 📜FieldList.tsx
 ┃ ┣ 📂TableView
 ┃ ┃ ┣ 📂MemberList
 ┃ ┃ ┃ ┣ 📂FilterDropdown
 ┃ ┃ ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┃ ┃ ┗ 📜styles.ts
 ┃ ┃ ┃ ┣ 📂MemberFormModal
 ┃ ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┃ ┗ 📜index.tsx
 ┃ ┃ ┣ 📂ViewHeader
 ┃ ┃ ┃ ┣ 📜index.tsx
 ┃ ┃ ┃ ┗ 📜styles.ts
 ┃ ┃ ┗ 📜index.tsx
 ┃ ┗ 📂common
 ┃ ┃ ┣ 📜ActionButton.tsx
 ┃ ┃ ┣ 📜Header.tsx
 ┃ ┃ ┣ 📜TableContainer.tsx
 ┃ ┃ ┗ 📜Title.tsx
 ┣ 📂config
 ┃ ┗ 📜index.ts
 ┣ 📂constants
 ┃ ┗ 📜fields.ts
 ┣ 📂contexts
 ┃ ┣ 📜FieldManager.tsx
 ┃ ┗ 📜MemberModalContext.tsx
 ┣ 📂hooks
 ┃ ┣ 📜useFieldManager.ts
 ┃ ┗ 📜useMemberModal.ts
 ┣ 📂services
 ┃ ┣ 📂__tests__
 ┃ ┃ ┗ 📜memberService.test.ts
 ┃ ┗ 📜memberService.ts
 ┣ 📂store
 ┃ ┗ 📜memberStore.ts
 ┣ 📂test
 ┃ ┣ 📜setup.ts
 ┃ ┗ 📜test-utils.tsx
 ┣ 📂types
 ┃ ┣ 📜field.ts
 ┃ ┗ 📜record.ts
 ┣ 📂utils
 ┃ ┣ 📂__tests__
 ┃ ┃ ┣ 📜field.test.ts
 ┃ ┃ ┗ 📜record.test.ts
 ┃ ┣ 📜field.ts
 ┃ ┗ 📜record.ts
 ┣ 📜App.tsx
 ┣ 📜main.tsx
 ┗ 📜vite-env.d.ts
 ```

## 데이터 모델
### 회원 정보 (Member Record)
```ts
{
  id: string;
  name: string;
  address: string;
  memo: string;
  joinDate: string;
  job: '개발자' | 'PO' | '디자이너';
  emailSubscription: boolean;
  [key: string]: any; // 커스텀 필드
}
```

## 서비스 구조
### MemberService
- 싱글톤 패턴으로 구현
- private members 배열로 데이터 관리
- localStorage를 통한 데이터 영속성 제공
- 비동기 메서드로 구현 (Promise 기반)

#### 주요 메서드
- `getMembers()`: 회원 목록 조회
- `addMember(memberData)`: 회원 추가
- `updateMember(id, memberData)`: 회원 정보 수정
- `deleteMember(id)`: 회원 삭제
- `deleteMultipleMembers(ids)`: 다중 회원 삭제

## 테스트
- Vitest를 사용한 단위 테스트
- TestableMemberService를 통한 private 멤버 테스트
- localStorage 모킹을 통한 저장소 테스트

## 확장성
1. 커스텀 필드
   - 동적 필드 추가 가능
   - 타입 안전성 보장

2. 저장소
   - localStorage와 in-memory(react state) 저장소로 확장 가능
   - STORAGE 설정을 통한 저장소 전환
     - local-storage
     - in-memory

## 개발 가이드
1. 환경 설정
   ```bash
   pnpm install
   ```

2. 개발 서버 실행
   ```bash
   pnpm dev
   ```

3. 테스트 실행
  ```bash
  pnpm test
  ```