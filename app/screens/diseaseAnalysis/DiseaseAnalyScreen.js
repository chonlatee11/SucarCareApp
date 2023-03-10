import CameraSreen from "../../components/Camera/Camera";
import GalleryScreen from "../../components/Gallerry/Gallerry";
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import Button from "../../components/Camera/Button";
import IconButton from "../../components/Camera/IconButton";
import axios from "axios";
import { AuthContex } from "../../components/AutContext/AutContext";
import { PhotoContext } from "../../components/hook/photoContext";
import Slider from "../../components/HelpSlider/Slider";
import { getDiseaseResault_API_Url, putReport_API_Url } from "../../components/API/config/apiconfig";

const { width, height } = Dimensions.get("window");

const DiseaseAnalyScreen = () => {
  const { userInfo } = useContext(AuthContex);
  const {
    photo,
    Photo,
    ispicture,
    IsPicture,
    predict,
    SetPredict,
    usecamera,
    UseCamera,
    UseGallerry,
    usegallerry,
  } = useContext(PhotoContext);
  const [diseaseData, setDiseaseData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [viewResault, setViewResault] = useState(false);
  const [modalHelpVisible, setModalHelpVisible] = useState(false);


  useEffect(() => {
    if (predict.predicted_label !== "") {
      getInFoDisease();
      setModalVisible(!modalVisible);
    }
  }, [predict]);
  // console.log(`${userInfo.detailAddress} ${userInfo.subDistrict} ${userInfo.district} ${userInfo.province} ${userInfo.zipCode}`)

  async function sendReport() {
    let formData = new FormData();
    formData.append("file", {
      uri: photo.uri,
      type: photo.type,
      name: photo.name,
    });
    formData.append("UserID", userInfo.UserID);
    formData.append("UserFname", userInfo.fName);
    formData.append("UserLname", userInfo.lName);
    formData.append("Latitude", userInfo.latitude);
    formData.append("Longitude", userInfo.longitude);
    formData.append("PhoneNumber", userInfo.PhoneNumber);
    formData.append("Detail", "");
    formData.append("DiseaseID", diseaseData.DiseaseID);
    formData.append("DiseaseName", diseaseData.DiseaseName);
    formData.append("DiseaseNameEng", diseaseData.DiseaseNameEng);
    formData.append("DiseaseImage", photo.name);
    formData.append("ResaultPredict", predict.probability);
    formData.append("AddressUser", `${userInfo.detailAddress} ตำบล ${userInfo.subDistrict} อำเภอ/เขต ${userInfo.district} จังหวัด ${userInfo.province} ${userInfo.zipCode}`);
    // console.log("🚀 ~ file: DiseaseAnalyScreen.js:55 ~ sendReport ~ formData:", formData)
    // console.log("🚀 ~ file: DiseaseAnalyScreen.js:96 ~ sendReport ~ putReport_API_Url:", putReport_API_Url)
    await axios
      .put(putReport_API_Url, formData, {
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        let resualt = response.data;
        if (resualt.status == "success") {
          Alert.alert("ส่งข้อมูลสำเร็จ");
          // console.log(resualt);
          Photo("", "", "");
          setDiseaseData({});
          Photo("", "", "");
          SetPredict("", "", "");
        }
      })
      .catch((error) => {
        // console.log(error);
      });
  }
      

  async function getInFoDisease() {
    // console.log(predict.predicted_label);
    await axios
      .post(getDiseaseResault_API_Url, {
        name: predict.predicted_label,
      })
      .then(function (response) {
        let diseaseData = response.data.DiseaseData;
        setDiseaseData(diseaseData);
      });
  }

  const InFoDiseaseView = () => {
    if (diseaseData == {}) {
      return;
    }
    return (
      <ScrollView style={styles.ScrollView}>
        {diseaseData == {} ? (
          <Text style={styles.buttonText}>ไม่มีข้อมูล</Text>
        ) : (
          <Text style={styles.text}> ชื่อโรค : {diseaseData.DiseaseName}{"\n"} อาการ :{" "}
            {diseaseData.InfoDisease}
          </Text>
        )}
      </ScrollView>
    );
  };
  const ProtectDiseaseView = () => {
    return (
      <ScrollView style={styles.ScrollView}>
        {diseaseData == null ? (
          <Text style={styles.buttonText}>ไม่มีข้อมูล</Text>
        ) : (
          <Text style={styles.text}>
            คำแนะนำการป้องกันโรค : {diseaseData.ProtectInfo}
          </Text>
        )}
      </ScrollView>
    );
  };

  if (ispicture === false) {
    return (
      <View style={styles.container}>
        <View style={styles.containerImage}>
          {photo.uri == "" ? (
            <View style={styles.Image}></View>
          ) : (
            <Image source={{ uri: photo.uri }} style={styles.Image} />
          )}
        </View>

        <View style={styles.containerButton}>
          <Button
            theme="primary"
            icon={"book"}
            label="คำแนะนำการถ่ายภาพ"
            onPress={() => {
              setModalHelpVisible(true);
            }}
          />
          <Button
            theme="primary"
            icon={"camera"}
            label="ถ่ายรูปเพื่อวิเคราะห์โรคอ้อย"
            onPress={() => {
              IsPicture(true);
              UseCamera(true);
            }}
          />
          
            <Button
              theme="primary"
              icon={"picture-o"}
              label="เลือกรูปภาพจากคลังภาพ"
              onPress={() => {
                IsPicture(true);
                UseGallerry(true);
              }}
            />
            <Button
              theme="primary"
              icon={"bug"}
              label="ดูผลลัพธ์การวิเคราะห์โรค"
              onPress={() => {
                setModalVisible(true);
              }}
            ></Button>
          
        </View>

        <SafeAreaView style={styles.box}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.inner}>     
                  <View style={styles.containerImageModal}>
                    {diseaseData == null ? (
                      <View style={styles.Image}></View>
                    ) : (
                      <Image
                        source={{ uri: diseaseData.ImageUrl }}
                        style={styles.Image}
                      />
                    )}
                  </View>

                  <View style={styles.containerResaultText}>
                    {predict.probability == "" ? (
                      <Text style={styles.buttonText}>ไม่มีข้อมูล</Text>
                    ) : (
                      <Text style={styles.buttonText}>
                        มีโอกาสเป็นโรค {predict.probability} %
                      </Text>
                    )}
                  </View>

                  <View style={styles.containerButtonResault}>
                    <IconButton
                      name="info"
                      onPress={() => setViewResault(true)}
                      label="ข้อมูลโรค"
                      icon="book"
                      color={"#AD8B73"}
                    />
                    <IconButton
                      name="protect"
                      label="คำแนะนำการป้องกันโรค"
                      onPress={() => setViewResault(false)}
                      icon="shield"
                      color={"#AD8B73"}
                    />
                  </View>
                

                <View style={styles.ScrollContainer}>
                  {viewResault == true ? (
                    <InFoDiseaseView diseaseData={diseaseData} />
                  ) : (
                    <ProtectDiseaseView diseaseData={diseaseData} />
                  )}
                </View>
                <View style={styles.containerButtonResault}>
                  <IconButton
                    disabled={diseaseData == null ? true : false}
                    name="send"
                    label="ส่งข้อมูลไปยังนักวิจัย"
                    color={"#AD8B73"}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setViewResault(true);
                      sendReport();
                    }}
                    icon="send"
                  />
                  <IconButton
                    name="close"
                    label="ปิด"
                    color={"#AD8B73"}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setViewResault(true);
                    }}
                    icon="close"
                  />
                </View>
            </View>
          </Modal>
        </SafeAreaView>

        <SafeAreaView style={styles.modalView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalHelpVisible}
            onRequestClose={() => {
              setModalHelpVisible(!modalHelpVisible);
            }}
          >
            <View style={styles.innerModal}>
            <IconButton
                  name="close"
                  color={"#AD8B73"}
                  onPress={() => {
                    setModalHelpVisible(!modalHelpVisible);
                  }}
                  icon="close"
            />
              <Slider />
            </View>
          </Modal>
        </SafeAreaView>
      </View>
    );
  }
  if (ispicture == true && usecamera == true) {
    return <CameraSreen />;
  }
  if (ispicture == true && usegallerry == true) {
    return <GalleryScreen />;
  }
};
export default DiseaseAnalyScreen;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "red",
    width: "100%",
    height: "100%",
    flexDirections: "column",
    justifyContents: "center",
    alignItems: "center",
    direction: "inherit",
    flexWrap: "nowrap",
  },

  containerImage: {
    // backgroundColor: 'blue',
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    height: '50%',
  },

  Image: {
    width: "100%",
    height: "100%",
    maxWidth: 320,
    maxHeight: 350,
    borderRadius: 10,
  },

  containerButton: {
    // backgroundColor: 'green',
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: '80%',
    height: '48%',
    // paddingTop: 0,
  },

  button: {
    width: 250,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    color: "black",
  },
  text: {
    color: "black",
    fontSize: 16,
    
  },
  //modal
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  innerModal:{
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
  },
  containerImageModal: {
    // backgroundColor: 'blue',
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
    height: '50%',
  },
  containerResaultText: {
    // backgroundColor: 'white',
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "60%",
    height: "10%",
    paddingTop: 2,
    flexDirection: "column",
  },
  Resaultbutton: {
    // color: 'aliceblue',
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  containerButtonResault: {
    // backgroundColor: 'aliceblue',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "center",
    width: "80%",
    paddingTop: 10,
  },
  ScrollView: {
    // backgroundColor: 'pink',
    // marginHorizontal: '40%',
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  ScrollContainer: {
    backgroundColor: "#FFFBE9",
    paddingTop: 0,
    width: "80%",
    height: "20%",
    // flexDirection: "row",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "100%",
    height: "100%",
    padding: "5%",
    // backgroundColor: "red",
  },
  inner: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
});
