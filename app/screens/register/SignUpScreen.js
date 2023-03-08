import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import CustomInput from "../../components/CustomInput/CustomInput";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useNavigation } from "@react-navigation/core";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import GetLocation from "react-native-get-location";
import {
  register_API_URL,
  province_API_URL,
  amphures_API_URL,
  tambons_API_URL,
  getUsers_API_URL,
} from "../../components/API/config/apiconfig";
import {
  Modal,
  Portal,
  Provider,
  RadioButton,
  Button,
  IconButton,
  TextInput,
} from "react-native-paper";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [provinces, setProvince] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [checkAddress, setCheckAddress] = useState(false);
  const [addressInput, setAddressInput] = useState({
    province: "",
    district: "",
    subDistrict: "",
    zip_code: "",
  });
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      username: "",
      password: "",
      repeatPassword: "",
      fname: "",
      lname: "",
      phoneNumber: "",
      detailAddress: "",
    },
  });
  const [userNamedata, setUserNameData] = useState([]);
  

  useEffect(() => {
    if (location.length === 0) {
      getLocation();
      getProvince();
      getUsername();
    }
  }, [location]);

  const checkUsernameExists = (username, users) => {
    return users.data.some((user) => user.UserName === username);
  };

  const username = watch("username");
  // const array = userNamedata.data.map((item) => {
  //   return {UserName: item.UserName};
  // });
  // const isUsernameExists = checkUsernameExists(username, array);

  function getUsername() {
    axios
      .get(getUsers_API_URL)
      .then((res) => {
        setUserNameData(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        // console.log(err);
        <Alert>เกิดข้อผิดพลาด</Alert>;
      });
  }

  function getProvince() {
    axios
      .get(province_API_URL)
      .then((res) => {
        // console.log(res.data);
        setProvince(res.data.data);
      })
      .catch((err) => {
        // console.log(err);
        <Alert>เกิดข้อผิดพลาด</Alert>;
      });
  }

  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 150000,
    })
      .then((location) => {
        setLocation({
          location,
          loading: false,
        });
        // console.log(location);
      })
      .catch((ex) => {
        const { code, message } = ex;
        // console.warn(code, message);
        if (code === "CANCELLED") {
          Alert.alert("Location cancelled by user or by another request");
        }
        if (code === "UNAVAILABLE") {
          Alert.alert("Location service is disabled or unavailable");
        }
        if (code === "TIMEOUT") {
          Alert.alert("Location request timed out");
        }
        if (code === "UNAUTHORIZED") {
          Alert.alert("Authorization denied");
        }
        setLocation({
          location: null,
          loading: false,
        });
      });
  };

  const onSignInPress = () => {
    navigation.navigate("SignIn");
  };

  const onRegisterPress = async (data) => {
    if (isLoding) return;
    // console.log(data);
    // console.log(addressInput);
    // console.log(location.location.longitude);
    setIsLoding(true);
    const res = await axios
      .put(`${register_API_URL}`, {
        userName: data.username,
        passWord: data.password,
        fName: data.fname,
        lName: data.lname,
        phoneNumber: data.phoneNumber,
        detailAddress: data.detailAddress,
        province: addressInput.province,
        district: addressInput.district,
        subDistrict: addressInput.subDistrict,
        zipCode: addressInput.zip_code,
        latitude: location.location.latitude,
        longitude: location.location.longitude,
      })
      .then((response) => {
        // console.log(response.status);
        if (response.status === 200) {
          Alert.alert("สมัครสมาชิกสำเร็จ", "กรุณาเข้าสู่ระบบ");
          navigation.navigate("SignIn");
        }
      })
      .catch((error) => {
        Alert.alert("เกิดข้อผิดพลาด", "กรุณาลองใหม่อีกครั้ง");
        console.log(error);
        return;
      });
    setIsLoding(false);
  };

  const handleProvinceSelect = (province) => {
    axios
      .post(amphures_API_URL, {
        province: province.name_th,
      })
      .then((res) => {
        // console.log(res.data);
        setAmphures(res.data.data);
      })
      .catch((err) => {
        // console.log(err);
      });
    setAddressInput({
      ...addressInput,
      province: province.name_th,
    });
  };

  const handleDistrictSelect = (district) => {
    axios
      .post(tambons_API_URL, {
        amphures: district.name_th,
      })
      .then((res) => {
        // console.log(res.data);
        setTambons(res.data.data);
      })
      .catch((err) => {
        // console.log(err);
      });
    setAddressInput({
      ...addressInput,
      district: district.name_th,
    });
  };

  const handleSubDistrictSelect = (subDistrict) => {
    setAddressInput({
      ...addressInput,
      subDistrict: subDistrict.name_th,
      zip_code: subDistrict.zip_code,
    });
    setModalVisible(!modalVisible);
  };

 if (isLoding === true) {
  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}
  return (
    <View style={styles.box}>
      <ScrollView>
        <View style={styles.inner}>
          <Text style={styles.title}>สมัครใช้งาน</Text>
          <CustomInput
            name={"username"}
            control={control}
            label="ชื่อผู้ใช้งาน"
            rules={{
              required: "กรุณากรอกชื่อผู้ใช้งาน",
              validate: (value) =>
                !checkUsernameExists(value, userNamedata) ||
                "ชื่อผู้ใช้งานนี้มีผู้ใช้งานแล้ว",
            }}
          />
          <CustomInput
            name={"password"}
            control={control}
            label="รหัสผ่าน"
            secureTextEntry
            rules={{ required: "กรุณากรอกรหัสผ่าน" }}
          />
          <CustomInput
            name={"repeatPassword"}
            control={control}
            label="ยืนยันรหัสผ่าน"
            secureTextEntry
            rules={{
              validate: (value) =>
                value === watch("password") || "รหัสผ่านไม่ตรงกัน",
            }}
          />
          <CustomInput
            name={"fname"}
            control={control}
            label="ชื่อ"
            rules={{ required: "กรุณากรอกชื่อ" }}
          />

          <CustomInput
            name={"lname"}
            control={control}
            label="นามสกุล"
            rules={{ required: "กรุณากรอกนามสกุล" }}
          />

          <CustomInput
            name={"phoneNumber"}
            control={control}
            label="เบอร์โทรศัพท์"
            rules={{
              required: "กรุณากรอกเบอร์โทรศัพท์",
              maxLength: 10,
              minLength: 10,
            }}
            keyboardType={"numeric"}
            errormessage={"กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"}
          />

          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              borderColor: "#e8e8e8",
              borderWidth: 0,
              borderRadius: 0,
              paddingHorizontal: 0,
              marginVertical: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                backgroundColor: "white",
                width: "100%",
                borderColor: "#e8e8e8",
                borderWidth: 0,
                borderRadius: 0,
                paddingHorizontal: 0,
                marginVertical: 5,
              }}
            >
              {addressInput.province === "" ? (
                <TextInput
                  placeholder="จังหวัด,เขต/อำเภอ,ตำบล,รหัสไปรษณีย์"
                  value={addressInput}
                  editable={false}
                  disabled={true}
                />
              ) : (
                <TextInput
                  placeholder={
                    "จังหวัด" +
                    " " +
                    addressInput.province +
                    " " +
                    "เขต/อำเภอ" +
                    " " +
                    addressInput.district +
                    " " +
                    "ตำบล" +
                    " " +
                    addressInput.subDistrict +
                    " " +
                    addressInput.zip_code
                  }
                  value={addressInput}
                  editable={false}
                  disabled={true}
                  multiline={true}
                />
              )}
            </TouchableOpacity>
            <CustomInput
              name={"detailAddress"}
              control={control}
              label="รายละเอียดที่อยู่"
              rules={{ required: "กรุณากรอกข้อมูลที่อยู่" }}
              multiline={true}
              rows={3}
            />
          </View>

          <CustomButton
            text={"สมัครใช้งาน"}
            onPress={handleSubmit(onRegisterPress)}
          />

          <CustomButton
            text="เข้าสู่ระบบ"
            onPress={onSignInPress}
            type="TERTIARY"
          />
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.boxModal}>
          <View style={styles.innerModal}>
            <View style={{flex: 1}}>
              <ProgressSteps {...progressStepsStyle}
              activeStep={activeStep}
              >
                  <ProgressStep 
                    nextBtnText="ต่อไป"
                    label={`จังหวัด: ${addressInput.province}`}
                    nextBtnTextStyle={styles.buttonTextStyle}
                    nextBtnStyle={styles.buttonStyle}
                    onNext={() => {
                      setActiveStep(0); // move to the next step
                    }}
                  >
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                          {provinces.map((province) => (
                            <TouchableOpacity
                              key={province.id}
                              onPress={() => {
                                handleProvinceSelect(province);
                                setActiveStep(1); // move to the next step 
                              }}
                            >
                              <Text style={styles.scrollViewItemText} >{province.name_th}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>  
                  </ProgressStep>

                  <ProgressStep 
                    nextBtnText="ต่อไป"
                    previousBtnText="ย้อนกลับ"
                    label={`เขต/อำเภอ: ${addressInput.district}`}
                    nextBtnTextStyle={styles.buttonTextStyle}
                    nextBtnStyle={styles.buttonStyle}
                    previousBtnTextStyle={styles.buttonTextStyle}
                    previousBtnStyle={styles.buttonStyle}
                    onNext={() => {
                      setActiveStep(2); // move to the next step
                    }}
                    onPrevious={() => {
                      setActiveStep(0); // move to the previous step
                    }}
                  >
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                          {amphures.map((district) => (
                            <TouchableOpacity
                              key={district.id}
                              onPress={() => {
                                handleDistrictSelect(district)
                                setActiveStep(2); // move to the next step 
                              }}
                            >
                              <Text style={styles.scrollViewItemText}>{district.name_th}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                     
                  </ProgressStep>
                  <ProgressStep 
                   label={`ตำบล: ${addressInput.subDistrict} ${addressInput.zip_code}`}
                    finishBtnText="เสร็จสิ้น"
                    previousBtnText="ย้อนกลับ"
                    nextBtnTextStyle={styles.buttonTextStyle}
                    nextBtnStyle={styles.buttonStyle}
                    previousBtnTextStyle={styles.buttonTextStyle}
                    previousBtnStyle={styles.buttonStyle} 
                    onPrevious={() => {
                      setActiveStep(1); // move to the previous step
                    }}
                    onSubmit={() => {
                      setModalVisible(!modalVisible)
                      setActiveStep(0); // move to the previous step
                    }}
                   >
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                          {tambons.map((subDistrict) => (
                            <TouchableOpacity
                              key={subDistrict.id}
                              onPress={() => {
                                handleSubDistrictSelect(subDistrict)
                                setActiveStep(0); // move to the next step
                              }}
                            >
                              <Text style={styles.scrollViewItemText}>{subDistrict.name_th}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                  </ProgressStep>
              </ProgressSteps> 
          </View>
              
            </View>
          </View>
      </Modal>
      </View>       
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: "5%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: "5%",
  },
  text: {
    color: "black",
    marginVertical: "2%",
  },
  addressButton: {
    padding: 10,
    color: "black",
    fontSize: 16,
    alignSelf: "center",
  },
  box: {
    width: "100%",
    height: "100%",
    padding: "5%",
  },
  inner: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  buttonStyle: {
    backgroundColor: "#AD8B73",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  buttonTextStyle : {
    color: '#393939'
  },
  boxModal: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  innerModal: {
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
  },
  scrollViewContent:{
    paddingVertical: 10,
  },
  scrollViewItemText: {
    fontSize: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

const progressStepsStyle = {
  activeStepIconBorderColor: '#a9cae8',
  activeLabelColor: 'black',
  activeStepNumColor: 'black',
  activeStepIconColor: 'white',
  completedStepIconColor: '#bfa9f1',
  completedProgressBarColor: '#bfa9f1',
  completedCheckColor: '#e0dee4'
};

// const progressStepsStyle = {
//   activeStepIconBorderColor: '#AD8B73',
//   activeLabelColor: '#AD8B73',
//   activeStepNumColor: '#AD8B73',
//   completedStepIconColor: '#AD8B73',
//   completedProgressBarColor: '#AD8B73',
//   completedCheckColor: '#fff',
//   labelFontFamily: 'Arial',
//   labelFontSize: 14,
//   stepFontFamily: 'Arial',
//   stepFontSize: 14,
//   disabledStepIconColor: '#ccc',
//   progressBarColor: '#ccc',
//   disabledStepNumColor: '#ccc',
// };
export default SignUpScreen;
