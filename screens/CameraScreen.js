import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { connect } from "react-redux";
import { FontAwesome } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import AnimatedLoader from "react-native-animated-loader";

import { MY_IP } from "@env"; /* Variable environnement */

function CameraScreen(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [loaderVisible, setLoaderVisible] = useState(false);

  var camera = useRef(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  var cameraDisplay;
  if (hasPermission && isFocused) {
    cameraDisplay = (
      <Camera style={{ flex: 1 }} type={Camera.Constants.Type.front} ref={(ref) => (camera = ref)}>
        <FontAwesome name="arrow-circle-left" size={36} color="black" style={{ position: "absolute", top: 30, left: 10, color: "rgba(251, 197, 49, 1)" }} onPress={() => props.navigation.navigate("Profil")} />
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            flexDirection: "row",
          }}></View>
        <TouchableOpacity
          style={{
            alignSelf: "center",
            alignItems: "center",
            marginBottom: 25,
          }}
          onPress={async () => {
            setLoaderVisible(true);
            if (camera) {
              let photo = await camera.takePictureAsync({ quality: 0.3 });
              var data = new FormData();
              data.append("avatar", {
                uri: photo.uri,
                type: "image/jpeg",
                name: "avatar.jpg",
              });
              data.append("token", props.dataUser.token);

              var rawResponse = await fetch(`http://${MY_IP}/upload`, {
                method: "POST",
                body: data,
              });
              var response = await rawResponse.json();
              console.log("response", response);
              if (!response.error) {
                props.addUser({ avatar: response.url, firstName: props.dataUser.firstName, token: props.dataUser.token, quest: props.dataUser.quest });
                props.navigation.navigate("Profil", { upload: true });
              }
              setLoaderVisible(false);
            }
          }}>
          <FontAwesome name="camera" size={64} color="red" />
        </TouchableOpacity>
      </Camera>
    );
  }
  return (
    <View style={{ flex: 1 }}>
      <AnimatedLoader visible={loaderVisible} overlayColor="rgba(255,255,255,0.75)" animationStyle={styles.lottie} speed={1} source={require("../assets/loader_camera.json")}>
        <Text></Text>
      </AnimatedLoader>
      {cameraDisplay}
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 250,
    height: 250,
  },
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}

function mapDispatchToProps(dispatch) {
  return {
    addUser: function (dataUser) {
      dispatch({ type: "addUser", dataUser: dataUser });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CameraScreen);
