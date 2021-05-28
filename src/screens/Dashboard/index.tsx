import React from 'react';
import {} from 'react-native';
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
    HighlightCards
} from './styles';

import { HighlightCard } from '../../components/HighlightCard';

export function Dashboard(){
    return(
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri:  'https://avatars.githubusercontent.com/u/57332512?v=4' }} />
                        <User>
                            <UserGreeting>Olá, </UserGreeting>
                            <UserName>Gabriel</UserName>
                        </User>
                    </UserInfo>
                    <Icon name="power" />
                </UserWrapper>
            </Header>

            <HighlightCards
                // ddeixar eles lado a lado
                // horizontal
                // para ocultar a barrinha horizontal que aparece
                // showsHorizontalScrollIndicator={false}
                // contentContainerStyle={{ paddingHorizontal: 24 }}
            >
                <HighlightCard />
                <HighlightCard />
                <HighlightCard />
            </HighlightCards>
        </Container>
    )
}
