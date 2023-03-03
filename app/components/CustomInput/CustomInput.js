import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import { TextInput } from 'react-native-paper';
import { Controller} from 'react-hook-form';

const CustomInput = ({
  control,
  name,
  rules = {},
  label,
  secureTextEntry,
  multiline,
  keyboardType,
  icon,
  errormessage,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
        <>
          <View
            style={[
              styles.container,
              {borderColor: error ? 'red' : 'white'},
            ]}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  label={label}
                  style={styles.input}
                  secureTextEntry={secureTextEntry}
                  multiline={multiline}
                  keyboardType={keyboardType}
                  right={icon}
                />
          </View>
          {error && (
            <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || errormessage}</Text>
          )}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
    marginVertical: 5,
  },
  input: {
    color: 'black',
  },
});

export default CustomInput;