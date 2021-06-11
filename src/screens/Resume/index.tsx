import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { HistoryCard } from '../../components/HistoryCard';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    Container, 
    Header, 
    Title, 
    Content, 
    ChartContainer ,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month,
    LoadingContainer,
} from './styles';
import { categories } from '../../utils/categories';
import { ScrollView } from 'react-native-gesture-handler';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';
interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percentFormatted: string;
    percent: number;
}


export function Resume(){
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setselectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const { user } = useAuth();

    const theme = useTheme();

    function handleDateChange(action: 'next' | 'prev'){
        
        if(action === 'next'){
            setselectedDate(addMonths(selectedDate, 1));
        }else {
            setselectedDate(subMonths(selectedDate, 1));
        }
    }

    async function loadData(){
        setIsLoading(true);

        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted
        .filter((expensive: TransactionData) => 
            expensive.type === 'negative' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear()

        );




        //reduce = pegar uma colacao e fazer uma soma
        const expensivesTotal = expensives
        .reduce((accumlator: number, expensive: TransactionData) => {
            return accumlator + Number(expensive.amount);
        }, 0);

        const totalByCategory: CategoryData[] = [];

        //percorrendo cada categoria
        const data = categories.forEach(category => {
            let categorySum = 0;

            //E para cada categoria que eu percorro eu vou percorrer minha colecao que tem minhas transacos de saida
            expensives.forEach((expensive: TransactionData) => {
                if(expensive.category === category.key){
                    categorySum += Number(expensive.amount);
                }
            })

            if(categorySum > 0){
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

                
                const percent = (categorySum / expensivesTotal * 100);
                //calculando a porcentagem e removendo as casas decimais
                const percentFormatted =`${percent.toFixed(0)}%`;

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    totalFormatted,
                    color: category.color,
                    percent,
                    percentFormatted 
                })

            }
        });

        setTotalByCategories(totalByCategory)

        setIsLoading(false);
    }
    
    useFocusEffect(useCallback(() =>{
        loadData();
        //toda vez que meu selectedDate mudar, eu disparo o meu loadData
    }, [selectedDate]));

    return(
        <Container>
           
                    <Header>
                        <Title>Resumo por categoria</Title>
                    </Header>
                {
                    isLoading ? 
                        <LoadingContainer>
                            <ActivityIndicator 
                                color={theme.colors.primary}
                                size="large"
                            />
                        </LoadingContainer>
                    :
                    <>
                        <Content  
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ 
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight(),
                    }}
                >

                    <MonthSelect>
                        <MonthSelectButton onPress={() => handleDateChange('prev')}>
                            <MonthSelectIcon name="chevron-left" />
                        </MonthSelectButton>

                        <Month>{ format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }</Month>

                        <MonthSelectButton onPress={() => handleDateChange('next')}>
                            <MonthSelectIcon  name="chevron-right" />
                        </MonthSelectButton>
                    </MonthSelect>

                    <ChartContainer>
                        <VictoryPie 
                            data={totalByCategories}
                            x="percentFormatted"
                            y="total"
                            colorScale={totalByCategories.map(category => category.color)}
                            style={{
                                labels: { fontSize: RFValue(18), fontWeight: 'bold', fill: theme.colors.shape }
                            }}
                            labelRadius={50}
                        />
                    </ChartContainer>


                    {
                        totalByCategories.map(item => (
                            <HistoryCard 
                                key={item.key}
                                title={item.name}
                                amount={item.totalFormatted}
                                color={item.color}
                            />
                            
                        ))
                    }
                </Content>
                    </>
                }
        </Container>
    )
}