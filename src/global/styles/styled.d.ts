//Arquivo para sobrescrever tipos

import 'styled-components';
import theme from './theme';

declare module 'styled-components' {
    //dizendo que meu type Theme vai ter a mesma coisa de theme (passe o mouse emcima de ThemeType)
    type ThemeType = typeof theme

    export interface DefaultTheme extends ThemeType {}
}