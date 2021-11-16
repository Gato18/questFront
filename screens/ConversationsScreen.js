import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Image, TouchableOpacity } from "react-native";
import { Card, Text, Button, ListItem, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import { connect } from "react-redux";
import RNPickerSelect from "react-native-picker-select";
import { FontAwesome } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Header from "../components/header";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { MY_IP } from "@env"; /* Variable environnement */

function ConversationsScreen(props) {
  const [listQuest, setListQuest] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState("");
  const [listConversation, setListConversation] = useState([]);
  const scrollViewRef = useRef(ScrollView);

  const isFocused = useIsFocused();

  //Au chargement du composant, on cherche toutes les quêtes de l'utilisateur pour faire le menu select
  useEffect(() => {
    console.log("conv props.dataUser", props.dataUser.firstName);

    async function loadListQuest() {
      const data = await fetch(`http://${MY_IP}/inbox/?token=${props.dataUser.token}`);
      const body = await data.json();
      var list = body.listQuest.map((quest) => {
        return {
          value: quest._id,
          label: `${quest.type} : ${quest.city} - ${quest.min_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}/${quest.max_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}€`,
        };
      });
      setListQuest(list);
      setSelectedQuest(body.listQuest[0]._id);
    }

    loadListQuest();
  }, []);

  //Quand on click sur une quête, on charge les conversations de celle ci.
  useEffect(() => {
    async function selectedConversation() {
      const data = await fetch(`http://${MY_IP}/inbox/selectedQuest?id=${selectedQuest}&token=${props.dataUser.token}`);
      const body = await data.json();
      var list = body.conversations.map((conv) => {
        return {
          usersLastMessage: {
            prenom: conv.seller.firstName,
            avatar: conv.seller.avatar,
          },
          lastMessage: conv.lastMessage.text,
          offre: {
            type: conv.offer[0].type,
            surface: conv.offer[0].surface,
            price: conv.offer[0].price,
            city: conv.offer[0].city,
          },
          conversation: 1,
          _id: conv._id,
        };
      });
      setListConversation(list);
    }
    selectedConversation();
  }, [selectedQuest]);

  //Pour raffraichir la page via le header
  async function loadListQuest() {
    const data = await fetch(`http://${MY_IP}/inbox/?token=${props.dataUser.token}`);
    const body = await data.json();

    var list = body.listQuest.map((quest) => {
      return {
        value: quest._id,
        label: `${quest.type} : ${quest.city} - ${quest.min_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}/${quest.max_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}€`,
      };
    });
    setListQuest(list);
    setSelectedQuest(body.listQuest[0]._id);
  }

  if (isFocused) {
    //On affiche les messages

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={"#2D98DA"} style="light" />
        <Header onRefresh={loadListQuest} title={props.dataUser.firstName} image={props.dataUser.avatar} iconColor="#2C98DA" />
        {/* Menu select */}
        <RNPickerSelect onValueChange={(value) => setSelectedQuest(value)} items={listQuest} placeholder={{ label: "Choisir une quête", value: null }} value={selectedQuest} style={pickerSelectStyles} />
        {/* Résultat du choix du select */}
        <Card containerStyle={{ padding: 0, flex: 0 }}>
          {listConversation.map((d, i) => {
            if (!d.usersLastMessage.avatar) {
              var avatar = <Avatar rounded icon={{ name: "user", type: "font-awesome" }} title={d.usersLastMessage.prenom[0]} containerStyle={{ backgroundColor: "#585858" }} />;
            } else {
              var avatar = <Avatar source={{ uri: d.usersLastMessage.avatar }} rounded title={d.usersLastMessage.prenom[0]} containerStyle={{ backgroundColor: "#585858" }} />;
            }
            return (
              <ListItem key={i} bottomDivider onPress={() => props.navigation.navigate("Messages", { conversationId: d._id })}>
                {avatar}
                <ListItem.Content>
                  <ListItem.Title>{d.usersLastMessage.prenom}</ListItem.Title>
                  <ListItem.Subtitle>{d.offre.type + " - " + d.offre.city + " - " + d.offre.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "€ - " + d.offre.surface + "m²"}</ListItem.Subtitle>
                  <ListItem.Subtitle>{d.lastMessage}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            );
          })}
        </Card>
      </View>
    );
  } else {
    return <View style={{ flex: 1 }}></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: "#2C98DA",
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "#ffffff",
    paddingRight: 30, // to ensure the text is never behind the icon
    paddingLeft: 15,
  },
  inputAndroid: {
    backgroundColor: "#2C98DA",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "#ffffff",
    paddingRight: 30, // to ensure the text is never behind the icon
    paddingLeft: 15,
  },
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}

export default connect(mapStateToProps)(ConversationsScreen);
