import styled from 'styled-components';
import { Colors, devices } from './styled';

export const PlanContainer = styled.div`
  margin-right: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  min-width: 400px;
  margin-top: 30px;

  @media ${devices.tablet} {
    margin-top: 0;
  }

  ${props => props.selected ? `
    border: 1px solid ${Colors.Primary};
  `: ``}
`;

export const PlanHeader = styled.div`
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  font-weight: bold;
  font-size: 24px;
  text-align: center;
  color: #333;

  ${props => props.special ? `
    color: ${Colors.Primary};
  `: ``}
`;
export const PlanBody = styled.div`
    padding: 15px;
    li {
        margin-bottom: 10px;
    }

`;

export const Plans = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-top: 60px;

  @media ${devices.tablet} {
      flex-direction: row;
  }

  ${props => props.selectable ? `
    margin-top: 0; 

    ${PlanContainer} {
        cursor: pointer;

        &:hover {
            border: 1px solid ${Colors.Primary};
        }
    }
  `: ``}
`;