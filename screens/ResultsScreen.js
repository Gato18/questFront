import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from "react-native";
import { Badge, Button, ListItem, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
import { connect } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { MY_IP } from "@env"; /* Variable environnement */
import AnimatedLoader from "react-native-animated-loader";
import Header from "../components/header";
import { log } from "react-native-reanimated";

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

function ResultsScreen(props) {
  const [listOffer, setListOffer] = useState([]);
  const [quest, setQuest] = useState([]);
  const [loaderVisible, setLoaderVisible] = useState(true);

  //Au chargement du composant, on cherche toutes les offres de la quête choisie
  useEffect(() => {
    async function offers() {
      const data = await fetch(`http://${MY_IP}/results?token=${props.dataUser.token}&quest_id=${props.route.params.questId}`);
      const body = await data.json();
      setListOffer(body.listOffers);
      setQuest(body.quest);
      setLoaderVisible(false);
    }
    offers();
  }, []);

  return (
    <View style={{ backgroundColor: "#FFFFFF", height: "100%" }}>
      <AnimatedLoader visible={loaderVisible} overlayColor="rgba(255,255,255,0.75)" animationStyle={styles.lottie} speed={1} source={require("../assets/loader.json")}>
        <Text></Text>
      </AnimatedLoader>
      {/* <Header title={data.firstName} image={data.avatar} /> */}
      <StatusBar backgroundColor={"#2D98DA"} style="light" />
      <ScrollView>
        {listOffer.map((offer, i) => {
          console.log("is_pro", offer.is_pro);
          var pro;
          var meteor;
          if (offer.is_pro) {
            pro = <Badge value="PRO" badgeStyle={{ backgroundColor: "#2D98DA" }} />;
          }
          if (new Date(offer.offers.created) > new Date(new Date().setDate(new Date().getDate() - 1))) {
            meteor = <Icon name="meteor" size={20} color="#FBC531" style={{ marginRight: 5, marginBottom: 5 }} />;
          }
          return (
            <TouchableOpacity key={i} onPress={() => props.navigation.navigate("Listing", { offerId: offer.offers._id, questId: quest._id })}>
              <Image source={{ uri: offer.offers.pictures[0].url }} style={{ width: deviceWidth, height: deviceHeight / 2.8 }} resizeMethod="resize" resizeMode="center"></Image>
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ marginLeft: 20, marginRight: 10 }}>
                  <Text style={{ fontSize: 22, fontWeight: "bold", color: "#585858" }}>
                    {offer.offers.type} {offer.offers.nb_pieces} pièces {offer.offers.surface} m2
                  </Text>
                  <Text style={{ fontSize: 22, fontWeight: "bold", color: "#2D98DA" }}>{offer.offers.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €</Text>
                  <Text style={{ fontSize: 15, color: "#585858" }}>{offer.offers.city}</Text>
                </View>
                <View style={{ flexDirection: "column", alignItems: "flex-end", marginRight: 20, marginTop: 10 }}>
                  {meteor}
                  {pro}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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

export default connect(mapStateToProps, null)(ResultsScreen);
