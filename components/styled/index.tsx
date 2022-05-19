import styled from 'styled-components';
import {devices} from './mediaQueries';
import Colors from './colors';
export {default as Colors} from './colors';
export {default as ReadCheck} from './ReadCheck';
export {devices} from './mediaQueries';

interface MarginProps {
  margin?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
}
export const Margin = styled.div<MarginProps>`
  ${props => `margin: ${props.margin};` || ''}
  ${props => `margin-top: ${props.marginTop};` || ''}
  ${props => `margin-bottom: ${props.marginBottom};` || ''}
  ${props => `margin-left: ${props.marginLeft};` || ''}
  ${props => `margin-right: ${props.marginRight};` || ''}
`;

export const Title = styled.h1`
  font-size: 30px;
  margin-bottom: 0;

  @media ${devices.laptop} {
    font-size: 48px;
  }
`;

interface SubtitleProps {
  center?: boolean;
}
export const Subtitle = styled.h3<SubtitleProps>`
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

interface ContainerProps {
  paddingTop?: string;
}
export const Container = styled.div<ContainerProps>`
  position: relative;
  margin: 0 auto;
  max-width: 920px;
  padding: 15px;
  padding-top: ${props => props.paddingTop || '30px'};
  width: 100%;

  @media ${devices.laptop} {
    padding: 30px;
    padding-top: ${props => props.paddingTop || '60px'};
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

interface ButtonProps {
  secondary?: boolean;
  vibe?: string;
}
export const Button = styled.button<ButtonProps>`
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

    ${props => props.vibe === 'danger' ? `
      background-color: ${Colors.LightDanger};
      color: ${Colors.Danger};

      &:hover {
          background-color: ${Colors.LightDangerHover};
      }
    `: ``}

    ${props => props.vibe === 'hard' ? `
      background-color: ${Colors.HardLight};
      color: ${Colors.Hard};

      &:hover {
          background-color: ${Colors.HardLightHover};
      }
    `: ``}

    ${props => props.vibe === 'medium' ? `
      background-color: ${Colors.MediumLight};
      color: ${Colors.Medium};

      &:hover {
          background-color: ${Colors.MediumLightHover};
      }
    `: ``}

    ${props => props.vibe === 'easy' ? `
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

export const GhostButton = styled.button`
    background: none;
    border: none;
    text-decoration: underline;
    cursor: pointer;
`;

interface CardProps {
  padding?: string;
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
}
export const Card = styled.div<CardProps>`
  background-color: #fff;
  border-radius: 5px;
  padding: ${props => props.padding || '15px'};
  box-shadow: 0px 7px 5px -5px rgba(0,0,0,0.3);
  border: 1px solid #eee;

  @media ${devices.laptop} {
    padding: ${props => props.padding || '30px'};
  }
`;
interface FlexProps {
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: string;
}
export const Flex = styled.div<FlexProps>`
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

export const Label = styled.label`
  margin-bottom: 10px;
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
    background: linear-gradient(157deg, rgba(31,74,184,1) 0%, rgba(63,199,143,1) 100%);
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
    margin-top: 30px;
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

interface NarrowContainerContentProps {
  width?: string;
}
const NarrowContainerContent = styled.div<NarrowContainerContentProps>`
    width: 100%;
    max-width: ${props => props.width};
`;
export const NarrowContainer = ({children, width = '600px'}) => {
  return (
    <NarrowContainerWrapper>
      <NarrowContainerContent width={width}>
        {children}
      </NarrowContainerContent>
    </NarrowContainerWrapper>
  )
}

interface TranscriptWordProps {
  isVocab?: boolean;
  seen?: boolean;
  isActive?: boolean;
}
export const TranscriptWord = styled.span<TranscriptWordProps>`
    cursor: pointer;
    border-radius: 8px;

    ${props => props.isVocab ? `
      background-color: ${Colors.EasyLight};
      color: ${Colors.Easy};
      font-weight: bold;
    `: ``}

    ${props => props.seen && props.isVocab ? `
      background-color: ${Colors.LightGrey};
      color: ${Colors.MediumGrey};
      font-weight: normal;
    `: ``}

    ${props => props.isActive ? `
        background-color: ${Colors.Primary};
        color: #fff;

        &:hover {
            font-weight: bold;
            background-color: ${Colors.PrimaryLight};
        }
    `: ``}

    &:hover {
      color: ${Colors.Primary};
      background-color: ${Colors.PrimaryLight};
      font-weight: bold;
  }
`;

export const PopoverBody = styled.div`
    margin: 10px 0;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    border: 1 px solid #eee;
    box-shadow: 0px 10px 25px 0px rgba(0,0,0,0.34);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #666;

    button {
        margin-top: -5px;
        width: fit-content;
        background-color: ${Colors.Primary};
        color: #fff;
        padding: 10px 15px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color linear 0.3s;

        &:hover {
            background-color: #375ebf;
        }
    }
`;

export const ShowTabletAndUp = styled.div`
    display: none;

    @media ${devices.tablet} {
      display: initial;
    }
`;

export const StatsRow = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 40px;
`;

export const Stat = styled.div`
    border-left: 1px solid grey;
    padding-left: 10px;
`;

export const StatTitle = styled.h6`
    margin: 0;
    font-weight: 300;
    font-size: 16px;
    color: ${Colors.MediumGrey};
`;

export const StatNumber = styled.p`
    margin: 0;
    margin-top: -10px;
    font-weight: 700;
    font-size: 48px;
    font-family: 'Poppins', sans-serif;
`;

export const ButtonWithLoading = ({loading, children, ...props}) => {
  return (
    <Button disabled={loading} {...props}>
      {loading ? 'Loading...': children}
    </Button>
  )
}
