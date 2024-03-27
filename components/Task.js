import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('mHike.db');

const Task = ({ formData, onDelete }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                {/* <TouchableOpacity style={styles.square}></TouchableOpacity> */}
                <View style={styles.textContainer}>
                    <Text style={styles.itemText}>
                        <Text style={styles.boldText}>Name: </Text>
                        {formData.name}
                    </Text>
                    <Text style={styles.itemText}>
                        <Text style={styles.boldText}>Date: </Text>{" "}
                        {formData.date}
                    </Text>
                    <Text style={styles.itemText}>
                        <Text style={styles.boldText}>Location: </Text>{" "}
                        {formData.location}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <Button
                            style={styles.buttonStyle}
                            onPress={() => {
                                navigation.navigate("EntryAndEdit", formData);
                            }}
                            title="Edit"
                            color="#007bff"
                            accessibilityLabel="Learn more about this purple button"
                        />
                        <Text> </Text>
                        <Button
                            style={styles.buttonStyle}
                            onPress={() => {
                                db.transaction(tx => {
                                      tx.executeSql('DELETE FROM tblHike where id=?',
                                      [formData.id],
                                        (txObj, resultSet) => {
                                            onDelete();
                                        },
                                        (txObj, error) => console.log('Error', error))
                                });
                            }}
                            title="Delete"
                            color="#dc3545"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    square: {
        width: 24,
        height: 24,
        backgroundColor: "#55BCF6",
        opacity: 0.4,
    },
    textContainer: {
        marginLeft: 10, // Add some spacing between the square and text
    },
    itemText: {
        marginBottom: 5, // Add some margin between each piece of text
    },
    boldText: {
        fontWeight: "bold", // Make the text bold
    },
    buttonContainer: {
        marginTop: 10, // Add spacing between text and buttons
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10, // Add 20px space to the left of the first button
        marginRight: 10, // Add 20px space to the right of the second button
    },
    buttonStyle: {
        borderRadius: 20,
    },
});

export default Task;
