import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

//Acessando o contexto pra saber se o usuario está autenticado ou nao
import { useAuth } from '../hooks/auth';

export function Routes(){
    const { user } = useAuth();

    return(
        <NavigationContainer>
            {/* Se o usuario estiver autenticado eu mando ele pra tela inicial */}
            {
                user.id ? <AppRoutes/> : <AuthRoutes />
            }
        </NavigationContainer>
    );
}