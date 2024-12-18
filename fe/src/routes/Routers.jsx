import {Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import RequestAddCommunity from '../pages/RequestAddCommunity';
import ViewItemList from '../pages/ViewItemList';
import ViewCommunityList from '../pages/ViewCommunityList';
import ViewMyInfo from '../pages/ViewMyInfo';

export default function Routers() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/requestAddCommunity' element={<RequestAddCommunity />} />
      <Route path='/viewItemList' element={<ViewItemList />} />
      <Route path="/viewCommunityList" element={<ViewCommunityList />} />
      <Route path="/viewMyInfo" element={<ViewMyInfo />} />
    </Routes>
  );
}