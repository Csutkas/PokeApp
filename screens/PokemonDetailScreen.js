import React, { useState, useEffect } from "react";
import {
    View,
    Text,    
    StyleSheet,
    Image
} from "react-native"

const DetailScreen = ({ route, navigation }) => {

    const { url } = route.params;

    /**
     * Hooks
     */
    const [detailedPokemon, setDetailedPokemon] = useState()

    /**
     * This useEffect call the pokemon API
     */
     useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => {                           
                setDetailedPokemon(data)                
            })
    }, [])

    console.log("Pokemon detailed:")
    //console.log(detailedPokemon.abilities)

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
            </View>
        )

    }

    return (
        <View style={{flex: 1}}>           
            
            {renderPokemonDetails()}
        </View>        
    )
}

/* Type screen style elements */
const styles = StyleSheet.create({
    typeScreenContainer: {        
    },
    
})

export default DetailScreen;