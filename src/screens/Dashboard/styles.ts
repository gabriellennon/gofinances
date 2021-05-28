import styled from 'styled-components/native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

import { Feather} from '@expo/vector-icons';

//coloco em letra maiuscula para que o react entenda que é um component
export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.View`
    width: 100%;
    /* estamos trabalhando com proporcao, caso entre em outro app ele se ajusta */
    /* usando o pixel mas ja convertido na proporcao */
    height: ${RFPercentage(42)}px;

    background-color: ${({ theme }) => theme.colors.primary};
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

export const UserWrapper = styled.View`
    width: 100%;

    padding: 0 24px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const UserInfo = styled.View`
    /* aplicando o flex no texto do titulo */
    flex-direction: row;
    align-items: center;
`;

export const  Photo = styled.Image`
    width: ${RFValue(48)}px;
    height: ${RFValue(48)}px;
    border-radius: 10px;
`;

export const User = styled.View`
    margin-left: 17px;
`;

export const UserGreeting = styled.Text`
    color: ${({ theme }) => theme.colors.shape };
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.regular };
`;

export const UserName = styled.Text`
    color: ${({ theme }) => theme.colors.shape };
    font-size: ${RFValue(18)}px;
    font-family: ${({ theme }) => theme.fonts.bold };
`;

//estilizando e ja importando o icone aqui
export const Icon = styled(Feather)`
    color: ${({ theme }) => theme.colors.secondary};
    font-size: ${RFValue(24)}px;

`;

export const HighlightCards = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: {paddingHorizontal: 24}
})`
    
`;