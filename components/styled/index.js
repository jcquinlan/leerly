import styled from 'styled-components';

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
`;
