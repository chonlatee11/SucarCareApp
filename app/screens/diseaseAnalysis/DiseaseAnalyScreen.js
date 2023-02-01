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

const getDiseaseResaultUrl = "http://192.168.1.22:3032/diseaseresualt";
const putReportUrl = "http://192.168.1.22:3032/ReportDisease";
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

  console.log("photo = " + photo.uri);
  console.log("ispicture = " + ispicture);
  console.log(userInfo);
  console.log(predict);

  useEffect(() => {
    if (predict.predicted_label !== "") {
      getInFoDisease();
    }
  }, [predict]);

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
    formData.append("AddressUser", userInfo.Address);
    await axios
      .put(putReportUrl, formData, {
        method: "PUT",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        let resualt = response.data;
        if (resualt.status == "success") {
          console.log(resualt);
          Photo("", "", "");
          setDiseaseData({});
          Photo("", "", "");
          SetPredict("", "", "");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getInFoDisease() {
    console.log(predict.predicted_label);
    await axios
      .post(getDiseaseResaultUrl, {
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
          <Text style={styles.text}>
            ชื่อโรค : {diseaseData.DiseaseName} อาการ :{" "}
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
          <TouchableOpacity>
            <Button
              theme="primary"
              icon={"picture-o"}
              label="เลือกรูปภาพจากคลังภาพ"
              onPress={() => {
                IsPicture(true);
                UseGallerry(true);
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Button
              theme="primary"
              icon={"bug"}
              label="ดูผลลัพธ์การวิเคราะห์โรค"
              onPress={() => {
                setModalVisible(true);
              }}
            ></Button>
          </TouchableOpacity>
        </View>

        <SafeAreaView style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <SafeAreaView>
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
                </SafeAreaView>

                <SafeAreaView style={styles.ScrollContainer}>
                  {viewResault == true ? (
                    <InFoDiseaseView diseaseData={diseaseData} />
                  ) : (
                    <ProtectDiseaseView diseaseData={diseaseData} />
                  )}
                </SafeAreaView>
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
            </View>
          </Modal>
        </SafeAreaView>

        <SafeAreaView style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalHelpVisible}
            onRequestClose={() => {
              setModalHelpVisible(!modalHelpVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <SafeAreaView>
                  <Slider />
                </SafeAreaView>
                <IconButton
                  name="close"
                  color={"#AD8B73"}
                  onPress={() => {
                    setModalHelpVisible(!modalHelpVisible);
                  }}
                  icon="close"
                />
              </View>
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
    width: 450,
    height: 400,
  },

  Image: {
    width: "100%",
    height: "100%",
    maxWidth: 300,
    maxHeight: 300,
    borderRadius: 10,
  },

  containerButton: {
    // backgroundColor: 'green',
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "center",
    width: 300,
    height: 180,
    paddingTop: 0,
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
    fontSize: 15,
    color: "black",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  //modal
  modalView: {
    width: width,
    height: height,
    margin: 0,
    backgroundColor: "#FFFBE9",
    borderRadius: 5,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    direction: "inherit",
    flexWrap: "nowrap",
    justifyContents: "space-between",
    flexDirection: "column",
    alignItems: "center",
  },
  containerImageModal: {
    // backgroundColor: 'blue',
    alignItems: "center",
    justifyContent: "center",
    width: 400,
    height: 250,
    flexDirection: "column",
  },
  containerResaultText: {
    // backgroundColor: 'red',
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    width: "100%",
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
    // backgroundColor: 'white',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    alignSelf: "center",
    width: "100%",
    paddingTop: 20,
  },
  ScrollView: {
    // backgroundColor: 'pink',
    marginHorizontal: 20,
    width: "100%",
    height: "100%",
    flexDirection: "column",
  },
  ScrollContainer: {
    flex: 1,
    paddingTop: 0,
    flexDirection: "column",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
  },
});

// export default DiseaseAnalyScreen;
