/* React imports */
import React, { useState, useEffect } from "react";
import {
    View,
    Text,    
    StyleSheet,
    Image,
    FlatList,    
} from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";

/* Constant imports */
import { SIZES, FONTS, COLORS } from "../constants";
import FontAwesome from 'react-native-vector-icons/FontAwesome'

/**
 * This screen renders the details of the pokemon and let the user catch it
 * @param {route} param0 
 * @param {navigation} param1
 * @returns 
 */
const DetailScreen = ({ route, navigation }) => {

    const { url, catchedPokemons } = route.params;

    /** Hooks */
    const [detailedPokemon, setDetailedPokemon] = useState()
    const [catchPokemon, setCatchPokemon] = useState([])
    
    /** This useEffect call the pokemon API */
     useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => {                           
                setDetailedPokemon(data)                
            })
        setCatchPokemon(catchedPokemons)        
    }, [])

    /** This function handles the pokemon's not hidden ability visibility on the screen */
    function renderNotHiddenAbilities() {        
        const renderItem = ({item}) => {
            if (item.is_hidden == true) {
                return (
                    <Text style={styles.detailScreenDetailsTextStyle}>
                        Ability: {item.ability.name}
                    </Text>                    
                )
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

    /** This function handles the pokemon catch */
    function handlePokemonCatch() {
        if (catchPokemon.includes(detailedPokemon?.name)){
            return (
                <View style={styles.detailScreenButtonViewStyle}>
                    <TouchableOpacity 
                        style={styles.detailScreenCatchButtonStyle}
                        onPress={() => {                    
                            setCatchPokemon(catchPokemon.filter(catchPokemon => catchPokemon !== detailedPokemon?.name))                    
                        }}                
                    >
                        <Text style={styles.detailScreenCatchButtonLabelStyle}>Release</Text>
                    </TouchableOpacity>
                </View>
            )
        } else {
            return (
                <View style={styles.detailScreenButtonViewStyle}>
                    <TouchableOpacity 
                        style={styles.detailScreenCatchButtonStyle}
                        onPress={() => {
                            setCatchPokemon(catchPokemon => [...catchPokemon, detailedPokemon?.name])                        
                        }}
                    >
                        <Text style={styles.detailScreenCatchButtonLabelStyle}>Catch</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    /** This function renders the details of the pokemon */
    function renderPokemonDetails() {
        return(
            <View style={styles.detailScreenDetailsViewStyle}>
                {/* Pokemon front image */}
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
                
                {/* Pokemon name */}
                <Text style={styles.detailScreenPokemonNameStyle}>
                    {detailedPokemon?.name}
                </Text>

                {/* Pokemon height */}
                <Text style={styles.detailScreenDetailsTextStyle}>
                    Height: {detailedPokemon?.height}
                </Text>

                {/* Pokemon weight */}
                <Text style={styles.detailScreenDetailsTextStyle}>
                    Weight: {detailedPokemon?.weight}
                </Text>

                {/* Pokemon ability */}
                {renderNotHiddenAbilities()}
            </View>
        )

    }

    /** This function handles the back button with the post back parameters */
    function renderBackButton() {
        return (
            <View style={styles.detailScreenButtonViewStyle}>
                <TouchableOpacity
                    style={styles.detailScreenBackButtonStyle}
                    onPress={() => navigation.navigate('Type', { catch: catchPokemon })}
                >   
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome 
                            name="chevron-left" 
                            size={16}
                            style={styles.detailScreenBackButtonIconStyle}
                        />
                        <Text style={styles.detailScreenBackButtonLabelStyle}>Pokemons</Text>
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

/* Detail screen style elements */
const styles = StyleSheet.create({
    detailScreenDetailsViewStyle: {
        flexDirection: 'column', 
        marginHorizontal: SIZES.padding * 2,
        marginBottom: SIZES.padding,
    },
    detailScreenDetailsTextStyle: {
        ...FONTS.body2,        
    },
    detailScreenPokemonNameStyle: {
        ...FONTS.h1,
        textTransform: 'capitalize',
        marginBottom: SIZES.padding * 2
    },  
    detailScreenCatchButtonStyle: {
        height: 48,
        backgroundColor: COLORS.transparent,
        borderColor: COLORS.lightblack,
        borderWidth: 0.5,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center'
    },
    detailScreenButtonViewStyle: {
        marginHorizontal: SIZES.padding * 2, 
        marginTop: SIZES.padding
    },
    detailScreenCatchButtonLabelStyle: {
        color: COLORS.black, ...FONTS.h3, 
        fontWeight: "600"
    },
    detailScreenBackButtonStyle: {
        height: 50,
        backgroundColor: COLORS.lightRed,
        borderRadius: SIZES.radius,
        alignItems: 'center',
        justifyContent: 'center'
    },
    detailScreenBackButtonLabelStyle: {
        color: COLORS.lightGray, ...FONTS.h3, 
        fontWeight: "600"
    },
    detailScreenBackButtonIconStyle: {
        color: COLORS.lightGray, 
        marginRight: SIZES.padding * 1.5
    }
})

export default DetailScreen;