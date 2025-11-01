import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { HelperText } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from "react-redux";
import { authSelector, registration } from "../../redux/features/auth/auth-slice";
import ButtonComponent from "../../common/components/button/button.component";
import TextInputComponent from "../sign-in/atomic-components/text-input.component";

const IMAGE_PATH = "./images/adaptive-icon.png";

const RegistrationScreen = (props) => {

  const dispatch = useDispatch();
  const [formData, setFormData] = useState();
  const { authEntity, error, status } = useSelector(authSelector);

  useEffect(() => {
    if (status === "register") {
      props.navigation.navigate("SignInScreen");
    }
  }, [status])

  const formInputHandler = ({ name, value }) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const onRegisterFormHandler = () => {
    dispatch(registration(formData));
  }

  const validateEmailHandler = () => {
    if (formData != undefined && formData.email != undefined) {
      return formData?.email.includes("@") ? 0 : 1;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.ellipseContainer}>
          <Image
            style={styles.tinyLogo}
            source={require(IMAGE_PATH)}
          />
        </View>
        <View style={styles.scrollViewContainer}>
          <ScrollView>
            <View style={styles.inputTextContainer}>
              <Text>Username</Text>
              <TextInputComponent
                placeholder="Username"
                name="username"
                formInputHandler={formInputHandler}
                style={styles.materialStackedLabelTextbox2}
              >
              </TextInputComponent>
              <Text>Password</Text>
              <TextInputComponent
                placeholder="Password"
                name="password"
                formInputHandler={formInputHandler}
                style={styles.materialStackedLabelTextbox3}
              >
              </TextInputComponent>
              <Text>Password confirmation</Text>
              <TextInputComponent
                placeholder="Confirm password"
                name="password2"
                formInputHandler={formInputHandler}
                style={styles.materialStackedLabelTextbox3}
              >
              </TextInputComponent>
              <Text>Email(Optional)</Text>
              <TextInputComponent
                placeholder="Email"
                name="email"
                formInputHandler={formInputHandler}
                style={styles.materialStackedLabelTextbox3}
              >
              </TextInputComponent>
              <HelperText type="error" visible={validateEmailHandler()}>
                Invalid email address
              </HelperText>
            </View>
            <View style={styles.buttonsContainer}>
              <ButtonComponent
                style={styles.button}
                name="Register"
                onClickHandler={onRegisterFormHandler}
              >
              </ButtonComponent>
              <ButtonComponent
                style={styles.button}
                name="Go back"
                onClickHandler={() => props.navigation.navigate("SignInScreen")}
              >
              </ButtonComponent>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "10%",
  },
  ellipseContainer: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignContent: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: "100%",
    height: "100%",
    resizeMode: 'contain',
  },
  scrollViewContainer: {
    flex: 5
  },
  inputTextContainer: {
    flex: 4,
    flexDirection: "column",
    justifyContent: "center",
    justifyContent: 'space-around',
    marginBottom: 5
  },
  buttonsContainer: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "center",
    justifyContent: 'space-around'
  },
  textContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    height: 50,
    marginBottom: 10
  },
  text: {
    color: "white",
  }
});

export default RegistrationScreen;
