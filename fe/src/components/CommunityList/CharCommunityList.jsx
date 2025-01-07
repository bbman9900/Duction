import CommunityList from "./CommunityList";
import PreTextLabel from "../Labels/PreTextLabel"

export default function CharCommunityList({ communities }) {
  return (
    <>
      {communities.length > 0 ? (
        <CommunityList communityList={communities} />
      ) : (
        <PreTextLabel text="표시할 커뮤니티가 없습니다" />
      )}
    </>
  )
}    