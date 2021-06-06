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
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

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
    .required('O valor é obrigatório')
});

export function Register(){
    //para guardarmos o estado quando o botao for selecionado
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const dataKey = '@gofinances:transactions';

    const navigation = useNavigation();

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypes(type: 'positive' | 'negative' ){
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

        const newTransaction = {
            //biblioteca que gera ids pra gente, caso nao tenhamos o backend e já convertendo ele em strings
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date()
        }
        
        //armazenando no dispositivo do usuario
        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ?  JSON.parse(data) : [];

            const dataFormatted = [
                //recuperando os dados e ai na hora de salvar eu passo os daos que já estavam salvos e passoo novo
                ...currentData, 
                newTransaction
            ];
            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

            //zerando os campos apos ele cadastrar nova transacao
            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            })
            //e após zerar eu encaminhoele pra tela de listagem 
            navigation.navigate('Listagem');


        } catch (error) {
            console.log(error)
            Alert.alert("Não foi possível salvar");
        }
    }

    // useEffect(() => {
    //     async function loadData(){
    //        const data = await AsyncStorage.getItem(dataKey);
    //     //    passando para JSON novamente
    //     //essa exclamação fala que ele pode confiar em mim, pois sempre vai vir algoe ele nunca vai ser nulo
    //        console.log(JSON.parse(data!))
    //     }

    //     loadData();

    //     //Funcao para limpar o async storage caso precise
    //     // async function removeAll(){
    //     //     await AsyncStorage.removeItem(dataKey);
    //     // }

    //     // removeAll();
    // }, [])

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
                                onPress={() => handleTransactionTypes('positive')} 
                                //passando o estado que tem qual o tipo selecionado
                                isActive={transactionType === 'positive'}
                            />

                            <TransactionTypeButton 
                                type="down" 
                                title="Outcome" 
                                onPress={() => handleTransactionTypes('negative')} 
                                isActive={transactionType === 'negative'}
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