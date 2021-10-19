import styled from 'styled-components';
import {devices} from './styled/mediaQueries';

const ProgressBar = ({progress}) => {
    return (
        <ProgressContainer progress={progress}>
            <div className="progressbar-complete" style={{width: `${progress}%`}}>
                <div className="progressbar-liquid"></div>
            </div>
        </ProgressContainer>
    )
}

export default ProgressBar;

const ProgressContainer = styled.div`
    position: relative;
    background-color: #eee;
    width: 100%;
    height: 50px;
    border: 1px solid #FFF;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .progressbar-complete {
      position: absolute;
      left: 0;
      top: 0px;
      height: 100%;
      background: #1f4ab8;
      border-radius: 10px;
      animation: g 2500ms infinite ease-in-out;
      z-index: 2;

      .progressbar-liquid {
        z-index: 1;
        width: 70px;
        height: 70px;
        animation: g 2500ms infinite ease-in-out, r 10000ms infinite cubic-bezier(0.5, 0.5, 0.5, 0.5);
        position: absolute;
        right: -5px;
        top: -10px;
        background-color: #1f4ab8;
        border-radius: 40%;
      }

    .progress {
      z-index: 2;
    }
  }

@keyframes r {
  from { transform: rotate(0deg); }
  from { transform: rotate(360deg); }
}
`;