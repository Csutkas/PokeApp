/* React imports */
import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    View,
    Text,    
    StyleSheet,
    TouchableWithoutFeedback,
    Modal,
    FlatList,    
} from 'react-native'

import { TouchableOpacity} from 'react-native-gesture-handler'
import { SearchBar } from 'react-native-elements'
import CheckBox from '@react-native-community/checkbox'

/* Constant imports */
import { COLORS, SIZES, FONTS, images } from '../constants/'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Image } from 'react-native'

/**
 * This screen renders the pokemons by types
 * @param {* navigation} param0
 * @param {* route} param1 
 * @returns 
 */
const TypeScreen = ( {navigation, route} ) => {

    /** Hooks */
    const [types, setTypes] = useState()
    const [selectedType, setSelectedType] = useState("normal")
    const [modalVisible, setModalVisible] = useState(false)

    const [pokemons, setPokemons] = useState()
    const [searchPokemons, setSearchPokemons] = useState()    
    const [catchedPokemons, setCatchedPokemons] = useState([])        
    
    const [toggleCheckBox, setToggleCheckBox] = useState(false)

    /** This useEffect call the type API */
    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/type/")
            .then(response => response.json())
            .then(data => {
                let result = data.results                
                let typeData = result.map(item => {
                    return {
                        name: item.name,
                        url: item.url
                    }
                })
                setTypes(typeData)                
            })
    }, [])

     /**
     * This useEffect call the selected type API only if type changed
     */
    useEffect(() =>{
        fetch(selectedType.url)
            .then(response => response.json())
            .then(data => {
                let pokes = data.pokemon  
                let pokeTypeData = pokes.map(item => {
                    return {
                        name: item.pokemon.name,
                        url: item.pokemon.url
                    }
                })
                setPokemons(pokeTypeData)  
                setSearchPokemons(pokeTypeData)
            })
    }, [selectedType])

    /** Get parameter from Pokemon screen */
    useEffect(() => {
        if (route.params?.catch) {
            setCatchedPokemons(route.params?.catch)
            
        }
      }, [route.params?.catch]);


    /** This function renders the pokemon type selection form */
    function renderTypeForm() {
        return (
            <View
                style={{            
                    marginTop: SIZES.padding * 2,
                    marginHorizontal: SIZES.padding * 2
                    
                }}
            >
                {/* Pokemon types */}
                <View>
                    {/* Pokemnos Types Label */}
                    <Text style={{ marginBottom: SIZES.padding, ...FONTS.h3, fontWeight: "300", paddingLeft: SIZES.padding * 0.2 }}>Select Pokemon Types:</Text>

                    {/* Pokemon Types Selection Form */}
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>                        
                        <TouchableOpacity
                            style={{
                                width: SIZES.width * 0.9,
                                height: 50,                            
                                borderColor: COLORS.gray,
                                borderWidth: 1,
                                borderRadius: SIZES.radius,
                                flexDirection: 'row',
                                justifyContent: 'space-between'                                                             
                            }}
                            onPress={() => setModalVisible(true)}
                        >                                            
                            <View style={{ justifyContent: 'center', marginLeft: 20 }}>
                                <Text style={{ ...FONTS.body2, color: COLORS.black, fontWeight: "500"}}>{selectedType?.name}</Text>
                            </View>

                            <View style={{ justifyContent: 'center', marginRight: 20 }}>                                
                                <FontAwesome 
                                    name="chevron-down" 
                                    size={18}
                                    style={{color: COLORS.gray}}
                                />
                            </View>
                        </TouchableOpacity>                                             
                    </View>                              
                </View>
            </View>
        )
    }

    /** This render funtion handles the pokemon types in a modal view */
    function renderPokeTypesModal() {
        const renderItem = ({item}) => {
            return (
                <TouchableOpacity
                    style={{ padding: SIZES.padding, flexDirection: 'row',borderBottomColor: COLORS.gray,
                    borderBottomWidth: 0.5, }}
                    onPress={() => {                        
                        setSelectedType(item)                        
                        setModalVisible(false)                        
                    }}
                >                    
                    <Text
                        style={{ color: COLORS.black, ...FONTS.body3}}
                    >{item.name}</Text>
                </TouchableOpacity>
            )
        }

        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => setModalVisible(false)}
                >
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View
                            style={{
                                height: SIZES.height * 0.5,
                                width: SIZES.width * 0.9,                                
                                borderRadius: 5,
                                backgroundColor: COLORS.mediumgray
                            }}
                        >                               
                            <FlatList
                                data={types}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.name}
                                showsVerticalScrollIndicator={true}
                                style={{
                                    padding: SIZES.padding,
                                    marginBottom: SIZES.padding,
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    /** This function renders the catch label if pokemon is catched*/ 
    function renderCatch(pokemon) {        
        if (catchedPokemons.includes(pokemon)){
            return (
                <Text style={{...FONTS.body3, color: COLORS.green}}>Catched</Text>
            )
        }
    }

    /** This function renders the pokemon names according the selected types */
    function renderPokemons() {
        const renderItem = ({item}) => {
            return (
                <TouchableOpacity
                    style={{ padding: SIZES.padding, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                    onPress={() => {  
                        navigation.navigate('Details', { url: item.url, catchedPokemons: catchedPokemons})
                    }}
                >
                    <View style={{flexDirection: 'row'}}>
                        <Image
                            source={images.pokeball}
                            style={{
                                width: 30,
                                height: 30
                            }}
                        />
                        <Text style={{ marginLeft: SIZES.padding * 1.5, ...FONTS.body2, fontWeight: "300", textTransform: 'capitalize'}}>{item.name}</Text>
                    </View>               
                    
                    {renderCatch(item.name)}
                </TouchableOpacity>
            )
        }

        return (
            <View
                style={{   
                    marginBottom: SIZES.padding * 17,
                    marginHorizontal: SIZES.padding 
                }}    
            >
                <FlatList
                    data={pokemons}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    showsVerticalScrollIndicator={false}
                    style={{
                        marginTop: SIZES.padding,                        
                    }}
                />
            </View>
        )
    }

    /**
     * Searchbar filter function - filters the pokemons according to the given letters included in pokemnon name
     */
    updateSearch = (search) => {
        if (search != '') {
            searchData = pokemons.filter(function(item){
            return item.name.toLowerCase().includes(search.toLowerCase());
            }).map(function({ name}){
                return {name};
            });            
        } else {
            searchData = searchPokemons
        }

        setPokemons(searchData)
    };

    /**
     * This function renders the searchbar for filter pokemons
     * @returns 
     */
    function renderSearchBar() {
        return (
            <View style={{marginVertical: 10, flexDirection: 'row', alignItems:'center', marginHorizontal: SIZES.padding * 2}}>
                <View style={{ width: SIZES.width * 0.75}}>
                    <SearchBar
                        placeholder="Search Pokemons.."
                        onChangeText={this.updateSearch}
                        value={pokemons}
                        lightTheme
                        containerStyle={{backgroundColor: COLORS.darkgray, borderRadius: SIZES.radius, padding: SIZES.padding * 0.13}}
                        inputContainerStyle={{backgroundColor: COLORS.lightGray}}
                        inputStyle={{color: COLORS.black}}
                        clearIcon                        
                        showCancel
                    />
                </View>
                
                {renderCheckBox()}
            </View>
        )
    }


    
    /** This function renders the catched pokemons in case of checkbox checked */
    function renderCatchedPokemons() {        
        const renderItem = ({item}) => {
            return(
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: SIZES.padding * 0.3}}>
                    <Image
                        source={images.green_pokeball}
                        style={{
                            width: 40,
                            height: 40,
                        }}
                    />
                    <Text style={{marginLeft: SIZES.padding * 1.5, ...FONTS.body2, fontWeight: "300", textTransform: 'capitalize'}}>{item}</Text>    
                </View>
                
            )            
        }
    
        const renderCatchedPokemonList = () => {
            return(
                <View>
                    <Text style={{...FONTS.h3, fontWeight: "300", marginVertical: SIZES.padding, marginLeft: SIZES.padding * 0.3}}>Your catched pokemons:</Text>
                    <FlatList
                        data={catchedPokemons}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.value}
                        showsVerticalScrollIndicator={false}
                        
                    />
                </View>
            )
        }

        if (toggleCheckBox == true) {
            return(
                <View>
                    <Text style={{ marginHorizontal: SIZES.padding * 2, marginTop: SIZES.padding}}>
                        {catchedPokemons.length > 0 ? renderCatchedPokemonList() : "No catched pokemons"}
                    </Text>
                </View>                
                
            )        
        }
    }

    /** This function renders the checkbox for enabling catched pokemon view */
    function renderCheckBox() {
        return (
            <View
                style={{marginHorizontal: 20}}
            >
                <CheckBox
                    disabled={false}
                    value={false}                    
                    onAnimationType='fill'
                    offAnimationType='fill'
                    animationDuration={0.1}
                    boxType='square'
                    lineWidth={1.5}                    
                    onValueChange={(newValue) => setToggleCheckBox(newValue)}                    
                />
            </View>            
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightGray}}>
            {renderTypeForm()}            
            {renderPokeTypesModal()}            
            {renderSearchBar()}            
            {renderCatchedPokemons()}
            {renderPokemons()}            
        </SafeAreaView>
    )
}


/** Custom stylesheet for TypeScreen elements' style */
const styles = StyleSheet.create({
    typeScreenContainer: {        
    },
    
})

export default TypeScreen;