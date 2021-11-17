import React, { useState, useEffect } from "react";
import { View, Dimensions, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { connect } from "react-redux";
import { StatusBar } from "expo-status-bar";
// WebView permettra d'afficher les miniatures des photos sur la carte via du code HTML (problème des images sur react-native-maps)
import { WebView } from "react-native-webview";
import AnimatedLoader from "react-native-animated-loader";

import MapView, { Marker, Callout } from "react-native-maps";
import { Card, Text, Button, ListItem, Avatar, Badge } from "react-native-elements";
import { MY_IP } from "@env"; /* Variable environnement */

import RNPickerSelect from "react-native-picker-select";
import { log } from "react-native-reanimated";

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

function ExplorerScreen(props) {
  const [listQuest, setListQuest] = useState([]);
  const [listOffer, setListOffer] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState("");
  const [loaderVisible, setLoaderVisible] = useState(true);
  // Sans choix de quete on affiche la carte centrée sur Paris
  const [questCityCoord, setQuestCityCoord] = useState({
    latitude: 48.8588897,
    longitude: 2.320041,
  });
  const [questCityRayon, setQuestCityRayon] = useState({
    latitudeDelta: 5.6036,
    longitudeDelta: 5.6036,
  });

  //Au chargement du composant, on cherche toutes les quêtes de l'utilisateur pour faire le menu select
  useEffect(() => {
    console.log("maps props.dataUser", props.dataUser.token);
    async function listQuest() {
      const data = await fetch(`http://${MY_IP}/inbox/?token=${props.dataUser.token}`);
      const body = await data.json();
      var list = body.listQuest.map((quest) => {
        return {
          value: quest._id,
          label: `${quest.city} - ${quest.min_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}/${quest.max_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}€`,
        };
      });
      setListQuest(list);
      setSelectedQuest(body.listQuest[0]._id);
    }
    listQuest();
  }, []);

  //Quand on click sur une quête, on charge les offres de celle ci.
  useEffect(() => {
    async function results() {
      const data = await fetch(`http://${MY_IP}/results/?quest_id=${selectedQuest}&token=${props.dataUser.token}`);
      const body = await data.json();

      setListOffer(body.listOffers);
      setQuestCityCoord({
        latitude: body.cityCoord.latitude,
        longitude: body.cityCoord.longitude,
      });
      var newLatitudeDelta = (body.quest.rayon * 0.01) / 1.11 + (15 * 0.01) / 1.11;
      var newLongitudeDelta = newLatitudeDelta;

      setQuestCityRayon({
        latitudeDelta: newLatitudeDelta,
        longitudeDelta: newLongitudeDelta,
      });
      setLoaderVisible(false);
    }
    results();
  }, [selectedQuest]);

  return (
    <View style={{ flex: 1, marginTop: 25 }}>
      <AnimatedLoader visible={loaderVisible} overlayColor="rgba(255,255,255,0.75)" animationStyle={styles.lottie} speed={1} source={require("../assets/loader_map.json")}>
        <Text></Text>
      </AnimatedLoader>
      <StatusBar backgroundColor={"#2D98DA"} style="light" />

      <View
        style={{
          height: 100,
          backgroundColor: "#2D98DA",
        }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "white",
            width: (deviceWidth * 2) / 3,
            marginTop: 10,
            marginLeft: 10,
          }}>
          Les dernières offres :
        </Text>
        <RNPickerSelect onValueChange={(value) => setSelectedQuest(value)} items={listQuest} placeholder={{ label: "Choisir une quête", value: null }} style={pickerSelectStyles} value={selectedQuest} />
      </View>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: questCityCoord.latitude, // pour centrer la carte
          longitude: questCityCoord.longitude,
          latitudeDelta: questCityRayon.latitudeDelta, // le rayon à afficher à partir du centre (rayon + 5 km)
          longitudeDelta: questCityRayon.longitudeDelta,
        }}
        region={{
          latitude: questCityCoord.latitude, // pour centrer la carte
          longitude: questCityCoord.longitude,
          latitudeDelta: questCityRayon.latitudeDelta, // le rayon à afficher à partir du centre (rayon + 5 km)
          longitudeDelta: questCityRayon.longitudeDelta,
        }}
        zoomEnabled={true}>
        {listOffer.map((offer, i) => {
          if (offer.is_pro) {
            var pro = <Badge status="primary" value="PRO" />;
          } else {
            var pro = <Text></Text>;
          }

          return (
            <Marker
              key={i}
              pinColor="#2D98DA"
              coordinate={{
                latitude: offer.offers.latitude,
                longitude: offer.offers.longitude,
              }}
              opacity={1}>
              <View style={{ borderRadius: 10 }}>
                <Callout
                  onPress={() => {
                    props.navigation.navigate("Listing", {
                      questId: selectedQuest,
                      offerId: offer.offers._id,
                    });
                  }}>
                  <View
                    style={{
                      flexDirection: "column",
                      width: 250,
                      alignItems: "flex-start",
                    }}>
                    <WebView
                      style={{ width: 250, height: 150 }}
                      source={{
                        html: `<img src='${offer.offers.pictures[0].url}' width="100%"/>`,
                      }}></WebView>

                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#2D98DA",
                        marginTop: 0,
                        width: 180,
                      }}>
                      {offer.offers.type} {offer.offers.surface} m{"\u00b2"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#2D98DA",
                        marginTop: 0,
                        width: 180,
                      }}>
                      {offer.offers.city}
                    </Text>
                    <Text style={{ fontSize: 18, color: "#585858" }}>{offer.offers.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €</Text>
                    {pro}
                  </View>
                </Callout>
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 250,
    height: 250,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    fontWeight: "bold",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "white",
    backgroundColor: "#2d98da",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "white",
    backgroundColor: "#2D98DA",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}

export default connect(mapStateToProps)(ExplorerScreen);
