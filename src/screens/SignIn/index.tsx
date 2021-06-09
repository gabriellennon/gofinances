import React, {useContext} from 'react';
import { Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import AppleSvg from '../../assets/icon/apple_icon.svg';
import GoogleSvg from '../../assets/icon/google-icon.svg';
import LogoSvg from '../../assets/icon/logo.svg';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';

import { 
    Container,
    Header,
    TitleWrapper,
    Title,
    SignTitle,
    Footer,
    FooterWrapper
} from './styles';

export function SignIn(){
    //useContext é para eu conseguir acessar meu contexto
    const { user, signInWithGoogle, signInWithApple } = useAuth();
    console.log(user)


    async function handlesignInWithGoogle(){
        try {
            await signInWithGoogle();
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possívelconectar a conta Google')
        }
    }

    async function handlesignInWithApple(){
        try {
            await signInWithApple();
        } catch (error) {
            console.log(error);
            Alert.alert('Não foi possívelconectar a conta Apple')
        }
    }


    return(
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg 
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>Controle suas {'\n'} finanças de forma  {'\n'}  muito simples</Title>
                </TitleWrapper>

                <SignTitle>Faça seu login com {'\n'} uma das contas abaixo</SignTitle>
            </Header>

            <Footer>
                <FooterWrapper>
                    <SignInSocialButton  
                        title="Entrar com Google"
                        svg={GoogleSvg}
                        onPress={handlesignInWithGoogle}
                    />
                    
                    <SignInSocialButton  
                        title="Entrar com Apple"
                        svg={AppleSvg}
                        onPress={handlesignInWithApple}
                    />
                </FooterWrapper>
            </Footer>

        </Container>
    )
}