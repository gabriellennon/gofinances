import React from 'react';
import { categories } from '../../utils/categories';

import { 
    Container ,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date
} from './styles';

export interface TransationCardProps {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;

}

interface Props {
    data: TransationCardProps;
}

export function TransactionCard({ data }: Props){
    const categoryConst = categories.filter(
        item => item.key === data.category
    )[0];

    return(
        <Container>
            <Title>{data.name}</Title>

            <Amount type={data.type}>
                { data.type === 'negative' && '- ' }
                { data.amount }
            </Amount>

            <Footer>
                <Category>
                    <Icon name={categoryConst.icon} />
                    <CategoryName>{categoryConst.name}</CategoryName>
                </Category>
                <Date>{data.date}</Date>
            </Footer>
        </Container>
    )
}