import React from 'react';
import '@styles/components/HorizontalRule.css';

const HorizontalRule = ({ type }) => {
  return <hr className={`custom-hr ${type}`} />;
};

export default HorizontalRule;
