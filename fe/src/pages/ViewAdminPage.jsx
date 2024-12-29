import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCreateCommunityData } from "../services/adminService";
import GodoTitleLabel from "../components/Labels/GodoTitleLabel";
import PreSubTitleLabel from "../components/Labels/PreSubTitleLabel";
import RoundButton from "../components/Button/RoundButton";
import AdminTable from "../components/AdminTable";

import "@styles/pages/ViewAdminPage.css";

export default function ViewAdminPage() {
  const [type, setType] = useState("개설 요청");
  const [currentData, setCurrentData] = useState([]);
  const navigate = useNavigate();

  const sortOption = [
    { value: "개설 요청", title: "개설 요청" },
    { value: "삭제 요청", title: "삭제 요청" },
    { value: "신고", title: "신고" },
    { value: "검수", title: "검수" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCreateCommunityData();
        setCurrentData(data || []);
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchData();
  }, [type]);

  const handleNavigate = (id, type) => {
    if (type === "개설 요청" || type === "삭제 요청") {
      navigate("/viewAdminDetailPage", {
        state: { requestId: id, requestType: type },
      });
    } else if (type === "신고" || type === "검수") {
      navigate("/viewItem", { state: { itemId: id } });
    }
  };

  return (
    <div className="postlist-container">
      <GodoTitleLabel text={`${type} 목록`} />
      <div className="button-group-admin">
        <RoundButton
          options={sortOption}
          onChange={(value) => setType(value)}
          selectedOption={type}
        />
      </div>

      {currentData.length === 0 ? (
        <PreSubTitleLabel text="표시할 데이터가 없습니다." />
      ) : (
        <AdminTable type={type} data={currentData} handleNavigate={handleNavigate} />
      )}
    </div>
  );
}
