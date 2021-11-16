import React, { useState, useEffect } from "react";
import { View, Text, Dimensions, ScrollView, Image, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import { StatusBar } from "expo-status-bar";
import { Button, Badge, Overlay, ListItem } from "react-native-elements";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MapView, { Marker, Callout } from "react-native-maps";
import AnimatedLoader from "react-native-animated-loader";

import { connect } from "react-redux";
import { MY_IP } from "@env"; /* Variable environnement */

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

function ListingScreen(props) {
  if (!props.dataUser) {
    props.navigation.navigate("SignIn", { screen: "SignInScreen" });
  }
  //Etat pour l'affichage de la surface extérieure s'il y en a
  const [isVisibleOutdoor, setIsVisibleOutdoor] = useState(false);
  // Etat pour l'overlay "détails"
  const [visible, setVisible] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  // fonction pour faire apparaitre l'overlay
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  // fonction pour mettre la première lettre d'une string en majuscule
  const CapitalizeFirstLetter = (str) => {
    return str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  };
  // fonction pour vérifier si l'annonce a plus de 24h
  //   const isRecent = (dateToCompare) => {
  //     const oneday = 60 * 60 * 24 * 1000

  //     var now = new Date().getTime()
  //     if (now - dateToCompare >= oneday) {
  //       return true
  //     } else {
  //       return false
  //     }
  //   }

  const [newMessage, setNewMessage] = useState("");
  const [questId, setQuestId] = useState(props.route.params.questId);
  const [goodType, setGoodType] = useState("");
  const [offerData, setOfferData] = useState({});
  const [updatedPrice, setUpdatedPrice] = useState(0);
  const [sellerData, setSellerData] = useState({});
  const [mapPreview, setMapPreview] = useState(<View></View>);
  // avatar par défaut pendant le chargement
  const [avatarSource, setAvatarSource] = useState("https://www.luxerecrutement.com/content/files/blank_user.jpg");
  const [pictureList, setPictureList] = useState([]);

  const [imageSource, setImageSource] = useState("https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png");
  const [listOffer, setListOffer] = useState([]);

  useEffect(() => {
    async function displayOffer() {
      const reqFind = await fetch(`http://${MY_IP}/display-offer?offerId=${props.route.params.offerId}&token=${props.dataUser.token}`);
      const resultFind = await reqFind.json();

      setOfferData(resultFind.offerData);
      setSellerData(resultFind.sellerData);
      setUpdatedPrice(resultFind.offerData.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));

      setMapPreview(
        <MapView
          style={{
            flex: 1,
            height: deviceHeight / 8,
            width: deviceWidth,
            alignSelf: "center",
          }}
          initialRegion={{
            latitude: resultFind.offerData.latitude, // pour centrer la carte
            longitude: resultFind.offerData.longitude,
            latitudeDelta: 0.0822, // le rayon à afficher à partir du centre
            longitudeDelta: 0.0621,
          }}
          onPress={() => {
            props.navigation.navigate("MapScreen", {
              offerData: resultFind.offerData,
              questId: props.route.params.questId,
            });
          }}>
          <Marker
            pinColor="#2D98DA"
            key={0}
            coordinate={{
              latitude: resultFind.offerData.latitude,
              longitude: resultFind.offerData.longitude,
            }}
            opacity={1} // Modifier l'opacité
            onPress={() => {
              props.navigation.navigate("MapScreen", {
                offerData: resultFind.offerData,
                questId: props.route.params.questId,
              });
            }}
          />
        </MapView>
      );
      setNewMessage(`👋 Bonjour ${resultFind.sellerData.firstName}, je suis intéressé par votre offre (${resultFind.offerData.type} à ${resultFind.offerData.city}). Pouvez-vous m'en dire un peu plus ?`);
      setGoodType(CapitalizeFirstLetter(resultFind.offerData.type));
      setAvatarSource(resultFind.sellerData.avatar);
      setImageSource(resultFind.offerData.pictures[0].url);
      setPictureList(resultFind.offerData.pictures);
      //on rend la surface extérieure visible si > 0
      if (resultFind.offerData.outdoor_surface > 0) {
        setIsVisibleOutdoor(true);
      }
      setLoaderVisible(false);
    }

    displayOffer();
  }, []);

  var deleteOffer = async (id) => {
    const data = await fetch(`http://${MY_IP}/deleteOffer?token=${sellerData.sellerToken}&id=${id}`, {
      method: "DELETE",
    });
    const body = await data.json();
    if (body.result) {
      props.navigation.navigate("Accueil");
    }
  };

  /// fonction pour créer une conversation quand on clique sur le bouton bleu handshake
  var createConversation = async () => {
    const data = await fetch(`http://${MY_IP}/inbox/addMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `sender_token=${props.dataUser.token}&seller_token=${sellerData.sellerToken}&buyer_token=${props.dataUser.token}&quest_id=${props.route.params.questId}&offer_id=${offerData._id}&message=${newMessage}`,
    });

    const body = await data.json();
    if (body.result == true) {
      console.log("tout est bon coté back les infos ont bien été envoyées vers Messages !");
      // redirection vers MessagesScreen
      props.navigation.navigate("Messages", {
        conversationId: body.messageSaved._id,
      });
    } else {
      console.log("erreur coté back!");
    }
  };

  let descriptionOver = (
    <View
      style={{
        backgroundColor: "#ECECEC",
        margin: 5,
        padding: 10,
        borderRadius: 10,
      }}>
      <Text
        style={{
          fontSize: 20,
          color: "#585858",
        }}>
        Description :
      </Text>
      <Text style={{ color: "#585858", textAlign: "justify" }}>{offerData.description}</Text>
    </View>
  );
  // liste des caractéristiques en bas de l'annonce (piscine, fibre, etc)
  let detailsContent = (
    <View
      style={{
        flex: 1,
        width: deviceWidth * 0.82,
        flexDirection: "column",
        alignItems: "flex-start",
        jusitfyContent: "center",
        borderRadius: 18,
        borderColor: "#FBC531",
        borderWidth: 1,
        alignSelf: "center",
        marginBottom: 20,
        marginTop: 10,
      }}>
      <Text
        style={{
          padding: 5,
          color: "#868686",
          fontSize: 19,
          borderRadius: 30,
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: 5,
          width: deviceWidth / 1.3,
        }}>
        Caractéristiques
      </Text>
      <Text
        style={{
          backgroundColor: "white",
          padding: 5,
          color: "#868686",

          fontWeight: "bold",
          marginBottom: 5,
          width: deviceWidth / 1.3,
        }}>
        Surface habitable : {offerData.surface} m{"\u00b2"}
      </Text>
      <Text
        style={{
          backgroundColor: "white",
          padding: 5,
          color: "#868686",

          fontWeight: "bold",
          marginBottom: 5,
          width: deviceWidth / 1.3,
        }}
        visible={isVisibleOutdoor}>
        Surface extérieure : {offerData.outdoor_surface} m{"\u00b2"}
      </Text>

      <Text
        visible={offerData.pool}
        style={{
          padding: 5,
          color: "#868686",

          fontWeight: "bold",
          marginBottom: 5,
          width: deviceWidth / 2,
        }}>
        <Icon name="check" size={15} color="#FBC531" style={{ marginRight: 15 }} />
        {"  "}
        Piscine 🏊‍♂️
      </Text>
      <Text
        visible={offerData.parking}
        style={{
          padding: 5,
          color: "#868686",

          fontWeight: "bold",
          marginBottom: 5,
        }}>
        <Icon name="check" size={15} color="#FBC531" style={{ marginRight: 15 }} />
        {"  "}
        Stationnement privatif 🚗
      </Text>

      <Text
        visible={offerData.fiber_optics}
        style={{
          padding: 5,
          color: "#868686",

          fontWeight: "bold",
          marginBottom: 5,
        }}>
        <Icon name="check" size={15} color="#FBC531" style={{ marginRight: 15 }} />
        {"  "}
        Raccordé à la fibre optique 👨‍💻
      </Text>
    </View>
  );

  var badgePro;
  if (sellerData.is_pro) {
    badgePro = <Badge value="PRO" badgeStyle={{ backgroundColor: "#2D98DA" }} />;
  }
  let listingContent = (
    <View>
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("ImageScreen", {
            imagesData: pictureList,
          })
        }>
        <Image source={{ uri: imageSource }} style={{ width: deviceWidth, height: deviceHeight / 2.8 }} resizeMethod="resize" resizeMode="center"></Image>
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: "white",
          marginLeft: 10,
          marginRight: 10,
        }}>
        {/* pour afficher le caractère mètre carré m2 en format UNICODE  >>> \u00b2    */}
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: "#585858",
          }}>
          {goodType} {offerData.nb_pieces} pièces {offerData.surface} m{"\u00b2"}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#2D98DA" }}>{updatedPrice} €</Text>
        <Text
          onPress={() => {
            props.navigation.navigate("MapScreen", {
              offerData: offerData,
              questId: props.route.params.questId,
            });
          }}
          style={{ fontSize: 15, color: "#585858" }}>
          {offerData.city}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 0 }}>
          <Icon name="meteor" size={15} color="#FBC531" style={{ marginRight: 5 }} />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#585858",
            }}>
            EN VENTE DEPUIS MOINS DE 24H
          </Text>
        </View>
        <Text
          style={{
            color: "#868686",

            fontWeight: "bold",
          }}
          visible={offerData.exclusive}>
          💎 Bien en exclusivité dans notre agence
        </Text>
        <Button
          title="Description"
          titleStyle={{ color: "#585858" }}
          buttonStyle={{
            width: deviceWidth / 2.8,
            borderRadius: 50,

            backgroundColor: "#FBC531",
            marginTop: deviceHeight / 40,
          }}
          onPress={toggleOverlay}
          icon={<Icon name="book-reader" size={15} color="#585858" style={{ marginRight: 8, marginLeft: 5 }} />}
          iconLeft
        />

        <View
          style={{
            backgroundColor: "#F8F7FF",
            marginLeft: deviceWidth / 20,
            marginRight: deviceWidth / 20,
            padding: deviceWidth / 20,
            paddingBottom: deviceWidth / 20 + 5,
            fontStyle: "italic",
            marginTop: 40,
          }}
          borderRadius={18}>
          <Icon name="quote-left" size={50} color="rgba(0,0,0,0.05)" style={{ marginTop: -40, marginLeft: 0 }} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: -90,
              marginRight: -50,
            }}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "center",
                marginRight: 5,
                marginBottom: 10,
              }}>
              {badgePro}
              <Text style={{ fontSize: 22, fontWeight: "bold", color: "#585858" }}>{sellerData.firstName}</Text>
            </View>

            <Image
              style={{
                width: deviceWidth / 4.5,
                height: deviceWidth / 4.5,
                borderRadius: 70,
                marginRight: 40,
              }}
              resizeMethod="resize"
              resizeMode="center"
              source={{ uri: avatarSource }}></Image>
          </View>
          <Text
            style={{
              fontStyle: "italic",
              lineHeight: 20,
              textAlign: "justify",
              marginTop: 10,
              marginBottom: 5,
              color: "#585858",
            }}>
            {offerData.social_text}
          </Text>
        </View>
        <Icon
          name="quote-right"
          size={50}
          color="rgba(0,0,0,0.05)"
          style={{
            zIndex: 1, // mettre l'image au premier plan sur ios
            elevation: 1,
            marginTop: -30,
            marginLeft: "auto",
            marginRight: deviceWidth / 15 + deviceWidth / 20,
          }}
        />
      </View>
    </View>
  );

  // footer fixe avec les deux boutons pour accepter ou refuser une offre
  let footer = (
    <View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#2D98DA",
          textAlign: "center",
          marginBottom: 5,
        }}>
        Intéressé par l'offre de {sellerData.firstName} ?
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
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
          <MaterialCommunityIcons name="bell-cancel-outline" size={35} color="#98989E" style={{ marginLeft: "auto", marginRight: "auto" }} onPress={() => deleteOffer(offerData._id)} />
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
  );

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
      }}>
      <AnimatedLoader visible={loaderVisible} overlayColor="rgba(255,255,255,0.75)" animationStyle={styles.lottie} speed={1} source={require("../assets/loader.json")}>
        <Text></Text>
      </AnimatedLoader>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: deviceWidth * 0.9 }}>
        <View>{descriptionOver}</View>
      </Overlay>
      <StatusBar backgroundColor={"#2D98DA"} style="light" />
      <ScrollView
        style={{
          backgroundColor: "white",
        }}>
        {listingContent}
        {detailsContent}
        {mapPreview}
      </ScrollView>
      <View
        style={{
          height: deviceHeight / 8,
          backgroundColor: "white",
          justifyContent: "center",
          borderTopWidth: 2,
          borderColor: "#98989E",
        }}>
        {footer}
      </View>
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

export default connect(mapStateToProps)(ListingScreen);
