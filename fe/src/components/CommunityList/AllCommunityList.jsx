import HorizontalRule from "../HorizontalRule";
import GodoTitleLabel from "../Labels/GodoTitleLabel";
import PreTextLabel from "../Labels/PreTextLabel";
import CommunityList from "./CommunityList";


export default function AllCommunityList({ communities }) {
  const hangleOrder = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  const sortedCommunities = Object.entries(communities).sort(([a], [b]) => {
    return hangleOrder.indexOf(a) - hangleOrder.indexOf(b);
  });

  return (
    sortedCommunities.map(([char, communityList]) => (
      <>
        <div key={char} className="communityList_all_conteinar">
          <div className="communityList_all_left">
            <GodoTitleLabel text={char} />
          </div>
          <div className="communityList_all_right">
            {communityList.length > 0 ? (
              <CommunityList communityList={communityList} />
            ) : (
              <PreTextLabel text="표시할 커뮤니티가 없습니다" />
            )}
          </div>
        </div>
        <HorizontalRule type={"hr2"} />
      </>
    ))
  );
}
