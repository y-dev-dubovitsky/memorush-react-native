import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, HelperText } from 'react-native-paper';

const CardSetInputForm = ({ cardSetEntityFormInputHandler, values }) => {

  const validateTitleHandler = () => {
    return values.name.length == 0;
  }

  const validateCategoryHandler = () => {
    return values.categoryName.length == 0;
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={values.name}
            onChangeText={text => cardSetEntityFormInputHandler("name", text)}
            outlineColor="#E2E8F0"
            activeOutlineColor="#18BBF1"
            theme={{ 
              colors: { 
                primary: '#18BBF1', 
                background: '#FFFFFF',
                surface: '#FFFFFF'
              },
              roundness: 12
            }}
            placeholder="Enter set title..."
          />
          <HelperText type="error" visible={validateTitleHandler()} style={styles.helperText}>
            Title is required
          </HelperText>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category *</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={values.categoryName}
            onChangeText={text => cardSetEntityFormInputHandler("categoryName", text)}
            outlineColor="#E2E8F0"
            activeOutlineColor="#18BBF1"
            theme={{ 
              colors: { 
                primary: '#18BBF1', 
                background: '#FFFFFF',
                surface: '#FFFFFF'
              },
              roundness: 12
            }}
            placeholder="Enter category..."
          />
          <HelperText type="error" visible={validateCategoryHandler()} style={styles.helperText}>
            Category is required
          </HelperText>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={values.tags}
            onChangeText={text => cardSetEntityFormInputHandler("tags", text)}
            outlineColor="#E2E8F0"
            activeOutlineColor="#18BBF1"
            theme={{ 
              colors: { 
                primary: '#18BBF1', 
                background: '#FFFFFF',
                surface: '#FFFFFF'
              },
              roundness: 12
            }}
            placeholder="math, science, history..."
          />
          <HelperText type="info" style={styles.helperText}>
            Separate tags with commas
          </HelperText>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            mode="outlined"
            style={[styles.input, styles.description]}
            value={values.description}
            onChangeText={text => cardSetEntityFormInputHandler("description", text)}
            outlineColor="#E2E8F0"
            activeOutlineColor="#18BBF1"
            multiline={true}
            numberOfLines={3}
            theme={{ 
              colors: { 
                primary: '#18BBF1', 
                background: '#FFFFFF',
                surface: '#FFFFFF'
              },
              roundness: 12
            }}
            placeholder="Describe your flashcard set..."
          />
          <HelperText type="info" style={styles.helperText}>
            Optional description for your set
          </HelperText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  description: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default CardSetInputForm;