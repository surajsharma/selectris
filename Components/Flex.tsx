import styled from "@emotion/styled";

export const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    color: white;
`;

export const FlexR = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    color: white;
    flex-direction: column;
    height: 100vh;
`;

export const SideBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 10%;
    color: white;
    flex-direction: column;
`;

export const FC = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const NextContainer = styled.div`
    width: 100px;
    height: 100px;
    background: rgba(90, 90, 90, 0);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border-radius: 8px;
    align-items: center;
    align-content: center;
    justify-content: center;
`;

export const Level = styled.div`
    width: 100px;
    height: 70px;
    display: flex;
    flex-direction: column;
    background: rgba(90, 90, 90, 0.1);
    border-radius: 8px;
    align-items: center;
    align-content: center;
    flex-direction: column;
    line-height: 0;
    border: 1px solid rgba(90, 90, 190, 0.1);
`;

export const Score = styled.div`
    width: 100px;
    height: 70px;
    display: flex;
    flex-direction: column;
    background: rgba(90, 90, 90, 0.1);
    border-radius: 8px;
    align-items: center;
    align-content: center;
    flex-direction: column;
    line-height: 0;
    border: 1px solid rgba(90, 90, 190, 0.1);
`;
