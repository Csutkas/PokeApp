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
import { colors, SearchBar } from 'react-native-elements'
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
            <View style={styles.typeScreenFormViewStyle}>
                {/* Pokemon types */}
                <View>
                    {/* Pokemnos Types Label */}
                    <Text style={styles.typeScreenPokemonTypesLabelStyle}>Select Pokemon Types:</Text>

                    {/* Pokemon Types Selection Form */}
                    <View style={styles.typeScreenSelectionFormViewStyle}>                        
                        <TouchableOpacity
                            style={styles.typeScreenFormTouchableStyle}
                            onPress={() => setModalVisible(true)}
                        >   
                            {/* Form label */}                               
                            <View style={styles.typeScreenFormLabelViewStyle}>
                                <Text style={styles.typeScreenFormLabelStyle}>{selectedType?.name}</Text>
                            </View>
                            
                            {/* Form label icon */}
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
    function renderPokemonTypesModal() {
        const renderItem = ({item}) => {
            return (
                <TouchableOpacity
                    style={styles.typeScreenModalItemTouchableStyle}
                    onPress={() => {                        
                        setSelectedType(item)                        
                        setModalVisible(false)                        
                    }}
                >   
                    {/* Pokemon types from api call in modal */}                 
                    <Text style={styles.typeScreenModalItemTextStyle}>
                        {item.name}
                    </Text>
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
                    <View style={styles.typeScreenModalStyle}>
                        <View
                            style={styles.typeScreenModalViewStyle}
                        >                               
                            <FlatList
                                data={types}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.name}
                                showsVerticalScrollIndicator={true}
                                style={styles.typeScreenModalFlatListStyle}
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
                <Text style={styles.typeScreenCatchedLabelStyle}>Catched</Text>
            )
        }
    }

    /** This function renders the pokemon names according the selected types */
    function renderPokemons() {
        const renderItem = ({item}) => {
            return (
                <TouchableOpacity
                    style={styles.typeScreenPokemonLineTouchableStyle}
                    onPress={() => {  
                        navigation.navigate('Details', { url: item.url, catchedPokemons: catchedPokemons})
                    }}
                >
                    <View style={{flexDirection: 'row'}}>
                        <Image
                            source={images.pokeball}
                            style={styles.typeScreenPokemonLineImageStyle}
                        />
                        <Text style={styles.typeScreenPokemonLineTextStyle}>{item.name}</Text>
                    </View>               
                    
                    {renderCatch(item.name)}
                </TouchableOpacity>
            )
        }

        return (
            <View
                style={styles.typeScreenPokemonLineViewStyle}    
            >
                <FlatList
                    data={pokemons}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    showsVerticalScrollIndicator={false}
                    style={styles.typeScreenPokemonLineFlatListStyle}
                />
            </View>
        )
    }

    /** Searchbar filter function - filters the pokemons according to the given letters included in pokemnon name */
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

    /** This function renders the searchbar for filter pokemons */
    function renderSearchBar() {
        return (
            <View style={styles.typeScreenSearchViewStyle}>
                <View style={styles.typeScreenSearchBarViewStyle}>
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
                <View style={styles.typeScreenCatchedViewStyle}>
                    <Image
                        source={images.green_pokeball}
                        style={styles.typeScreenCatchedImageStyle}
                    />
                    <Text style={styles.typeScreenPokemonLineTextStyle}>{item}</Text>    
                </View>
            )            
        }
    
        const renderCatchedPokemonList = () => {
            return(
                <View>
                    <Text style={styles.typeScreenCatchedTitleStyle}>Your catched pokemons:</Text>
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
                    <Text style={styles.typeScreenNoCatchedTextStyle}>
                        {catchedPokemons.length > 0 ? renderCatchedPokemonList() : "No catched pokemons"}
                    </Text>
                </View>                                
            )        
        }
    }

    /** This function renders the checkbox for enabling catched pokemon view */
    function renderCheckBox() {
        return (
            <View style={{marginHorizontal: 20}}>
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
            {renderPokemonTypesModal()}            
            {renderSearchBar()}            
            {renderCatchedPokemons()}
            {renderPokemons()}            
        </SafeAreaView>
    )
}


/** Custom stylesheet for TypeScreen elements' style */
const styles = StyleSheet.create({
    typeScreenPokemonTypesLabelStyle:{ 
        marginBottom: SIZES.padding, ...FONTS.h3, 
        fontWeight: "300", 
        paddingLeft: SIZES.padding * 0.2 
    },
    typeScreenFormViewStyle: {            
        marginTop: SIZES.padding * 2,
        marginHorizontal: SIZES.padding * 2                    
    },
    typeScreenSelectionFormViewStyle: {
        flexDirection: 'row', 
        justifyContent: 'center'
    },
    typeScreenFormTouchableStyle: {
        width: SIZES.width * 0.9,
        height: 50,                            
        borderColor: COLORS.gray,
        borderWidth: 1,
        borderRadius: SIZES.radius,
        flexDirection: 'row',
        justifyContent: 'space-between'                                                             
    },
    typeScreenFormLabelViewStyle: { 
        justifyContent: 'center', 
        marginLeft: 20 
    },
    typeScreenFormLabelStyle: { 
        ...FONTS.body2, 
        color: COLORS.black, 
        fontWeight: "500"
    },
    typeScreenModalItemTouchableStyle: { 
        padding: SIZES.padding, 
        flexDirection: 'row',
        borderBottomColor: COLORS.lightGray,
        borderBottomWidth: 0.5, 
    },
    typeScreenModalItemTextStyle: {
         color: COLORS.black, 
         ...FONTS.body3
        },
    typeScreenModalStyle: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    typeScreenModalViewStyle: {
        height: SIZES.height * 0.52,
        width: SIZES.width * 0.9,
        borderRadius: 5,
        backgroundColor: COLORS.lightRed
    },
    typeScreenModalFlatListStyle: {
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
    },
    typeScreenCatchedLabelStyle: {
        ...FONTS.body3, 
        color: COLORS.green
    },
    typeScreenPokemonLineTouchableStyle: { 
        padding: SIZES.padding, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    typeScreenPokemonLineImageStyle: {
        width: 30,
        height: 30
    },
    typeScreenPokemonLineTextStyle: { 
        marginLeft: SIZES.padding * 1.5, 
        ...FONTS.body2, fontWeight: "300", 
        textTransform: 'capitalize'
    },
    typeScreenPokemonLineViewStyle: {   
        marginBottom: SIZES.padding * 17,
        marginHorizontal: SIZES.padding 
    },
    typeScreenPokemonLineFlatListStyle: {
        marginTop: SIZES.padding,
    },
    typeScreenSearchViewStyle: {
        marginVertical: 10, 
        flexDirection: 'row', 
        alignItems:'center',
         marginHorizontal: SIZES.padding * 2
    },
    typeScreenSearchBarViewStyle: { 
        width: SIZES.width * 0.75
    },
    typeScreenCatchedViewStyle: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginVertical: SIZES.padding * 0.35
    },
    typeScreenCatchedImageStyle: {
        width: 40,
        height: 40,
    },
    typeScreenCatchedTitleStyle: {
        ...FONTS.h3, 
        fontWeight: "300", 
        marginVertical: SIZES.padding, 
        marginLeft: SIZES.padding * 0.3
    },
    typeScreenNoCatchedTextStyle: { 
        marginHorizontal: SIZES.padding * 2, 
        marginTop: SIZES.padding,
        ...FONTS.body3,
        color: COLORS.lightblack,
    }
})

export default TypeScreen;