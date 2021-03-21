import React, { useState, useEffect } from "react";
import {
    View,
    Text,    
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
    FlatList
} from "react-native"


const TypeScreen = ( {navigation} ) => {

    const [types, setTypes] = useState()
    const [modalVisible, setModalVisible] = useState(false)

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

    console.log("Pokemon types:")
    console.log(types)

    function renderTypeForm() {
        return (
            <View
                style={{
                    marginTop: 30,
                    marginHorizontal: 30
                }}
            >

                {/* Phone Number */}
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
                                flexDirection: 'row',
                                justifyContent:'flex-end'                             
                            }}
                            onPress={() => setModalVisible(true)}
                        >
                            <View style={{ justifyContent: 'center' }}>
                                <Text>Down</Text>
                            </View>
                            
                           

                        </TouchableOpacity>

                                             
                    </View>                              
                </View>
            </View>
        )
    }

    function renderPokeTypesModal() {
        const renderItem = ({item}) => {
            return (
                <TouchableOpacity
                    style={{ padding: 10, flexDirection: 'row' }}
                    onPress={() => {
                        //setSelectedArea(item)
                        setModalVisible(false)
                    }}
                >                    
                    <Text style={{  }}>{item.name}</Text>

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
                                keyExtractor={(item) => item.code}
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

    return (
        <View style={{flex: 1}}>           
            <Text>Type screen</Text>
            <TouchableOpacity                 
                onPress={() => navigation.navigate('Details')}
            >                            
                <Text>Details screen</Text>                
            </TouchableOpacity>

            {renderTypeForm()}
            {renderPokeTypesModal()}
        </View>
    )
}

/* Type screen style elements */
const styles = StyleSheet.create({
    typeScreenContainer: {        
    },
    
})

export default TypeScreen;