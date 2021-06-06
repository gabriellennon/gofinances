import React, { useCallback, useEffect, useState } from 'react';

import { ActivityIndicator } from 'react-native';
import { 
    Container, 
    Header,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    UserWrapper,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LogoutButton,
    LoadContainer
} from './styles';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components'
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransationCardProps } from '../../components/TransactionCard';

export interface DataListProps extends TransationCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}
interface HighlightDataInterface {
    entries: HighlightProps,
    expensives: HighlightProps,
    total: HighlightProps
}

export function Dashboard(){
    const [isLoading, setIsLoading] = useState(true);

    const theme = useTheme();

    function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative'){

        const lastTransactionsEntries = new Date(
            Math.max.apply(Math, 
                collection.filter(
                    (transaction) => transaction.type === type
                ).map(
                    (transaction) => new Date(transaction.date).getTime()
                )    
            )
        )

        return `${lastTransactionsEntries.getDate()} de ${lastTransactionsEntries.toLocaleString('pt-BR', {month: 'long'})}`;
    }

    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    //começa sendo vazio do tipo HighlightDataInterface
    const [highlightData, setHighlightData] = useState<HighlightDataInterface>({} as HighlightDataInterface);

    async function loadTransactions(){
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        //fazendo formatacao 
        const transactionsFormatted: DataListProps[]  = transactions.map((item: DataListProps) => {

            if(item.type === 'positive'){
                //Pegando o valor em entriesSum e somando mais o valor de item.amount , que é igual a entriesTotal = entriesTotal +  Number(item.amount)
                entriesTotal += Number(item.amount);
            }else {
                expensiveTotal += Number(item.amount);
            }


            //formatando o valor para numero e para valor brasileiro
            const amount = Number(item.amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            }
        })

        setTransactions(transactionsFormatted);

        const lastTransactionsEntries = getLastTransactionDate(transactions, 'positive');
        const expansivesTransactionsEntries = getLastTransactionDate(transactions, 'negative');
        const totalInterval = `01 a ${expansivesTransactionsEntries}`;

        const totalMoney = entriesTotal - expensiveTotal;

        //atualizando nosso sethighliht
        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última entrada dia ${lastTransactionsEntries}`
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: `Última saída dia ${expansivesTransactionsEntries}`
            },
            total: {
                amount: totalMoney.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            }
        });

        //depois de atualizar meu estado ai eu seto false no loading
        setIsLoading(false);
    }


    //carregando os dados
    useEffect(() => {
        loadTransactions();

        // Limpar a lista caso precise
        // const dataKey = '@gofinances:transactions';
        // AsyncStorage.removeItem(dataKey);
    }, [])


    useFocusEffect(useCallback(() =>{
        loadTransactions();
    }, []));

    return(
        <Container>
            {
                isLoading ? 
                    <LoadContainer> 
                        <ActivityIndicator color={theme.colors.primary} size="large" /> 
                    </LoadContainer>  :
                <>
                        <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo source={{ uri:  'https://avatars.githubusercontent.com/u/57332512?v=4' }} />
                                <User>
                                    <UserGreeting>Olá, </UserGreeting>
                                    <UserName>Gabriel</UserName>
                                </User>
                            </UserInfo>
                            <LogoutButton onPress={() => {} }>
                                <Icon name="power" />
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards
                        // ddeixar eles lado a lado
                        // horizontal
                        // para ocultar a barrinha horizontal que aparece
                        // showsHorizontalScrollIndicator={false}
                        // contentContainerStyle={{ paddingHorizontal: 24 }}
                    >
                        <HighlightCard 
                            type="up"
                            title="Entradas" 
                            amount={highlightData.entries.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                        />
                        <HighlightCard 
                            type="down"
                            title="Saídas" 
                            amount={highlightData.expensives.amount}
                            lastTransaction={highlightData.expensives.lastTransaction}
                        />
                        <HighlightCard
                            type="total" 
                            title="Total" 
                            amount={highlightData.total.amount}
                            lastTransaction={highlightData.total.lastTransaction}
                        />
                        
                    </HighlightCards>

                    <Transactions>
                    <Title>Listagem</Title>
                    <TransactionsList 
                        data={transactions}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <TransactionCard data={item} />}
                    />
                    </Transactions>
                </>
            }
        </Container>
    )
}
