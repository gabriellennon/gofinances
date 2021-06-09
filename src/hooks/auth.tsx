import React, { createContext, ReactNode, useContext, useState } from 'react';
import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthProviderProps {
    children: ReactNode
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>
    signInWithApple(): Promise<void>
}

//valor inicial
const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<User>({} as User);

    async function signInWithGoogle(){
        try {
            const result = await Google.logInAsync({
                iosClientId: '884573335860-8gq7u5ogvqi4fcclisu6e1c0s6do0gvn.apps.googleusercontent.com',
                androidClientId: '884573335860-bs6o0rleq4sfbji76g7ge51vv0324kg9.apps.googleusercontent.com',
                //dizendo o que quero acessar do usuário
                scopes: ['profile', 'email']
            });

            if(result.type === 'success' ){
                const userLogged = {
                    id: String(result.user.id),
                    // ! = dizendo que sempre vai ter um email
                    email: result.user.email!,
                    name: result.user.name,
                    photo: result.user.photoUrl!
                };

                setUser(userLogged);
                await AsyncStorage.setItem('@gofinancces:user', JSON.stringify(userLogged));

                console.log(userLogged)
            }

        } catch (error) {
            //lancando esse erro pra minha interface pra quem chamar
            throw new Error(error)
        }
    }

    async function signInWithApple(){
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ]
            })

            if(credential){
                const userLogged = {
                    id: String(credential.user),
                    // ! = dizendo que sempre vai ter um email
                    email: credential.email!,
                    name: credential.fullName!.givenName,
                    photo: undefined
                };

                setUser(userLogged);
                await AsyncStorage.setItem('@gofinancces:user', JSON.stringify(userLogged));
            }

        } catch (error) {
            throw new Error(error);
        }
    }

    return (
        <AuthContext.Provider value={{ 
            user,
            signInWithGoogle,
            signInWithApple 
        }}>
            { children }
        </AuthContext.Provider>
    );
}

function useAuth(){
    const context = useContext(AuthContext);
    return context;
}

export { AuthProvider, useAuth  }