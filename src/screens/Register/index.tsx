import React, { useState } from 'react';
import { Modal } from 'react-native'

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { Input } from '../../components/Form/Input';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';

import { CategorySelect } from '../CategorySelect';

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
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    function handleTransactionTypes(type: 'up' | 'down' ){
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }

    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
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

                    <CategorySelectButton 
                        title={category.name}
                        onPress={handleOpenSelectCategoryModal}
                    />
                </Fields>
                <Button title="Enviar" />
            </Form>

            <Modal visible={categoryModalOpen}>
                <CategorySelect 
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>
        </Container>
    )
}