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

function MessagesScreen(props) {
  const [selectedQuest, setSelectedQuest] = useState("");
  const [selectedConversation, setSelectedConversation] = useState("");
  const [listMessages, setListMessages] = useState([]);
  const [offerMessages, setOfferMessages] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const scrollViewRef = useRef(ScrollView);

  const isFocused = useIsFocused();

  useEffect(() => {
    async function listMsgConversation(id) {
      setSelectedConversation(id);
      const data = await fetch(`http://${MY_IP}/inbox/conversation?id=${id}&token=${props.dataUser.token}`);
      const body = await data.json();

      var list = body.messages.listMessages.map((msg) => {
        return {
          firstName: msg.users[0].firstName,
          avatar: msg.users[0].avatar,
          text: msg.messages.text,
        };
      });
      setSelectedQuest(body.messages.listMessages[0].quest_id);
      setListMessages(list);
      setOfferMessages(body.messages.offer);
    }
    listMsgConversation(props.route.params.conversationId);
  }, []);

  //Refresh les messages
  var refresh = async (id) => {
    const data = await fetch(`http://${MY_IP}/inbox/conversation?id=${id}&token=${props.dataUser.token}`);
    const body = await data.json();

    var list = body.messages.listMessages.map((msg) => {
      return {
        firstName: msg.users[0].firstName,
        avatar: msg.users[0].avatar,
        text: msg.messages.text,
      };
    });

    setListMessages(list);
    setOfferMessages(body.messages.offer);
  };

  //Au clic sur le bouton envoyer, on enregistre le nouveau message dans la conversation.
  var sendMessage = async (id, sender_token, message) => {
    const data = await fetch(`http://${MY_IP}/inbox/addMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `id=${id}&sender_token=${sender_token}&message=${message}`,
    });

    const body = await data.json();
    if (body.result) {
      refresh(body.messageSaved._id);
    }
    setInputMessage("");
  };

  if (isFocused && offerMessages) {
    //On affiche les messages
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={"#2D98DA"} style="light" />
        <View
          style={{
            flex: 0,
            justifyContent: "space-around",
            flexDirection: "row",
            backgroundColor: "#2C98DA",
            height: 100,
            paddingTop: 30,
          }}>
          <Image source={{ uri: offerMessages[0].pictures[0].url }} style={{ width: 100, height: 60, marginHorizontal: 20 }} resizeMethod="resize" resizeMode="center"></Image>
          <View style={{ flex: 1, flexDirection: "column", color: "#FFFFFF" }}>
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>{offerMessages[0].type + " " + offerMessages[0].nb_pieces + " pièces " + offerMessages[0].surface + "m²"}</Text>
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 16 }}>{offerMessages[0].price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €</Text>
            <Text style={{ color: "#FFFFFF", fontWeight: "400", fontSize: 12 }}>{offerMessages[0].city}</Text>
          </View>
          <TouchableOpacity onPress={() => refresh(selectedConversation)} style={{ marginRight: 10, flex: 0, justifyContent: "center" }}>
            <FontAwesome5 name={"undo"} size={25} color="#2C98DA" />
          </TouchableOpacity>
        </View>
        <Button icon={<Icon name="arrow-left" size={15} color="white" style={{ marginRight: 8 }} />} title="Retour aux discussions" onPress={() => props.navigation.navigate("Conversations", { selectedQuestId: selectedQuest })} />
        <ScrollView ref={scrollViewRef} onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd({ animated: true })}>
          {listMessages.map((msg, i) => {
            if (!msg.avatar) {
              var avatar = <Avatar rounded icon={<FontAwesome name="user" size={24} color="black" />} title={msg.firstName[0]} containerStyle={{ backgroundColor: "#585858" }} />;
            } else {
              var avatar = <Avatar source={{ uri: msg.avatar }} rounded title={msg.firstName[0]} containerStyle={{ backgroundColor: "#585858" }} />;
            }
            return (
              <ListItem key={i} bottomDivider>
                {avatar}
                <ListItem.Content>
                  <ListItem.Subtitle>{msg.text}</ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            );
          })}
        </ScrollView>
        <KeyboardAvoidingView>
          <TextInput multiline numberOfLines={4} onChangeText={(text) => setInputMessage(text)} value={inputMessage} style={{ padding: 10, backgroundColor: "#F8F7FF" }} placeholder="Écrire un message" />
          <Button icon={<FontAwesome name="send-o" size={24} color="white" style={{ marginRight: 8 }} />} title="Envoyer" onPress={() => sendMessage(selectedConversation, props.dataUser.token, inputMessage)} />
        </KeyboardAvoidingView>
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

export default connect(mapStateToProps)(MessagesScreen);
