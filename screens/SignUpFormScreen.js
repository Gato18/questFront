import React, { useState } from "react";
import { Text, View, StyleSheet, Dimensions, ImageBackground, TouchableOpacity, StatusBar } from "react-native";

import { connect } from "react-redux";

import { MY_IP } from "@env"; /* Variable environnement */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { TextInput } from "react-native-gesture-handler";

function SignUpFormScreen(props) {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [userExists, setUserExists] = useState(false);

  const [listErrorsSignUp, setErrorsSignup] = useState([]);

  var handleSubmitSignup = async () => {
    const data = await fetch(`http://${MY_IP}/users/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `firstNameFromFront=${firstName}&lastNameFromFront=${lastName}&emailFromFront=${signUpEmail}&phoneFromFront=${phoneNumber}&passwordFromFront=${signUpPassword}`,
    });
    const body = await data.json();

    if (body.result == true) {
      props.addUser(body.dataUser);
      props.navigation.navigate("BottomNavigator", { screen: "HomeScreen" });
      setUserExists(true);
      AsyncStorage.setItem("token", body.dataUser.token);
    } else {
      setErrorsSignup(body.error);
    }
  };
  var tabErrorsSignUp = listErrorsSignUp.map((error, i) => {
    return <Text>{error}</Text>;
  });

  return (
    <>
      {/* <StatusBar barStyle={{ height: StatusBar.currentHeight }} backgroundColor={'#2C8BC6'} /> */}
      <ImageBackground source={require("../assets/SignUpScreen.png")} style={styles.container}>
        <View>
          <Text style={styles.headingText}>Vous êtes acheteur</Text>
        </View>
        <View style={styles.mainbox}>
          <View>
            <Text style={styles.personalText}>Information Personnelle</Text>
            <View style={styles.formContainer}>
              <View style={{ flexDirection: "row" }}>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.text}>Prenom</Text>
                  <TextInput style={styles.inputStyle} onChangeText={(text) => setFirstName(text)} value={firstName} />
                </View>
                {tabErrorsSignUp}
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <Text style={styles.text}>Nom</Text>
                  <TextInput style={styles.inputStyle} onChangeText={(text) => setLastName(text)} value={lastName} />
                </View>
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.text}>Email</Text>
                <TextInput style={styles.inputStyle} onChangeText={(text) => setSignUpEmail(text)} value={signUpEmail} />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.text}>Password</Text>
                <TextInput style={styles.inputStyle} secureTextEntry={true} onChangeText={(number) => setSignUpPassword(number)} value={signUpPassword} />
              </View>
              <View style={styles.inputWrapper}>
                <Text style={styles.text}>Telephone</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.text}>+33</Text>
                  <TextInput style={[styles.inputStyle, { flex: 0, minWidth: 150 }]} onChangeText={(number) => setPhoneNumber(number)} value={phoneNumber} />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={() => handleSubmitSignup()} style={styles.signup}>
              <Text style={styles.signupText}>VALIDER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  personalText: {
    fontSize: 18,
    margin: 10,
    fontWeight: "bold",
    color: "#585858",
  },
  text: {
    color: "#585858",
  },
  inputStyle: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    marginVertical: 5,
    fontSize: 17,
    paddingVertical: 4,
    color: "#585858",
  },
  inputWrapper: {
    margin: 5,
  },
  headingText: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2C98DA",
    marginVertical: 30,
    paddingTop: 100,
  },
  mainbox: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 170,
  },
  signup: {
    backgroundColor: "#2C8BC6",
    paddingHorizontal: 50,
    paddingVertical: 17,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    borderRadius: 25,
  },
  buttonWrapper: {
    alignItems: "flex-end",
    paddingRight: 50,
    paddingTop: 50,
  },
  signupText: {
    color: "#fff",
    alignSelf: "center",
  },
  formContainer: {
    backgroundColor: "#F8F7FF",
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 10,
    paddingHorizontal: 15,
  },
});

function mapDispatchToProps(dispatch) {
  return {
    addUser: function (dataUser) {
      dispatch({ type: "addUser", dataUser: dataUser });
    },
  };
}

export default connect(null, mapDispatchToProps)(SignUpFormScreen);
