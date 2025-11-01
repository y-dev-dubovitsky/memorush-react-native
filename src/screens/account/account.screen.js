import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, HelperText, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from "react-redux";
import ImgBackgroundComponent from "../../common/components/img-background/img-background.component";
import { authEntitySelector, updateUserData } from "../../redux/features/auth/auth-slice";
import ButtonComponent from "../../common/components/button/button.component";

const AccountScreen = () => {

  const dispatch = useDispatch();
  const { username } = useSelector(authEntitySelector);

  const [passwordEntity, setPasswordEntity] = useState({
    oldPassword: '',
    newPassword: '',
    passwordConfirm: '',
  })

  const updateUserDataHandler = () => {
    dispatch(updateUserData({
      password: passwordEntity.newPassword,
      password2: passwordEntity.passwordConfirm
    }))
  }

  const validatePasswordHandler = () => {
    return passwordEntity.newPassword !== passwordEntity.passwordConfirm || passwordEntity.newPassword.length < 7 ? 1 : 0;
  }

  const isFormValid = !validatePasswordHandler() && 
    passwordEntity.oldPassword.length > 0 && 
    passwordEntity.newPassword.length > 0 && 
    passwordEntity.passwordConfirm.length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImgBackgroundComponent>
        <View style={styles.container}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Unified Card */}
            <View style={styles.card}>
              
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  <Avatar.Icon
                    size={100}
                    icon="account"
                    style={styles.avatar}
                    color="#18BBF1"
                  />
                  <View style={styles.onlineIndicator} />
                </View>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.username}>{username}</Text>
                <Text style={styles.subtitle}>Manage your account settings</Text>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Password Section */}
              <View style={styles.passwordSection}>
                <View style={styles.settingsHeader}>
                  <Text style={styles.settingsTitle}>🔐 Change Password</Text>
                  <Text style={styles.settingsSubtitle}>Update your security settings</Text>
                </View>

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Current Password</Text>
                    <TextInput
                      mode="flat"
                      style={styles.input}
                      placeholder="Enter your current password"
                      secureTextEntry
                      value={passwordEntity.oldPassword}
                      onChangeText={text => setPasswordEntity({
                        ...passwordEntity,
                        oldPassword: text
                      })}
                      left={<TextInput.Icon icon="lock" size={20} />}
                      theme={{ colors: { primary: '#18BBF1', background: '#F8F9FA' } }}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <TextInput
                      mode="flat"
                      style={styles.input}
                      placeholder="Enter new password"
                      secureTextEntry
                      value={passwordEntity.newPassword}
                      onChangeText={text => setPasswordEntity({
                        ...passwordEntity,
                        newPassword: text
                      })}
                      left={<TextInput.Icon icon="key" size={20} />}
                      theme={{ colors: { primary: '#18BBF1', background: '#F8F9FA' } }}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Confirm New Password</Text>
                    <TextInput
                      mode="flat"
                      style={styles.input}
                      placeholder="Confirm your new password"
                      secureTextEntry
                      value={passwordEntity.passwordConfirm}
                      onChangeText={text => setPasswordEntity({
                        ...passwordEntity,
                        passwordConfirm: text
                      })}
                      left={<TextInput.Icon icon="shield-check" size={20} />}
                      theme={{ colors: { primary: '#18BBF1', background: '#F8F9FA' } }}
                    />
                  </View>

                  <HelperText 
                    type="error" 
                    visible={validatePasswordHandler()}
                    style={styles.helperText}
                  >
                    {passwordEntity.newPassword.length < 7 ? 
                      "Password must be at least 8 characters" : 
                      "Passwords do not match"
                    }
                  </HelperText>

                  <ButtonComponent 
                    onClickHandler={updateUserDataHandler} 
                    name="Update Password" 
                    style={[styles.button, !isFormValid && styles.buttonDisabled]}
                    isDisabled={!isFormValid}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImgBackgroundComponent>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  profileSection: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#EEF2FF',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
    textAlign: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 24,
  },
  passwordSection: {
    // No additional styles needed
  },
  settingsHeader: {
    marginBottom: 20,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
    textAlign: 'center',
  },
  settingsSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F8F9FA',
    fontSize: 16,
    borderRadius: 12,
  },
  helperText: {
    fontSize: 13,
    marginTop: -4,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#18BBF1',
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: '#18BBF1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowColor: 'transparent',
  },
})

export default AccountScreen;