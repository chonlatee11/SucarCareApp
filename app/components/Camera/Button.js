import { StyleSheet, View, Pressable, Text, TouchableOpacity } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";

function Button({ label, theme , onPress,icon, disabled}) {
    if (theme === "primary") {
        return (
          <View
          style={[styles.buttonContainer, { borderWidth: 3, borderColor: "blue", borderRadius: 15 }]}
          >
            <TouchableOpacity
              disabled={disabled}
              style={[styles.button, { backgroundColor: "white" }]}
              onPress={onPress}
            >
              <FontAwesome
                name={icon}
                size={18}
                color="black"
                style={styles.buttonIcon}
              />
              <Text style={[styles.buttonLabel, { color: "#25292e" }]}>{label}</Text>
            </TouchableOpacity>
        </View>
        );
      }
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    // backgroundColor: 'yellow',
    width: '100%',
    height: '17%',
    // marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 3,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Button;