import React, { useEffect, useState } from 'react';
import { HistoryCard } from '../../components/HistoryCard';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    Container, 
    Header, 
    Title, 
    Content, 
    ChartContainer 
} from './styles';
import { categories } from '../../utils/categories';
import { ScrollView } from 'react-native-gesture-handler';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components'

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
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();

    async function loadData(){
        const dataKey = '@gofinances:transactions';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted.filter((expensive: TransactionData) => expensive.type === 'negative');




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
    }

    useEffect(() => {
        loadData();
    }, []);

    return(
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            <Content >
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
        </Container>
    )
}