import React, { useState, useEffect } from "react";
import {
    View,
    Text,    
    StyleSheet,
    Image,
    FlatList,
    Button
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";

const DetailScreen = ({ route, navigation }) => {

    const { url, catchedPokemons } = route.params;

    /**
     * Hooks
     */
    const [detailedPokemon, setDetailedPokemon] = useState()
    const [catchPokemon, setCatchPokemon] = useState([])
    

    /**
     * This useEffect call the pokemon API
     */
     useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => {                           
                setDetailedPokemon(data)                
            })
        setCatchPokemon(catchedPokemons)        
    }, [])

    console.log("Cage Detailedscreen:")    
    console.log(catchPokemon)

    function renderNotHiddenAbilities() {        
        const renderItem = ({item}) => {
            if (item.is_hidden == true) {
                return (
                    <View
                        style={{ padding: 10, flexDirection: 'row' }}                    
                    >                    
                        <Text>{item.ability.name}</Text>
                    </View>
                )
            } else {
                return
            }        
            
        }

        return (
            <View>
                <FlatList
                    data={detailedPokemon?.abilities}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.slot}
                    showsVerticalScrollIndicator={false}
                    style={{
                        padding: 10,
                        marginBottom: 10,
                    }}
                />
            </View>
        )
    }

    function handlePokemonCatch() {
        if (catchPokemon.includes(detailedPokemon?.name)){
            return (
                <TouchableOpacity 
                    style={{ marginHorizontal: 20, marginVertical: 20}}                                
                    onPress={() => {                    
                        setCatchPokemon(catchPokemon.filter(catchPokemon => catchPokemon !== detailedPokemon?.name))                    
                    }}                
                >
                    <Text>Release</Text>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity 
                    style={{ marginHorizontal: 20, marginVertical: 20}}                                
                    onPress={() => setCatchPokemon(catchPokemon => [...catchPokemon, detailedPokemon?.name])}                
                >
                    <Text>Catch</Text>
                </TouchableOpacity>
            )
        }
    }

    function renderPokemonDetails() {
        return(
            <View style={{ flexDirection: 'column', marginHorizontal: 20}}>
                <Image
                    source={{ uri: detailedPokemon?.sprites.front_default }}
                    resizeMode='contain'
                    style={{
                        width: 200,
                        height: 200,
                    }}
                />
                <Text>
                    {detailedPokemon?.name}
                </Text>
                <Text>
                    {detailedPokemon?.height}
                </Text>
                <Text>
                    {detailedPokemon?.weight}
                </Text>
                {renderNotHiddenAbilities()}
            </View>
        )

    }

    return (
        <View style={{flex: 1}}>           
            {handlePokemonCatch()}            
            {renderPokemonDetails()}
            <Text>Catched pokemons:</Text>
            <Text>{catchPokemon}</Text>
            <Button
                title="Done"
                onPress={() => {
                // Pass params back to type screen
                navigation.navigate('Type', { catch: catchPokemon });
                }}
            />

        </View>        
    )
}

/* Type screen style elements */
const styles = StyleSheet.create({
    typeScreenContainer: {        
    },
    
})

export default DetailScreen;