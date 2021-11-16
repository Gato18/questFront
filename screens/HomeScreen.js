import React, { useEffect, useState, useCallback } from "react";
import { View, Text, SafeAreaView, ScrollView, Button, StyleSheet, TouchableOpacity, Dimensions, Pressable, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { connect } from "react-redux";

import { Overlay, Badge } from "react-native-elements";
import AnimatedLoader from "react-native-animated-loader";
import Header from "../components/header";
import CreatButton from "../shared/CreatButton";

import { MY_IP } from "@env"; /* Variable environnement */
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

function HomeScreen(props) {
  const [data, setData] = useState("");
  const [overlay, setOverlay] = useState(<></>); // Etat d'overlay
  const [exclusivity, setExclusivity] = useState(<></>); // Etat d'exclusivité
  const [quest, setQuest] = useState(0);
  const newMessage = `Bonjour ${props.dataUser.firstName}, je m'apprête à signer un mandat de vente pour un bien qui correspond à votre qûete. Il s'agit d'une villa avec piscine à Vence, entièrement rénovée en 2019. Le propriétaire souhaite vendre rapidement suite à une mutation à l'étranger. Je vous propose de nous rencontrer dans les jours à venir. Cordialement, Renaud`;
  const [offers, setOffers] = useState(0);
  const [results, setResults] = useState([]);
  const [loaderVisible, setLoaderVisible] = useState(true);
  let deviceHeight = Dimensions.get("window").height;
  let deviceWidth = Dimensions.get("window").width;

  const [avatarImg, setAvatarImg] = useState(props.dataUser.avatar);
  const isFocused = useIsFocused();

  // Au chargement du composant, on obtient toutes les données de l'utilisateur.
  useEffect(() => {
    async function userData() {
      const data = await fetch(`http://${MY_IP}/home/userDetail?token=${props.dataUser.token}`);
      const body = await data.json();
      if (body.result) {
        setData(body.user);
        setQuest(body.user.quests.length);
        props.addUser({
          token: body.user.token,
          firstName: body.user.firstName,
          avatar: body.user.avatar,
          quest: body.user.quests,
        });
      } else {
        console.log("error");
      }
    }
    userData();
    console.log("home props.dataUser", props.dataUser.firstName);
  }, []);

  // Fonction pour creer une conversation suite à l'apparition du message EXCLUSIVE sur l'overlay
  var createConversation = async () => {
    console.log("props.dataUser.quest", props.dataUser);

    const data = await fetch(`http://${MY_IP}/inbox/addMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `sender_token=UdQxBmsipgFdvtQvrsqQTg_WopWmh9Jj&buyer_token=${props.dataUser.token}&seller_token=UdQxBmsipgFdvtQvrsqQTg_WopWmh9Jj&quest_id=${props.dataUser.quest[0]._id}&offer_id=617ef1724a67b6421214b74e&message=${newMessage}`,
    });

    const body = await data.json();
    if (body.result == true) {
      //fermeture de l'overlay avant d'aller sur Messages
      setExclusivity(<></>);
      // redirection vers MessagesScreen
      props.navigation.navigate("Messages", {
        conversationId: body.messageSaved._id,
      });
    } else {
      console.log("erreur coté back!");
    }
  };

  useEffect(() => {
    setAvatarImg(props.dataUser.avatar);
  }, [props.dataUser.avatar]);

  //Relance la fonction useData à chaque fois que l'écran est focus
  useFocusEffect(
    useCallback(() => {
      userData();
    }, [])
  );

  const viewExclusivity = () => {
    setExclusivity(
      <Overlay
        isVisible={true}
        overlayStyle={{
          backgroundColor: "white",
          width: deviceWidth * 0.8,
          borderRadius: 15,
          borderColor: "#2D98DA",
          borderWidth: 1,
        }}
        onBackdropPress={() => setExclusivity(<></>)}>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              borderColor: "#2D98DA",
              backgroundColor: "#ECECEC",
              padding: 10,
              borderTopLeftRadius: 13,
              borderTopRightRadius: 13,
              borderWidth: 2,
              width: deviceWidth * 0.75,
              alignSelf: "center",
            }}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                marginRight: 5,
                marginBottom: 10,
              }}>
              <Badge value="PRO" badgeStyle={{ backgroundColor: "#2D98DA" }} />
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#585858" }}>Renaud</Text>
            </View>
            <Image
              style={{
                width: deviceWidth / 6,
                height: deviceWidth / 6,
                borderRadius: 70,
                marginRight: 40,
              }}
              resizeMethod="resize"
              resizeMode="cover"
              source={{
                uri: "https://previews.123rf.com/images/starsstudio/starsstudio1710/starsstudio171000860/88921060-handsome-young-man-profile-shot-indoor-inside-big-modern-building-maybe-a-brand-new-train-station-lo.jpg",
              }}></Image>
          </View>
          <Text
            style={{
              fontSize: 17,
              color: "#2D98DA",
              marginTop: 5,
              marginBottom: 5,
              textAlign: "center",
              fontWeight: "bold",
            }}>
            OFFRE EN AVANT-PREMIÈRE 💎
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: "#585858",
              marginBottom: 10,
              textAlign: "center",
              fontWeight: "bold",
            }}>
            Maison 248m{"\u00b2"} à Vence
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#585858",
              marginBottom: 10,
              textAlign: "justify",
              fontStyle: "italic",
              marginHorizontal: 10,
            }}>
            {newMessage}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              borderTopWidth: 1,
              borderTopColor: "#2D98DA",
              paddingTop: 10,
            }}>
            <View
              style={{
                backgroundColor: "white",
                borderWidth: 3,
                borderColor: "#98989E",
                borderRadius: 20,
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 5,
                paddingBottom: 5,
              }}>
              <MaterialCommunityIcons name="bell-cancel-outline" size={35} color="#98989E" style={{ marginLeft: "auto", marginRight: "auto" }} />
            </View>
            <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1.0 }]} onPress={createConversation}>
              <View
                style={{
                  backgroundColor: "#2D98DA",
                  borderRadius: 20,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                }}>
                <Icon name="handshake" size={40} color="white" style={{ marginLeft: "auto", marginRight: "auto" }} />
              </View>
            </Pressable>
          </View>
        </View>
      </Overlay>
    );
  };

  // Fonction de l'overlay pour le rendre visible ou non.
  const toggleOverlay = (item) => {
    setOverlay(
      <Overlay isVisible={true} overlayStyle={{ backgroundColor: "#F8F7FF" }} onBackdropPress={() => setOverlay(<></>)}>
        <View style={{ padding: 15 }}>
          <Text style={styles.title}>
            Vos critères de recherche <Icon name="search" size={15} color="#2D98DA" style={{ marginLeft: 10 }} /> :{" "}
          </Text>
          <Text style={styles.exclusiveMessage}>Date de création : {item.created && item.created.split("T")[0].replace(/-/g, "/")}</Text>
          <Text style={styles.overText}>Ville : {item.city}</Text>
          <Text style={styles.overText}>Type : {item.type}</Text>
          <Text style={styles.overText}>
            Prix : {item.min_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} à {item.max_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}€
          </Text>
          <Text style={styles.overText}>
            Surface : {item.min_surface} à {item.max_surface} ㎡
          </Text>
          <Text style={styles.overText}>Surface extérieure : {item.outdoor_surface} ㎡</Text>
          <Text style={styles.overText}>
            Nombre de pièces : {item.pieces_min} / {item.pieces_max === 6 ? "6 et +" : item.pieces_max}
          </Text>
          <Text style={styles.overText}>Ascenseur : {item.elevator ? <Icon name="check" size={10} color="#4cd137" style={{ marginLeft: 10 }} /> : <Icon name="times" size={15} color="#e84118" style={{ marginLeft: 10 }} />}</Text>
          <Text style={styles.overText}>Parking : {item.parking ? <Icon name="check" size={10} color="#4cd137" style={{ marginLeft: 10 }} /> : <Icon name="times" size={15} color="#e84118" style={{ marginLeft: 10 }} />}</Text>
          <Text style={styles.overText}>Ancien : {item.is_old ? <Icon name="check" size={10} color="#4cd137" style={{ marginLeft: 10 }} /> : <Icon name="times" size={15} color="#e84118" style={{ marginLeft: 10 }} />}</Text>
          <Text style={styles.overText}>Neuf : {item.is_new ? <Icon name="check" size={10} color="#4cd137" style={{ marginLeft: 10 }} /> : <Icon name="times" size={15} color="#e84118" style={{ marginLeft: 10 }} />}</Text>
          <Text style={styles.overText}>Fibre optique : {item.fiber_optics ? <Icon name="check" size={10} color="#4cd137" style={{ marginLeft: 10 }} /> : <Icon name="times" size={15} color="#e84118" style={{ marginLeft: 10 }} />}</Text>
          <Text style={styles.overText}>Piscine : {item.pool ? <Icon name="check" size={10} color="#4cd137" style={{ marginLeft: 10 }} /> : <Icon name="times" size={15} color="#e84118" style={{ marginLeft: 10 }} />}</Text>
          <Text style={styles.overText}>Balcon : {item.balcony ? <Icon name="check" size={10} color="#4cd137" style={{ marginLeft: 10 }} /> : <Icon name="times" size={15} color="#e84118" style={{ marginLeft: 10 }} />}</Text>
          <Text style={styles.overText}>Terrasse : {item.terrace ? <Icon name="check" size={10} color="#4cd137" style={{ marginLeft: 10 }} /> : <Icon name="times" size={15} color="#e84118" style={{ marginLeft: 10 }} />}</Text>
          <Text style={styles.overText}>Date de commercialisation : {item.market_date ? "oui" : "Pas de préférence"}</Text>
          <Text style={styles.overText}>Joignable par les pro : {item.open_to_pro ? <Icon name="check" size={10} color="#4cd137" style={{ marginLeft: 10 }} /> : <Icon name="times" size={15} color="#e84118" style={{ marginLeft: 10 }} />}</Text>
        </View>
      </Overlay>
    );
  };

  // Réutilisation de la fonction pour le refresh de la page.
  async function userData() {
    const data = await fetch(`http://${MY_IP}/home/userDetail?token=${props.dataUser.token}`);
    const body = await data.json();
    if (body.result) {
      var countresult = [];
      for (let i = 0; i < body.user.quests.length; i++) {
        const res = await fetch(`http://${MY_IP}/countresults?token=${props.dataUser.token}&quest_id=${body.user.quests[i]._id}`);
        const count = await res.json();
        countresult.push(count.listOffers);
      }
      setResults(countresult);
      setData(body.user);
      setQuest(body.user.quests.length);
      setOffers(body.user.offers.length);
      props.addUser({
        token: body.user.token,
        firstName: body.user.firstName,
        avatar: body.user.avatar,
        quest: body.user.quests,
      });
      setLoaderVisible(false);
    } else {
      console.log("error");
    }
  }

  // Fonction de navigation vers la page résultats en y ajoutant l'id de la quest, déclenché via le bouton résultat
  var handleResult = async (id) => {
    props.navigation.navigate("Results", {
      screen: "ResultsScreen",
      questId: id,
    });
  };

  if (isFocused) {
    return (
      <SafeAreaView>
        {overlay}
        {exclusivity}
        <AnimatedLoader visible={loaderVisible} overlayColor="rgba(255,255,255,0.75)" animationStyle={styles.lottie} speed={1} source={require("../assets/loader.json")}>
          <Text></Text>
        </AnimatedLoader>
        <StatusBar backgroundColor={"#2D98DA"} style="light" />
        <Header onRefresh={userData} title={data.firstName} image={avatarImg} iconColor={"rgba(251, 197, 49, 1)"} />
        <ScrollView>
          <Text
            onPress={() => viewExclusivity()}
            style={{
              textAlign: "center",
              fontSize: 20,
              marginVertical: 10,
              color: "#2C98DA",
              fontWeight: "bold",
            }}>
            {quest === 0 ? "\n \n \n \n \n Vous cherchez un bien? \n Lancez votre première quête!" : quest === 1 ? "Votre quête" : `Vos ${quest} quêtes en cours`}
          </Text>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => {
              props.navigation.navigate("AddQuest", {
                screen: "AddQuestScreen",
              });
            }}>
            <Text style={styles.buttonText}>Lancez une quête</Text>
            <Icon name="search-plus" size={20} color="#2D98DA" style={{ marginLeft: 10 }} />
          </TouchableOpacity>
          {data.quests?.map((item, i) => {
            return (
              <View
                key={i}
                style={{
                  backgroundColor: "#F8F7FF",
                  padding: 15,
                  elevation: 5,
                  marginVertical: 5,
                  borderRadius: 10,
                  marginHorizontal: 10,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <Text style={styles.text}>{item.type}</Text>
                  <Text style={styles.text}>{item.city}</Text>
                  <Text style={styles.text}>Rayon {item.rayon} </Text>
                </View>
                <View
                  style={{
                    marginVertical: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <Text style={styles.text}>prix min : {item.min_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}€</Text>
                  <Text style={styles.text}>prix max : {item.max_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}€</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <CreatButton textStyle={{ fontWeight: "bold" }} onPress={() => toggleOverlay(item)}>
                    Détails
                  </CreatButton>
                  <CreatButton
                    result={results[i]}
                    onPress={() => {
                      handleResult(item._id);
                    }}
                    buttonStyle={{ backgroundColor: "rgba(251, 197, 49, 1)" }}>
                    <Text style={[styles.textButton, styles[results[i]]]}>
                      {results[i]} {results[i] > 1 ? "RÉSULTATS" : "RÉSULTAT"}
                    </Text>
                  </CreatButton>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return <View style={{ flex: 1 }}></View>;
  }
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
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  text: {
    color: "#585858",
  },
  title: {
    fontSize: 20,
    color: "#2D98DA",
    marginBottom: 10,
  },

  overText: {
    fontSize: 15,
    color: "#585858",
    marginBottom: 5,
  },
  overT: {
    fontSize: 15,
    color: "#585858",
    marginBottom: 5,
    opacity: 0.5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "#585858",
  },
  textButton: {
    fontWeight: "700",
    color: "#585858",
  },
  0: {
    color: "rgba(0, 0, 0, 0.2)",
  },
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
