# 회원 관리 시스템

## 프로젝트 개요
회원 정보를 관리하는 웹 애플리케이션입니다. 회원의 기본 정보와 커스텀 필드를 관리할 수 있으며, 로컬 스토리지를 활용한 데이터 영속성을 제공합니다.

## 기술 스택
- React
- TypeScript
- Ant Design (UI 컴포넌트)
- Vitest (테스트)
- Zod (유효성 검증)

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

## 핵심 구현 설명
### 회원 CRUD 구현 아키텍처
회원 데이터의 조회, 추가, 수정, 삭제는 다음과 같은 계층적 구조로 구현되었습니다:

1. **Data Layer (Service)**
- `MemberService` 클래스: 데이터 조작을 담당하는 싱글톤 클래스
- 로컬 스토리지 또는 메모리 기반 데이터 저장소 관리
- Promise 기반의 비동기 메서드 제공

2. **State Management Layer (Store)**
- `memberStore`: Zustand를 사용한 상태 관리 스토어
- 로딩, 에러 상태 관리
- 서비스 계층과 UI 계층 사이의 중개자 역할

1. **UI Layer (Components)**
- `MemberList`: 회원 목록 표시 및 조회
- `MemberFormModal`: 회원 추가/수정 폼
- `useMemberModal`: 모달 상태 관리 훅

### 회원 양식 폼 구현 (MemberFormModal)
회원 추가와 수정을 위한 양식 폼은 다음과 같이 구현되었습니다:

1. **컴포넌트 설계**
- 모드(mode)에 따라 추가/수정 기능 분기 처리
- React Hook Form을 사용한 폼 상태 관리
- 필드 타입에 따른 동적 입력 컴포넌트 렌더링

1. **폼 필드 생성 로직**
```tsx
{fields.map((field) => {
  // 필드 타입에 따라 다른 컴포넌트 렌더링
  let fieldInput;
  switch (field.type) {
    case 'text':
      // 텍스트 입력 필드
      break;
    case 'textarea':
      // 텍스트 영역
      break;
    case 'date':
      // 날짜 선택
      break;
    case 'select':
      // 선택 상자
      break;
    case 'checkbox':
      // 체크박스
      break;
  }
  return (/* 필드 렌더링 */);
})}
```

1. **유효성 검증**
- 필수 필드 검증
- 텍스트 길이 제한 (text: 20자, textarea: 50자)
- 커스텀 에러 메시지

1. **데이터 처리**
- 추가 모드: `addMember` 호출
- 수정 모드: `updateMember` 호출
- 날짜 형식 변환 (dayjs → 문자열)

### 주요 데이터 흐름

1. **회원 조회**
```
MemberList 컴포넌트 
→ useMemberStore.fetchMembers() 
→ memberService.getMembers() 
→ 데이터 반환 및 상태 업데이트
```

1. **회원 추가**
```
MemberFormModal(mode: 'create') 
→ useMemberStore.addMember(data) 
→ memberService.addMember(data) 
→ 로컬 스토리지 저장 
→ 상태 업데이트
```

1. **회원 수정**
```
MemberFormModal(mode: 'edit') 
→ useMemberStore.updateMember(id, data) 
→ memberService.updateMember(id, data) 
→ 로컬 스토리지 업데이트 
→ 상태 업데이트
```

1. **회원 삭제**
```
삭제 버튼 클릭 
→ Modal.confirm 
→ useMemberStore.deleteMember(id) 
→ memberService.deleteMember(id) 
→ 로컬 스토리지 업데이트 
→ 상태 업데이트
```

### 구현의 특징
- **Optimistic Updates**: 상태 업데이트를 즉시 반영하여 UX 향상
- **Error Handling**: 각 작업 단계에서 에러 핸들링 및 상태 관리
- **Type Safety**: TypeScript를 활용한 엄격한 타입 검사
- **Storage Flexibility**: 환경 설정에 따라 저장소 전환 가능

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
  - local-storage: 회원 데이터를 로컬스토리지에 저장
  - in-memory: 회원 데이터를 메모리에 저장

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