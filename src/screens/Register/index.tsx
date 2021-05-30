import React, { useState } from 'react';
import { Modal } from 'react-native'

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { Input } from '../../components/Form/Input';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles';

export function Register(){
    //para guardarmos o estado quando o botao for selecionado
    const [transactionType, setTransactionType] = useState('');

    function handleTransactionTypes(type: 'up' | 'down' ){
        setTransactionType(type);
    }

    return(
        <Container>
            <Header>
                <Title>Cadastro</Title>
            </Header>
            <Form>
                <Fields>
                    <Input placeholder="Nome" />
                    <Input placeholder="Preço" />
                    <TransactionTypes>

                        <TransactionTypeButton 
                            type="up" 
                            title="Income" 
                            onPress={() => handleTransactionTypes('up')} 
                            //passando o estado que tem qual o tipo selecionado
                            isActive={transactionType === 'up'}
                        />

                        <TransactionTypeButton 
                            type="down" 
                            title="Outcome" 
                            onPress={() => handleTransactionTypes('down')} 
                            isActive={transactionType === 'down'}
                        />

                    </TransactionTypes>

                    <CategorySelectButton title="Categoria" />
                </Fields>
                <Button title="Enviar" />
            </Form>
        </Container>
    )
}