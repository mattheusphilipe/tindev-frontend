import {createAppContainer, 
    createSwitchNavigator, //  cria navegação entre duas telas sem qualquer tipo de feedback visual
} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack'; // cria um cabeçalho para navegação para tela anterior

import Main from './pages/main';
import Login from './pages/login';

export default createAppContainer( 
    //  Navegação da aplicação
  createSwitchNavigator({
    Login,
    Main,
  }),
);
