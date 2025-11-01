import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  authSelector,
  login,
  guestLogin,
} from '../../redux/features/auth/auth-slice';
import ButtonComponent from '../../common/components/button/button.component';
import TextInputComponent from './atomic-components/text-input.component';

const IMAGE_PATH = "./images/adaptive-icon.png";

const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { status } = useSelector(authSelector);

  useEffect(() => {
    if (status === 'login') {
      navigation.navigate('MainTabNavigation');
    }
  }, [status, navigation]);

  const formInputHandler = ({ name, value }) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onLoginFormHandler = () => {
    dispatch(login(formData));
  };

  const onGuestFormHandler = () => {
    dispatch(guestLogin());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Логотип */}
        <View style={styles.logoContainer}>
          <Image source={require(IMAGE_PATH)} style={styles.logo} />
        </View>

        {/* Форма входа */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInputComponent
            placeholder="Username"
            name="username"
            value={formData.username}
            formInputHandler={formInputHandler}
          />

          <Text style={styles.label}>Password</Text>
          <TextInputComponent
            placeholder="Password"
            name="password"
            value={formData.password}
            formInputHandler={formInputHandler}
            secureTextEntry
          />
        </View>

        {/* Кнопки */}
        <View style={styles.buttonsContainer}>
          <ButtonComponent
            style={styles.button}
            name="Sign In"
            onClickHandler={onLoginFormHandler}
          />
          <ButtonComponent
            style={styles.button}
            name="Registration"
            onClickHandler={() => navigation.navigate('RegistrationScreen')}
          />
          <ButtonComponent
            style={[styles.button, styles.guestButton]}
            name="Guest"
            onClickHandler={onGuestFormHandler}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  formContainer: {
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  buttonsContainer: {
    // gap не поддерживается в RN 0.70 → используем marginBottom на кнопках
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12, // ← отступ между кнопками
  },
  guestButton: {
    backgroundColor: '#C0C0C0', // silver
  },
});

export default SignInScreen;