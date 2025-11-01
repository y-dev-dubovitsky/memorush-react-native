import * as React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';

const AppbarComponent = ({ onBackPress }) => {
  const iconScaleAnim = React.useRef(new Animated.Value(1)).current;

  return (
    <View style={styles.appBar}>
      <View style={styles.container}>
        <Animated.View style={[styles.backButtonContainer, { transform: [{ scale: iconScaleAnim }] }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Icon
              name='arrow-back'
              type='material'
              color="#F59E0B"
            />
          </TouchableOpacity>
        </Animated.View>

      </View>

      {/* Subtle Separator */}
      <View style={styles.separator} />
    </View>
  )
}

export default AppbarComponent

const styles = StyleSheet.create({
  appBar: {
    padding: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButtonContainer: {
    zIndex: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
  },
  separator: {
    height: 1,
    marginTop: 12,
    marginHorizontal: 20,
  },
});