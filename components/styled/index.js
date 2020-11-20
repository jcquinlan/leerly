import styled from 'styled-components';
export {default as Colors} from './colors';
export {default as ReadCheck} from './ReadCheck';

export const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 0;
`;

export const Subtitle = styled.h3`
    font-size: 22px;
    margin-bottom: 10px;

    ${props => props.center ? (
        `text-align: center;`
    ): ``}
`;

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 900px;
  padding: 30px;
  padding-bottom: 90px;
  width: 100%;
`;

export const HeroWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const HeroContent = styled.div`
  max-width: 600px;
`;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  background-color: #eee;
  margin: 30px 0;
`;

export const Button = styled.button`
    padding: 10px 20px;
    border: 2px solid #1f4ab8;
    background-color: #1f4ab8;
    box-shadow: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    transition: background-color linear 0.3s;

    &:hover {
        background-color: #375ebf;
    }

    &:disabled {
      background-color: #ddd;
      color: #666;
      border-color: #ddd;
      cursor: initial;
    }

    a {
      color: #fff;
      text-decoration: none;
    }
`;

export const Card = styled.div`
  background-color: #fff;
  border-radius: 5px;
  padding: ${props => props.padding || '30px'};
  box-shadow: 0px 7px 5px -5px rgba(0,0,0,0.3);
  border: 1px solid #eee;
`;

export const Flex = styled.div`
    display: flex;
    justify-content: ${props => props.justifyContent || 'initial'};
    align-items: ${props => props.alignItems || 'initial'};
    flex-direction: ${props => props.flexDirection || 'row'};
`;

export const Input = styled.input`
    width: 100%;
    margin-bottom: 20px;
    background-color: #efefef;
    border: 1px solid #eee;
    padding: 10px 10px;
    border-radius: 5px;
    font-size: 16px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  margin-bottom: 20px;
  background-color: #efefef;
  border: 1px solid #eee;
  padding: 10px 10px;
  border-radius: 5px;
  font-size: 16px;
  white-space: pre-wrap;
`;

export const HelpText = styled.p`
    font-size: 14px;
    color: #888;
`;
