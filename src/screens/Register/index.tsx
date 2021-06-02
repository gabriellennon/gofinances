import React, { useState, useEffect } from 'react';
import { 
    Keyboard, 
    Modal, 
    TouchableWithoutFeedback,
    Alert
} from 'react-native';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { InputForm } from '../../components/Form/InputForm';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { CategorySelect } from '../CategorySelect';

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles';

//Interface para tipar o meu form
interface FormData {
    name: string;
    amount: string
}

//dizendo o que meu formulario vai ter e suas validações 
const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
});

export function Register(){
    //para guardarmos o estado quando o botao for selecionado
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const dataKey = '@gofinances:transactions';

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
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

    async function handleRegister(form: FormData){
        if(!transactionType){
            return Alert.alert('Selecione o tipo da transação 🤓')
        }

        if(category.key === 'category'){
            return Alert.alert('Selecione a categoria 😬')
        }

        const data = {
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key
        }
        
        //armazenando no dispositivo do usuario
        try {
            await AsyncStorage.setItem(dataKey, JSON.stringify(data));

        } catch (error) {
            console.log(error)
            Alert.alert("Não foi possível salvar");
        }
    }

    useEffect(() => {
        async function loadData(){
           const data = await AsyncStorage.getItem(dataKey);
        //    passando para JSON novamente
        //essa exclamação fala que ele pode confiar em mim, pois sempre vai vir algoe ele nunca vai ser nulo
           console.log(JSON.parse(data!))
        }

        loadData();
    }, [])

    return(
        //coloquei ele envolvendo geral pq coloco ele para caso eu clique em qualquer outro lugar ele fecha o teclado
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container>
                <Header>
                    <Title>Cadastro</Title>
                </Header>
                <Form>
                    <Fields>
                        <InputForm
                            name="name"
                            control={control}
                            placeholder="Nome" 
                            //Colocando para o input formatar cada palavra (word), sentença (sentences), letra (characters) 
                            autoCapitalize="sentences"
                            //Tirando o por padrão do corretor de corrigir 
                            autoCorrect={false}
                            error={errors.name && errors.name.message}
                        />

                        <InputForm 
                            name="amount"
                            control={control}
                            placeholder="Preço" 
                            keyboardType="numeric"
                            error={errors.amount && errors.amount.message}
                        />

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
                    <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
                </Form>

                <Modal visible={categoryModalOpen}>
                    <CategorySelect 
                        category={category}
                        setCategory={setCategory}
                        closeSelectCategory={handleCloseSelectCategoryModal}
                    />
                </Modal>
            </Container>
        </TouchableWithoutFeedback>
    )
}