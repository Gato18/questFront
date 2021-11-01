import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Button, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
// import { Overlay } from "react-native-elements";

import Header from "../components/header";
import CreatButton from "../shared/CreatButton";

import { MY_IP } from "@env"; /* Variable environnement */
import { log } from "react-native-reanimated";

function HomeScreen(props) {
  const [data, setData] = useState("");
  const [quest, setQuest] = useState(0);

  // Au chargement du composant, on obtient toutes les données de l'utilisateur
  useEffect(() => {
    async function userData() {
      const data = await fetch(`http://${MY_IP}:3000/home/userDetail?token=${props.dataUser.token}`);
      const body = await data.json();
      if (body.result) {
        setData(body.user);
        setQuest(body.user.quests.length);
        props.addUser({ token: props.dataUser.token, firstName: body.user.firstName, avatar: body.user.avatar });
      } else {
        console.log("error");
      }
    }
    userData();
  }, []);
  // console.log(data);

  // // Overlay
  // const Overlay = () => {
  //   const [visible, setVisible] = useState(false);
  //   const toggleOverlay = () => {
  //     setVisible(!visible);
  //   };
  // }

  var handleResult = async (id) => {
    props.navigation.navigate("Results", {
      questId: id,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Header title={data.firstName} image={data.avatar} />
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            marginVertical: 10,
            color: "#2C98DA",
            fontWeight: "bold",
          }}>
          {" "}
          Vos {quest} quêtes en cours
        </Text>
        <TouchableOpacity
          style={styles.Button}
          onPress={() => {
            props.navigation.navigate("AddQuest", { screen: "AddQuestScreen" });
          }}>
          <Text style={styles.buttonText}>Lancez une quête</Text>
        </TouchableOpacity>
        {data.quests?.map((item, i) => {
          return (
            <View
              key={i}
              style={{
                backgroundColor: "#F8F7FF",
                padding: 15,
                elevation: 5,
                marginVertical: 3,
              }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <Text>{item.city}</Text>
                <Text>Rayon {item.rayon} </Text>
              </View>

              <View style={{ marginVertical: 20 }}>
                <Text>{item.max_price}€</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <CreatButton>Détails</CreatButton>
                <CreatButton
                  onPress={() => {
                    handleResult(item._id);
                  }}
                  buttonStyle={{ backgroundColor: "orange" }}>
                  RESULTATS
                </CreatButton>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Button: {
    backgroundColor: "#FBC531",
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignSelf: "center",
    borderRadius: 25,
    marginTop: 5,
    marginBottom: 5,
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
