import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,    
    StyleSheet,
    TouchableWithoutFeedback,
    Modal,
    FlatList
} from "react-native"

import { TouchableOpacity} from 'react-native-gesture-handler'
import { SearchBar } from 'react-native-elements';

/**
 * This screen renders the pokemons by types
 * @param {* navigation} param0 
 * @returns 
 */
const TypeScreen = ( {navigation} ) => {

    /**
     * Hooks
     */
    const [types, setTypes] = useState()
    const [selectedType, setSelectedType] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)

    const [pokemons, setPokemons] = useState()    
    const [searchPokemons, setSearchPokemons] = useState()    
    const [selectedPokemon, setSelectedPokemon] = useState(null)

    /**
     * This useEffect call the type API
     */
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

                if(typeData.length > 0) {
                    let defaultData = typeData.filter(t => t.name == "normal")

                    if(defaultData.length > 0) {
                        setSelectedType(defaultData[0])
                    }
                }
            })
    }, [])

    //console.log("Pokemon types:")
    //console.log(types)


     /**
     * This function call the selected type API
     */
    function callPokemonTypeAPI() {
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
    }
    //console.log("Pokemons:")
    //console.log(pokemons)



    /**
     * This function renders the pokemon type selection form
     * @returns 
     */
    function renderTypeForm() {
        return (
            <View
                style={{
                    marginTop: 30,                    
                    marginHorizontal: 30
                }}
            >
                {/* Pokemon types */}
                <View style={{ marginTop: 20 }}>
                    <Text style={{ }}>Select Pokemon Types:</Text>

                    <View style={{flexDirection: 'row'}}>
                        {/* Types */}
                        <TouchableOpacity
                            style={{
                                width: 300,
                                height: 50,                            
                                borderColor: 'gray',
                                borderWidth: 1,
                                borderRadius: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-between'                                                             
                            }}
                            onPress={() => setModalVisible(true)}
                        >                                            
                            <View style={{ justifyContent: 'center', marginLeft: 20 }}>
                                <Text style={{ }}>{selectedType?.name}</Text>
                            </View>

                            <View style={{ justifyContent: 'center', marginRight: 20 }}>
                                <Text>Down</Text>
                            </View>
                        </TouchableOpacity>                                             
                    </View>                              
                </View>
            </View>
        )
    }

    /**
     * This render funtion handles the pokemon types in a modal view
     * @returns 
     */
    function renderPokeTypesModal() {
        const renderItem = ({item}) => {
            return (
                <TouchableOpacity
                    style={{ padding: 10, flexDirection: 'row' }}
                    onPress={() => {                        
                        setSelectedType(item)                        
                        setModalVisible(false)
                        callPokemonTypeAPI()
                    }}
                >                    
                    <Text>{item.name}</Text>
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
                                height: 400,
                                width: 300,                                
                                borderRadius: 5,
                                backgroundColor: 'gray'
                            }}
                        >
                            <FlatList
                                data={types}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.name}
                                showsVerticalScrollIndicator={false}
                                style={{
                                    padding: 10,
                                    marginBottom: 10,
                                }}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    /**
     * This function renders the pokemon names according the selected types
     * @returns 
     */
    function renderPokemons() {
        const renderItem = ({item}) => {
            return (
                <TouchableOpacity
                    style={{ padding: 10, flexDirection: 'row' }}
                    onPress={() => {                    
                    }}
                >                    
                    <Text style={{  }}>{item.name}</Text>
                </TouchableOpacity>
            )
        }

        return (
            <View
                style={{
                    marginTop: 20,                    
                }}    
            >
                <FlatList
                    data={pokemons}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    showsVerticalScrollIndicator={false}
                    style={{
                        padding: 10,
                        marginBottom: 10,
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
            console.log(searchData);
        } else {
            searchData = searchPokemons
        }

        setPokemons(searchData)
    };

    return (
        <SafeAreaView style={{flex: 1}}>            
            {renderTypeForm()}            
            {renderPokeTypesModal()}
            <View style={{marginVertical: 10}}>
                <SearchBar
                    placeholder="Search Pokemons.."
                    onChangeText={this.updateSearch}
                    value={pokemons}
                    lightTheme
                    clearIcon
                    showCancel
                />
            </View>
            {renderPokemons()}

            <TouchableOpacity                 
                onPress={() => navigation.navigate('Details')}
            >                            
                <Text>Details screen</Text>                
            </TouchableOpacity>
        </SafeAreaView>
    )
}


/**
 * Custom stylesheet for TypeScreen elements' style
 */
const styles = StyleSheet.create({
    typeScreenContainer: {        
    },
    
})

export default TypeScreen;