import React from 'react';
import {TextArea} from './styled';

const TextAreaComponent = (props) => {
    return <TextArea rows={5} {...props} />;
};

export default TextAreaComponent;