import LayoutContainer from "~/components/layouts/Container";
import MyHeader from "~/components/mypages/MyHeader";
import MyPageTabs from "~/components/mypages/MyPageTabs";

export default function MypageLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutContainer>
      <MyHeader pageId="mypage" />
      <MyPageTabs />
      {children}
    </LayoutContainer>
  );
}
