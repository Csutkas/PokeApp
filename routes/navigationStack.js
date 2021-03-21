/* React imports */
import React from 'react';

/* Navigation imports */
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

/* Screen imports */
import TypeScreen from "../screens/PokemonTypeScreen"
import DetailScreen from "../screens/PokemonDetailScreen"

import { COLORS, SIZES, FONTS } from '../constants/'

const Stack = createStackNavigator();

/* Stack navigator */
const AppStack = () => {
    return (
        <Stack.Navigator 
            initialRouteName="Type"
            screenOptions={{
                headerStyle: {
                    backgroundColor: COLORS.red,                                        
                },
                headerTintColor: COLORS.lightGray,
                headerTitleStyle: {
                    fontSize: SIZES.h3
                }
            }}            
        >   
            {/* Type stack */}
            <Stack.Screen 
                name="Type"
                component={TypeScreen}
                options={{ title: 'Pokemon Types'}}
            />
            
            {/*  Details stack */}
            <Stack.Screen 
                name="Details" 
                component={DetailScreen} 
                options={{
                    title: "Pokemon Details",
                    headerLeft: null,
                }}
            />
        </Stack.Navigator>
    )
}

/* Navigation Container */
function Navigation({navigation}){
    return (        
        <NavigationContainer>
            <AppStack/>
        </NavigationContainer>        
    )
}

export default Navigation;
