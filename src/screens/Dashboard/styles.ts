import styled from 'styled-components/native';

//coloco em letra maiuscula para que o react entenda que é um component
export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;

    background-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
    font-family: ${({ theme }) => theme.fonts.bold};
    font-size: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.title};
`;