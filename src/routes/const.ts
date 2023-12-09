// 루트
export const ROUTE_ROOT = '/';

// 로그인
export const ROUTE_SIGN_IN = '/sign-in';

// 회원가입
export const ROUTE_SIGN_UP = `/sign-up`;

// 프로필
export const ROUTE_PROFILE = '/profile';

// 유저관리
export const ROUTE_USER = '/user';
export const ROUTE_USER_MANAGEMENT = `${ROUTE_USER}/management`;

// 게시글
export const ROUTE_ARTICLE = '/article';
// 게시글 목록
export const ROUTE_ARTICLE_LIST = `${ROUTE_ARTICLE}/list`;
// 게시글 생성
export const ROUTE_ARTICLE_CREATE = `${ROUTE_ARTICLE}/create`;
// 게시글 상세
export const ROUTE_ARTICLE_DETAIL = `${ROUTE_ARTICLE}/detail`;
export const ROUTE_ARTICLE_DETAIL_ID = `${ROUTE_ARTICLE}/detail/:id`;
export const ROUTE_ARTICLE_DETAIL_WITH_ID = (id: string) =>
  `${ROUTE_ARTICLE_DETAIL}/${id}`;

// 방명록
export const ROUTE_GUESTBOOK = '/guestbook';

// 이벤트
export const ROUTE_EVENT = '/event';

// 셋팅
export const ROUTE_SETTING = '/setting';
