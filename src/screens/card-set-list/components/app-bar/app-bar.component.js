import * as React from 'react';
import { StyleSheet, TextInput, View, Text, Animated, Easing } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';

const AppbarComponent = ({ searchTextString, setSearchTextString }) => {
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const searchScaleAnim = React.useRef(new Animated.Value(1)).current;
  const searchOpacityAnim = React.useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (isSearchFocused) {
      // Анимация при фокусе
      Animated.parallel([
        Animated.timing(searchScaleAnim, {
          toValue: 1.02,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(searchOpacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Анимация при потере фокуса
      Animated.parallel([
        Animated.timing(searchScaleAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(searchOpacityAnim, {
          toValue: 0.8,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSearchFocused]);

  const handleClearSearch = () => {
    setSearchTextString('');
  };

  return (
    <View style={styles.appBar}>
      <View style={styles.container}>
        
        {/* Search Section */}
        <Animated.View 
          style={[
            styles.searchWrapper,
            {
              transform: [{ scale: searchScaleAnim }],
              opacity: searchOpacityAnim,
            }
          ]}
        >
          <View style={styles.searchIconContainer}>
            <Icon
              name='search'
              type='material'
              size={20}
              color="#64748B"
            />
          </View>
          
          <TextInput
            style={styles.inputField}
            onChangeText={setSearchTextString}
            placeholder="Search card sets..."
            placeholderTextColor="#94A3B8"
            value={searchTextString}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            selectionColor="#18BBF1"
          />
          
          {searchTextString.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearSearch}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name='close'
                type='material'
                size={16}
                color="#64748B"
              />
            </TouchableOpacity>
          )}
        </Animated.View>

      </View>

      {/* Decorative Line */}
      <View style={styles.bottomLine} />
    </View>
  )
}

export default AppbarComponent

const styles = StyleSheet.create({
  appBar: {
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderBottomWidth: 0,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: 12,
    opacity: 0.7,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  clearButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginLeft: 8,
  },
  bottomLine: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginTop: 12,
    marginHorizontal: 20,
  },
});