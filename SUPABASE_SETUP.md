# Supabase Cloud Database & Media Storage Setup Guide

Tree of Life Global Missions 웹사이트에 **Supabase 클라우드 데이터베이스(PostgreSQL)**와 **고화질 사진/영상 스토리지(Storage Bucket)**를 연결하는 완벽 가이드입니다.

---

## 1. Supabase 무료 프로젝트 생성
1. [https://supabase.com](https://supabase.com) 에 접속하여 무료 회원가입/로그인합니다.
2. **New Project** 클릭:
   - **Name**: `tree-of-life-missions`
   - **Database Password**: 안전한 비밀번호 입력 (기억해두기)
   - **Region**: `US East (North Virginia)` 또는 `US Central` 선택 (빠른 응답 속도)
   - **Pricing Plan**: `Free` (무료 티어: DB 500MB, 스토리지 1GB, 대역폭 2GB 무료 제공)
3. 2~3분 후 프로젝트 생성이 완료됩니다.

---

## 2. 데이터베이스 테이블 생성 (SQL Editor)
Supabase 대시보드 좌측 메뉴의 **SQL Editor**로 이동한 후 **New Query**를 누르고 다음 SQL을 복사하여 실행(Run)합니다:

```sql
-- 1. 사진/미디어 테이블 생성
CREATE TABLE IF NOT EXISTS public.photos (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  tag TEXT DEFAULT 'community',
  date DATE DEFAULT CURRENT_DATE,
  location TEXT DEFAULT 'Bryan & College Station, TX',
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) 활성화
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- 3. 모든 방문자가 갤러리 사진을 볼 수 있도록 허용
CREATE POLICY "Public Read Access" 
ON public.photos FOR SELECT 
USING (true);

-- 4. 로그인된 스태프가 사진을 등록할 수 있도록 허용
CREATE POLICY "Staff Insert Photos" 
ON public.photos FOR INSERT 
WITH CHECK (true);

-- 5. 스태프 사진 삭제 허용
CREATE POLICY "Staff Delete Photos" 
ON public.photos FOR DELETE 
USING (true);
```

---

## 3. Storage 버킷 생성 (미디어 저장소)
1. 좌측 메뉴에서 **Storage** 클릭.
2. **New Bucket** 클릭:
   - **Bucket name**: `mission-photos` (소문자 필수)
   - **Public bucket**: **ON (활성화)** ➔ 전 세계 방문자에게 사진 CDN URL 제공을 위해 필수입니다.
3. 생성 완료 후 **Policies** 탭에서 누구나 업로드/열람할 수 있도록 정책을 설정하거나 기본 Public 설정을 유지합니다.

---

## 4. 웹사이트에 프로젝트 연동 (URL & Anon Key)
Supabase 대시보드 좌측 하단 **Project Settings** ➔ **API** 메뉴에서 2개 값을 확인합니다:
1. **Project URL**: `https://xxxxxxxx.supabase.co`
2. **Project API Keys (`anon` / `public`)**: `eyJhbGciOi...`

### 연동 방법 (2가지 중 편한 방법 선택):
- **방법 A (브라우저 콘솔에서 즉시 연결)**:
  브라우저 F12 콘솔 창에 입력:
  ```javascript
  window.supabaseClient.setCredentials("https://내프로젝트.supabase.co", "내-anon-키");
  ```
- **방법 B (코드에 직접 저장)**:
  `js/supabase-client.js` 파일 상단의 `SUPABASE_DEFAULT_CONFIG`에 입력:
  ```javascript
  const SUPABASE_DEFAULT_CONFIG = {
    url: 'https://내프로젝트.supabase.co',
    anonKey: '내-anon-키',
    bucketName: 'mission-photos'
  };
  ```

입력 즉시 로컬 하이브리드 모드에서 **실시간 Supabase 클라우드 모드로 자동 전환**됩니다!
