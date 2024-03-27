import React, {useEffect} from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Task from "../components/Task";
import { useNavigation } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";


const db = SQLite.openDatabase('mHike.db');

const HomePage = ({route, navigation}) => {
    const [rowsData, setRowsData] = useState([]);

    useEffect(() => {
      if (route.params?.success) {
        console.log(route.params?.success);
        readData();
      }
    }, [route.params?.success]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS tblHike (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT, hike_date TEXT, parking VARCHAR(3), length REAL, difficulty VARCHAR(128), description TEXT, additional1 TEXT, additional2 TEXT, additionalnum1 REAL, additionalnum2 REAL)'
      )
    });
    readData();

  }, []);

    const readData =() =>{
        db.transaction(tx => {
          // sending 4 arguments in executeSql
          tx.executeSql(
            'SELECT * FROM tblHike', null, // passing sql query and parameters:null
            // success callback which sends two things Transaction object and ResultSet Object
            (txObj, { rows: { _array } }) => {setRowsData(_array);},
            // failure callback which sends two things Transaction object and Error
            (txObj, error) => console.log('Error ', error)
            ) // end executeSQL
        });
    }

    return (
        <View>
            <View style={styles.tasksWarpper}>
                <Text style={styles.sectionTitle}>Hiking List</Text>

                <View style={styles.items}>
                {rowsData.map( item =>(
                    <Task
                        formData={{
                            name: item.name,
                            date: item.hike_date,
                            location: item.location,
                            parking: item.parking,
                            difficulty: item.difficulty,
                            description: item.description,
                            id: item.id
                        }}
                        onDelete={() =>{
                            readData();
                         }}
                        key={item.id}
                    />
                ))}
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}
                        onPress={() => {
                            navigation.navigate("EntryAndEdit", {
                                                                        name: "",
                                                                        date: "",
                                                                        location: "Yangon",
                                                                        parking: "No",
                                                                        difficulty: "Easy",
                                                                        description: "",
                                                                        id:null,
                                                                    });
                        }}
                    >+</Text>
                </TouchableOpacity>
            </View>
            {(rowsData && rowsData.length>0) &&
            <View style={styles.buttonContainer2}>
                <TouchableOpacity style={styles.button2}>
                    <Text style={styles.buttonText2}
                        onPress={() => {
                            db.transaction(tx => {
                                  tx.executeSql('DELETE FROM tblHike',
                                  null,
                                    (txObj, resultSet) => {
                                        readData();
                                    },
                                    (txObj, error) => console.log('Error', error))
                            });
                        }}
                    >Delete All</Text>
                </TouchableOpacity>
            </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E8EAED",
    },
    tasksWarpper: {
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: "900",
    },
    items: {
        marginTop: 30,
    },
    buttonContainer: {
        position: "absolute",
        bottom: -50,
        right: 20,
    },
    buttonContainer2: {
        position: "absolute",
        top: 10,
        right: 20,
    },
    button: {
        backgroundColor: "blue", // Customize button style
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
    },
    button2: {
        backgroundColor: "#dc3545", // Customize button style
        width: 100,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "white", // Customize button text style
        fontSize: 30,
        fontWeight: "bold",
    },
    buttonText2: {
        color: "white", // Customize button text style
        fontSize: 18,
        fontWeight: "normal",
    },
});

export default HomePage;
