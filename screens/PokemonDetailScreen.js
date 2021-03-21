/* React imports */
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

/* Constant imports */
import { SIZES, FONTS, COLORS } from "../constants";
import FontAwesome from 'react-native-vector-icons/FontAwesome'

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

    function renderNotHiddenAbilities() {        
        const renderItem = ({item}) => {
            if (item.is_hidden == true) {
                return (
                    <Text style={{ ...FONTS.body2}}>Ability: {item.ability.name}</Text>                    
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
                />
            </View>
        )
    }

    function handlePokemonCatch() {
        if (catchPokemon.includes(detailedPokemon?.name)){
            return (
                <View style={{ marginHorizontal: SIZES.padding * 2, marginTop: SIZES.padding * 1.5 }}>
                    <TouchableOpacity 
                        style={{
                            height: 50,
                            backgroundColor: COLORS.transparent,
                            borderColor: COLORS.lightblack,
                            borderWidth: 0.5,
                            borderRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => {                    
                            setCatchPokemon(catchPokemon.filter(catchPokemon => catchPokemon !== detailedPokemon?.name))                    
                        }}                
                    >
                        <Text style={{ color: COLORS.black, ...FONTS.h3, fontWeight: "600" }}>Release</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={{ marginHorizontal: SIZES.padding * 2, marginTop: SIZES.padding * 1.5 }}>
                    <TouchableOpacity 
                        style={{
                            height: 50,
                            backgroundColor: COLORS.transparent,
                            borderColor: COLORS.lightblack,
                            borderWidth: 0.5,
                            borderRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        onPress={() => {
                            setCatchPokemon(catchPokemon => [...catchPokemon, detailedPokemon?.name])                        
                        }}
                    >
                        <Text style={{ color: COLORS.black, ...FONTS.h3, fontWeight: "600" }}>Catch</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    function renderPokemonDetails() {
        return(
            <View style={{ flexDirection: 'column', marginHorizontal: SIZES.padding * 2 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                    <Image
                        source={{ uri: detailedPokemon?.sprites.front_default }}
                        resizeMode='contain'
                        style={{
                            width: 280,
                            height: 280,
                        }}
                    />
                </View>
                
                <Text style={{ ...FONTS.h1, textTransform: 'capitalize', marginBottom: SIZES.padding * 1.5}}>
                    {detailedPokemon?.name}
                </Text>
                <Text style={{ ...FONTS.body2}}>
                    Height: {detailedPokemon?.height}
                </Text>
                <Text style={{ ...FONTS.body2}}>
                    Weight: {detailedPokemon?.weight}
                </Text>
                {renderNotHiddenAbilities()}
            </View>
        )

    }

    function renderBackButton() {
        return (
            <View style={{ margin: SIZES.padding * 2 }}>
                <TouchableOpacity
                    style={{
                        height: 50,
                        backgroundColor: COLORS.lightRed,
                        borderRadius: SIZES.radius,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => navigation.navigate('Type', { catch: catchPokemon })}
                >   
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome 
                            name="chevron-left" 
                            size={16}
                            style={{color: COLORS.lightGray, marginRight: SIZES.padding * 1.5}}
                        />
                        <Text style={{ color: COLORS.lightGray, ...FONTS.h3, fontWeight: "600" }}>Pokemons</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{flex: 1}}>                              
            {renderPokemonDetails()}            
            {handlePokemonCatch()}
            {renderBackButton()}            
        </View>        
    )
}

/* Type screen style elements */
const styles = StyleSheet.create({
    typeScreenContainer: {        
    },
    
})

export default DetailScreen;