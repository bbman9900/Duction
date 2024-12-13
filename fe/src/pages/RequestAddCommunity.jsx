import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

const PostForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title && !content) {
            alert('커뮤니티 이름과 개설 요청 이유를 입력해주세요.'); 
        } else if (!title) {
            alert('커뮤니티 이름을 입력해주세요.'); 
        } else if (!content) {
            alert('커뮤니티 개설 요청 이유를 입력해주세요.'); 
        } else {
            onSubmit({ title, content });
            setTitle(''); 
            setContent(''); 
        }
    };

    const handleCancel = () => {
        setTitle(''); // 제목 필드 초기화
        setContent(''); // 내용 필드 초기화
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <Helmet>
                <title>출품 상품 삭제 요청</title>
            </Helmet>
            <div>
                <label htmlFor="title">커뮤니티 이름</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="커뮤니티 이름을 입력해주세요 (30자)" 
                    required
                    maxLength={30} // 최대 글자 수 제한
                />
            </div>
            <div>
                <label htmlFor="content">개설 요청 이유</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="개설 요청 이유를 입력해주세요" 
                    required
                />
            </div>
            <button type="submit">확인</button>
            <button type="button" onClick={handleCancel}>취소</button>
        </form>
    );
};

export default PostForm;
