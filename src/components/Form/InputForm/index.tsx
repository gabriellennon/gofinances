import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { TextInputProps } from 'react-native';
import { Input } from '../Input';

import { Container } from './styles';

interface Props extends TextInputProps {
    control: Control;
    name: string;
}

export function InputForm({ control, name, ...rest } : Props){
    return(
        <Container>
            <Controller
                control={control}
                //acessando as propriedades do input
                //on change é quand eu pego qualquer mudanca, o onblur é quando eu acesso ele e o value é o proprio valor dele
                render={({ field: {onChange, value} }) => (
                        <Input 
                            onChangeText={onChange}
                            value={value}
                            {...rest}
                        />
                )}
                name={name}
            />
        </Container>
    )
}