import styled from 'styled-components';
import {devices} from './mediaQueries';
import Colors from './colors';
export {default as Colors} from './colors';
export {default as ReadCheck} from './ReadCheck';
export {devices} from './mediaQueries';

export const Title = styled.h1`
  font-size: 30px;
  margin-bottom: 0;

  @media ${devices.laptop} {
    font-size: 48px;
  }
`;

export const Subtitle = styled.h3`
    font-size: 18px;
    color: #666;
    margin-bottom: 10px;
    margin-top: 0px;

    ${props => props.center ? (
        `text-align: center;`
    ): ``}

    @media ${devices.laptop} {
      font-size: 22px;
    }
`;

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 900px;
  padding: 15px;
  padding-top: ${props => props.paddingTop || '60px'};
  width: 100%;

  @media ${devices.laptop} {
    padding: 30px;
  }
`;

export const PageContainer = styled(Container)`
  @media ${devices.laptop} {
    padding-bottom: 90px;
  }
`

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
  margin: 60px 0;
`;

export const Button = styled.button`
    padding: 10px 20px;
    border: none;

    background: rgb(31,74,184);

    box-shadow: none;
    border-radius: 5px;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    transition: background-color linear 0.3s;

    &:hover {
        background-color: #375ebf;
    }

    ${props => props.secondary ? `
      background-color: #eee;
      color: ${Colors.MediumGrey};

      &:hover {
          background-color: #ddd;
      }
    `: ``}

    ${props => props.type === 'danger' ? `
      background-color: ${Colors.LightDanger};
      color: ${Colors.Danger};

      &:hover {
          background-color: ${Colors.LightDangerHover};
      }
    `: ``}

    ${props => props.type === 'hard' ? `
      background-color: ${Colors.HardLight};
      color: ${Colors.Hard};

      &:hover {
          background-color: ${Colors.HardLightHover};
      }
    `: ``}

    ${props => props.type === 'medium' ? `
      background-color: ${Colors.MediumLight};
      color: ${Colors.Medium};

      &:hover {
          background-color: ${Colors.MediumLightHover};
      }
    `: ``}

    ${props => props.type === 'easy' ? `
      background-color: ${Colors.EasyLight};
      color: ${Colors.Easy};

      &:hover {
          background-color: ${Colors.EasyLightHover};
      }
    `: ``}

    &:disabled {
      background: #ddd;
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
  padding: ${props => props.padding || '15px'};
  box-shadow: 0px 7px 5px -5px rgba(0,0,0,0.3);
  border: 1px solid #eee;

  @media ${devices.laptop} {
    padding: ${props => props.padding || '30px'};
  }
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

export const Checkbox = styled(Input)`
    width: auto;
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
    line-height: 24px;
    color: #888;
`;

export const NoticeCard = styled(Card)`
    background: rgb(31,74,184);
    background: linear-gradient(157deg, rgba(31,74,184,1) 0%, rgba(63,199,143,1) 100%);;
    color: #fff;
    margin-bottom: 30px;
    border: none;
    cursor: pointer;

    ${props => (props.theme === 'Warm' ? `
      background: rgb(31,160,184);
      background: linear-gradient(157deg, rgba(31,160,184,1) 0%, rgba(189,76,233,1) 100%);` : ``
    )}

    ${props => (props.theme === 'Grey' ? `
      background: #eee;
      color: #333;
      cursor: initial;
      
      ${NoticeCardMain} {
        color: #333;
      }` : ``
    )}

`;

export const NoticeCardMain = styled.span`
    color: #fff;
    margin-top: 20px;
    font-size: 24px;
`;

export const ImageWrapper = styled.div`
    margin: 15px 0;

    img {
        width: 100%;
        margin: 0;
    }
`;

export const ImageAttribution = styled.p`
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
`;


export const AudioWrapper = styled.div`
    margin-top: 60px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
`;

export const FakeAudioWidget = styled.div`
    width: 300px;
    border-radius: 50px;
    padding: 14px;
    background: #F1F3F4;
    text-align: center;
    color: #444;
    cursor: pointer;
    box-shadow: 0px 4px 5px 0px #e0e0e0;

    span {
        margin-right: 10px;
        font-size: 18px;
    }
`;

const NarrowContainerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const NarrowContainerContent = styled.div`
    max-width: ${props => props.width};
    text-align: ${props => props.textAlign};
`;
export const NarrowContainer = ({children, width = '600px', textAlign = 'left'}) => {
  return (
    <NarrowContainerWrapper>
      <NarrowContainerContent width={width} textAlign={textAlign}>
        {children}
      </NarrowContainerContent>
    </NarrowContainerWrapper>
  )
}
