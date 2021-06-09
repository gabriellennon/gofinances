import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler'
import { SvgProps } from 'react-native-svg';

import {
    Button,
    ImageContainer,
    Text,
    Title,
} from './styles'

interface Props extends RectButtonProps {
    title: string;
    svg: React.FC<SvgProps>
    onPress: () => void;
}

export function SignInSocialButton({
    title,
    svg: Svg,
    onPress,
    ...rest
} : Props){
    return(
        <Button onPress={onPress}>
            <ImageContainer>
                <Svg />
            </ImageContainer>

            <Text>
                <Title>{title}</Title>
            </Text>
        </Button>
    );
}