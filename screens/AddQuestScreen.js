import React, { useState } from "react";
import { View, Text, ScrollView, Dimensions, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Image } from "react-native";

import { MY_IP } from "@env"; /* Variable environnement */

import Icon from "react-native-vector-icons/FontAwesome5";
import { connect } from "react-redux";
import StepIndicator from "react-native-step-indicator";
import { Input, SearchBar, CheckBox, Button, Slider } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import "moment/locale/fr";

const customStyles = {
  stepIndicatorSize: 20,
  currentStepIndicatorSize: 25,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: "#2D98DA",
  stepStrokeWidth: 2,
  stepStrokeFinishedColor: "#2D98DA",
  stepStrokeUnFinishedColor: "#aaaaaa",
  separatorFinishedColor: "#2D98DA",
  separatorUnFinishedColor: "#aaaaaa",
  stepIndicatorFinishedColor: "#2D98DA",
  stepIndicatorUnFinishedColor: "#ffffff",
  stepIndicatorCurrentColor: "#ffffff",
  stepIndicatorLabelFontSize: 10,
  currentStepIndicatorLabelFontSize: 10,
  stepIndicatorLabelCurrentColor: "#2D98DA",
  stepIndicatorLabelFinishedColor: "#ffffff",
  stepIndicatorLabelUnFinishedColor: "#aaaaaa",
  labelColor: "#999999",
  labelSize: 12,
  currentStepLabelColor: "#fe7013",
};

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

function AddQuestScreen(props) {
  if (!props.dataUser) {
    props.navigation.navigate("SignIn", { screen: "SignInScreen" });
  }

  const [maisonChecked, setMaisonChecked] = useState(true);
  const [appartementChecked, setAppartementChecked] = useState(false);
  const [immeubleChecked, setImmeubleChecked] = useState(false);
  const [businessChecked, setBusinessChecked] = useState(false);
  const [autreChecked, setAutreChecked] = useState(false);
  const [parkingChecked, setParkingChecked] = useState(false);
  const [balconyChecked, setBalconyChecked] = useState(false);
  const [oneRoomChecked, setOneRoomChecked] = useState(true);
  const [twoRoomChecked, setTwoRoomChecked] = useState(false);
  const [threeRoomChecked, setThreeRoomChecked] = useState(false);
  const [fourRoomChecked, setFourRoomChecked] = useState(false);
  const [fiveRoomChecked, setFiveRoomChecked] = useState(false);
  const [moreRoomChecked, setMoreRoomChecked] = useState(false);

  //fonction pour supprimer un nombre de pièces dans piecesList quand on décoche une checkbox
  function handleRemoveRoom(number) {
    const newList = piecesList.filter((item) => item !== number);
    setPiecesList(newList);
    // puis on détermine le plus grand et le plus petit de la liste et on attribue ces valeurs à room_max et room_min
  }
  function findMinMax() {
    const newList2 = piecesList;
    if (newList2.length > 1) {
      setPieces_Min(Math.min(...newList2));
      setPieces_Max(Math.max(...newList2));
    }
    // si un seul nombre de pièces, on met pieces_Min et pieces_Max à la meme valeur unique
    else {
      setPieces_Min(newList2[0]);
      setPieces_Max(newList2[0]);
    }
  }

  const [ancienChecked, setAncienChecked] = useState(true);
  const [neufChecked, setNeufChecked] = useState(false);
  const [nb_Pieces, setNb_Pieces] = useState(1);
  const [min_Price, setMin_Price] = useState(0);
  const [max_Price, setMax_Price] = useState(0);
  const [min_Surface, setMin_Surface] = useState(0);
  const [max_Surface, setMax_Surface] = useState(0);
  const [outdoor_surface, setOutdoor_surface] = useState(0);
  const [pieces_Min, setPieces_Min] = useState(1);
  const [pieces_Max, setPieces_Max] = useState(1);
  const [piecesList, setPiecesList] = useState([1]);

  const [fiber_opticsChecked, setFiber_opticsChecked] = useState(false);
  const [poolChecked, setPoolChecked] = useState(false);
  const [elevatorChecked, setElevatorChecked] = useState(false);
  const [datePreferenceChecked, setDatePreferenceChecked] = useState(true);
  const [marketDateFromFront, setMarketDateFromFront] = useState(null);

  const [social_text, setSocial_text] = useState("");
  const [open_to_proChecked, setOpen_to_proChecked] = useState(true);
  const [terraceChecked, setTerraceChecked] = useState(false);

  const [type, setType] = useState("maison");

  const [formProgress, setFormProgress] = useState(0);
  const [dateDisplayFr, setDateDisplayFr] = useState("");
  const [sliderValue, setSliderValue] = useState(0);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    moment.locale("fr");

    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    setDatePreferenceChecked(false);

    setDateDisplayFr(moment(currentDate).format("LL"));
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const [searchValue, setSearchValue] = useState("");
  const [goodType, setGoodType] = useState("maison");
  let changeGoodType = (value) => setGoodType(value);

  let nextStep = async () => {
    if (formProgress < 4) {
      findMinMax();

      processData();
      setFormProgress(formProgress + 1);
    } else if (formProgress == 4) {
      var data = {
        token: props.dataUser.token,
        quest: {
          city: searchValue,
          rayon: sliderValue,
          type: type,
          min_price: min_Price,
          max_price: max_Price,
          min_surface: min_Surface,
          max_surface: max_Surface,
          pieces_min: pieces_Min,
          pieces_max: pieces_Max,
          elevator: elevatorChecked,
          parking: parkingChecked,
          fiber_optics: fiber_opticsChecked,
          pool: poolChecked,
          balcony: balconyChecked,
          market_date: marketDateFromFront,
          created: new Date(),
          outdoor_surface: outdoor_surface,
          open_to_pro: open_to_proChecked,
          terrace: terraceChecked,
          is_online: true,
          is_old: ancienChecked,
          is_new: neufChecked,
          social_text: social_text,
        },
      };

      let envoiBack = await fetch(`http://${MY_IP}/addquest`, {
        method: "post",

        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const body = await envoiBack.json();
      if (body.result == true) {
        console.log("tout est bon coté back la quest a été enregistree en BDD !");
        console.log("body", body);
        console.log("redux", props.dataUser);

        setFormProgress(formProgress + 1);
      } else {
        console.log("erreur coté back!");
      }
    }
  };
  let previousStep = () => {
    setFormProgress(formProgress - 1);
  };
  let dateDisplay = (
    <Text
      style={{
        fontSize: 18,
        textAlign: "left",
        color: "#585858",
        fontWeight: "bold",
        marginBottom: 5,
        marginLeft: 10,
        marginTop: 30,
        marginBottom: 10,
      }}>
      {date}
    </Text>
  );
  let slider = (
    <Slider
      value={Math.round(sliderValue)}
      onValueChange={(value) => setSliderValue(Math.round(value))}
      maximumValue={50}
      minimumValue={0}
      thumbStyle={{ width: 12, height: 12 }}
      style={{ width: 100 }}
      thumbTintColor="#2D98DA"
      minimumTrackTintColor="#585858"
    />
  );

  let sliderValueDisplay = <Text style={{ color: "#585858" }}>Rayon : {sliderValue} km</Text>;

  let outdoorSpace = (
    <View style={{ alignContent: "center" }}>
      <Input placeholder="Min" inputContainerStyle={{ width: deviceWidth / 8 }} onChangeText={(value) => setOutdoor_surface(value)} />
    </View>
  );
  let fiber = (
    <View style={{ flexDirection: "row" }}>
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          borderRadius: 20,
        }}
        center
        title="Fibre optique"
        checked={fiber_opticsChecked}
        checkedColor="#2D98DA"
        onPress={fiber_opticsChecked ? () => setFiber_opticsChecked(false) : () => setFiber_opticsChecked(true)}
      />
    </View>
  );

  let pool = (
    <View style={{ flexDirection: "row" }}>
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          borderRadius: 20,
        }}
        center
        title="Piscine"
        checked={poolChecked}
        checkedColor="#2D98DA"
        onPress={poolChecked ? () => setPoolChecked(false) : () => setPoolChecked(true)}
      />
    </View>
  );

  let elevator = (
    <View style={{ flexDirection: "row" }}>
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          borderRadius: 20,
        }}
        center
        title="Ascenseur"
        checked={elevatorChecked}
        checkedColor="#2D98DA"
        onPress={elevatorChecked ? () => setElevatorChecked(false) : () => setElevatorChecked(true)}
      />
    </View>
  );

  let checkBoxes = (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flexDirection: "column" }}>
        <CheckBox
          containerStyle={{
            borderColor: "#FFFFFF",
            alignSelf: "flex-start",
            alignItems: "flex-start",
            borderRadius: 20,
          }}
          center
          title="1"
          checked={oneRoomChecked}
          checkedColor="#2D98DA"
          onPress={
            oneRoomChecked
              ? () => {
                  setOneRoomChecked(false);
                  handleRemoveRoom(1);
                }
              : () => {
                  setOneRoomChecked(true);
                  setPiecesList([...piecesList, 1]);
                }
          }
        />
        <CheckBox
          containerStyle={{
            borderColor: "#FFFFFF",
            alignSelf: "flex-start",
            alignItems: "flex-start",
            borderRadius: 20,
          }}
          center
          title="2"
          checked={twoRoomChecked}
          checkedColor="#2D98DA"
          onPress={
            twoRoomChecked
              ? () => {
                  setTwoRoomChecked(false);
                  handleRemoveRoom(2);
                }
              : () => {
                  setTwoRoomChecked(true);
                  setPiecesList([...piecesList, 2]);
                }
          }
        />
      </View>
      <View style={{ flexDirection: "column" }}>
        <CheckBox
          containerStyle={{
            borderColor: "#FFFFFF",
            alignSelf: "flex-start",
            alignItems: "flex-start",
            borderRadius: 20,
          }}
          center
          title="3"
          checked={threeRoomChecked}
          checkedColor="#2D98DA"
          onPress={
            threeRoomChecked
              ? () => {
                  setThreeRoomChecked(false);
                  handleRemoveRoom(3);
                }
              : () => {
                  setThreeRoomChecked(true);
                  setPiecesList([...piecesList, 3]);
                }
          }
        />
        <CheckBox
          containerStyle={{
            borderColor: "#FFFFFF",
            alignSelf: "flex-start",
            alignItems: "flex-start",
            borderRadius: 20,
          }}
          center
          title="4"
          checked={fourRoomChecked}
          checkedColor="#2D98DA"
          onPress={
            fourRoomChecked
              ? () => {
                  setFourRoomChecked(false);
                  handleRemoveRoom(4);
                }
              : () => {
                  setFourRoomChecked(true);
                  setPiecesList([...piecesList, 4]);
                  console.log(piecesList);
                }
          }
        />
      </View>
      <View style={{ flexDirection: "column" }}>
        <CheckBox
          containerStyle={{
            borderColor: "#FFFFFF",
            alignSelf: "flex-start",
            alignItems: "flex-start",
            borderRadius: 20,
          }}
          center
          title="5"
          checked={fiveRoomChecked}
          checkedColor="#2D98DA"
          onPress={
            fiveRoomChecked
              ? () => {
                  setFiveRoomChecked(false);
                  handleRemoveRoom(5);
                }
              : () => {
                  setFiveRoomChecked(true);
                  setPiecesList([...piecesList, 5]);
                }
          }
        />
        <CheckBox
          containerStyle={{
            borderColor: "#FFFFFF",
            alignSelf: "flex-start",
            alignItems: "flex-start",
            borderRadius: 20,
          }}
          center
          title="+"
          checked={moreRoomChecked}
          checkedColor="#2D98DA"
          onPress={
            moreRoomChecked
              ? () => {
                  setMoreRoomChecked(false);
                  handleRemoveRoom(6);
                }
              : () => {
                  setMoreRoomChecked(true);
                  setPiecesList([...piecesList, 6]);
                }
          }
        />
      </View>
    </View>
  );

  let checkBoxesComplements = (
    <View style={{}}>
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",

          alignItems: "flex-start",
          borderRadius: 20,
        }}
        title="Stationnement / Box / Garage"
        checked={parkingChecked}
        checkedColor="#2D98DA"
        onPress={parkingChecked ? () => setParkingChecked(false) : () => setParkingChecked(true)}
      />
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          borderRadius: 20,
        }}
        center
        title="Balcon"
        checked={balconyChecked}
        checkedColor="#2D98DA"
        onPress={balconyChecked ? () => setBalconyChecked(false) : () => setBalconyChecked(true)}
      />
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          borderRadius: 20,
        }}
        center
        title="Terrasse"
        checked={terraceChecked}
        checkedColor="#2D98DA"
        onPress={terraceChecked ? () => setTerraceChecked(false) : () => setTerraceChecked(true)}
      />

      {fiber}
      {elevator}
    </View>
  );

  let checkBoxesDates = (
    <View style={{ flexDirection: "column" }}>
      <View>
        <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
          <Button
            onPress={showDatepicker}
            buttonStyle={{
              marginLeft: 10,

              backgroundColor: "#2D98DA",
              borderRadius: 20,
            }}
            icon={<Icon name="calendar-alt" size={18} color="white" style={{ marginRight: 5, marginLeft: 4 }} />}
            iconLeft
          />
          <Text
            style={{
              fontSize: 16,
              textAlign: "left",
              color: "#585858",
              fontWeight: "bold",
              marginLeft: 10,
            }}>
            {dateDisplayFr}
          </Text>
        </View>

        {show && <DateTimePicker testID="dateTimePicker" value={date} mode={mode} is24Hour={true} display="default" onChange={onChange} />}
      </View>
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          borderRadius: 20,
        }}
        center
        title="Pas de préférence"
        checked={datePreferenceChecked}
        checkedColor="#2D98DA"
        onPress={datePreferenceChecked ? () => setDatePreferenceChecked(false) : () => [setDatePreferenceChecked(true), setDate(new Date()), setDateDisplayFr("")]}
      />
    </View>
  );

  let checkBoxesTypes = (
    <View style={{ flexDirection: "row" }}>
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          borderRadius: 20,
        }}
        center
        title="Ancien"
        checked={ancienChecked}
        checkedColor="#2D98DA"
        onPress={ancienChecked ? () => setAncienChecked(false) : () => setAncienChecked(true)}
      />
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          borderRadius: 20,
        }}
        center
        title="Neuf"
        checked={neufChecked}
        checkedColor="#2D98DA"
        onPress={neufChecked ? () => setNeufChecked(false) : () => setNeufChecked(true)}
      />
    </View>
  );
  let radioButtons = (
    <View
      style={{
        marginBottom: 10,
        marginTop: 20,
        flexDirection: "column",
        alignItems: "center",
      }}>
      <Text
        style={{
          fontSize: 18,
          textAlign: "left",
          color: "#585858",
          fontWeight: "bold",
          marginBottom: 5,
          marginLeft: 10,
        }}>
        Type de bien
      </Text>
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          width: deviceWidth / 2,
          borderRadius: 20,
        }}
        center
        title="Maison"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={maisonChecked}
        checkedColor="#2D98DA"
        onPress={maisonChecked ? () => setMaisonChecked(false) : () => [setMaisonChecked(true), setAppartementChecked(false), setImmeubleChecked(false), setBusinessChecked(false), setAutreChecked(false)]}
      />
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          width: deviceWidth / 2,
          borderRadius: 20,
        }}
        center
        title="Appartement"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={appartementChecked}
        checkedColor="#2D98DA"
        onPress={appartementChecked ? () => setAppartementChecked(false) : () => [setAppartementChecked(true), setMaisonChecked(false), setImmeubleChecked(false), setBusinessChecked(false), setAutreChecked(false)]}
      />
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          width: deviceWidth / 2,
          borderRadius: 20,
        }}
        center
        title="Immeuble"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={immeubleChecked}
        checkedColor="#2D98DA"
        onPress={immeubleChecked ? () => setImmeubleChecked(false) : () => [setImmeubleChecked(true), setAppartementChecked(false), setMaisonChecked(false), setBusinessChecked(false), setAutreChecked(false)]}
      />
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          width: deviceWidth / 2,
          borderRadius: 20,
        }}
        center
        title="Local commercial"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={businessChecked}
        checkedColor="#2D98DA"
        onPress={businessChecked ? () => setBusinessChecked(false) : () => [setBusinessChecked(true), setAppartementChecked(false), setMaisonChecked(false), setImmeubleChecked(false), setAutreChecked(false)]}
      />
      <CheckBox
        containerStyle={{
          borderColor: "#FFFFFF",
          alignSelf: "flex-start",
          alignItems: "flex-start",
          width: deviceWidth / 2,
          borderRadius: 20,
        }}
        center
        title="Autre"
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={autreChecked}
        checkedColor="#2D98DA"
        onPress={autreChecked ? () => setAutreChecked(false) : () => [setAutreChecked(true), setAppartementChecked(false), setMaisonChecked(false), setImmeubleChecked(false), setBusinessChecked(false)]}
      />
    </View>
  );
  const styles = StyleSheet.create({
    searchBox: {
      width: 340,
      height: 50,
      fontSize: 18,
      borderRadius: 8,
      borderColor: "#aaa",
      color: "#000",
      backgroundColor: "#fff",
      borderWidth: 1.5,
      paddingLeft: 15,
    },
    container: {
      flex: 1,
      backgroundColor: "lightblue",
      alignItems: "center",
    },
  });

  let formContent = (
    <View style={{ flexDirection: "column", alignItems: "center" }}>
      <Text
        style={{
          fontSize: 18,
          textAlign: "left",
          color: "#585858",
          fontWeight: "bold",

          marginTop: 30,
        }}>
        Localisation
      </Text>

      {/* Recherche Ville classique */}
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          borderColor: "#98989E",
          borderWidth: 0,
          borderRadius: 20,
          paddingRight: 10,
        }}>
        <SearchBar
          placeholder="Ville..."
          onChangeText={(searchValue) => setSearchValue(searchValue)}
          value={searchValue}
          lightTheme={true}
          inputContainerStyle={{
            backgroundColor: "#f2f2f2",
            borderRadius: 20,
          }}
          containerStyle={{
            backgroundColor: "white",
            width: (deviceWidth / 3) * 2,
            borderTopColor: "#FFFFFF",
            borderBottomColor: "#FFFFFF",
            borderRadius: 60,
          }}
        />
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          {sliderValueDisplay}
          {slider}
        </View>
      </View>
      {radioButtons}
    </View>
  );
  let steps = <View></View>;
  let buttonBottom = (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",

        height: deviceHeight / 8,
      }}>
      <Button
        icon={
          <Icon
            name="arrow-left"
            size={15}
            color="#98989E"
            style={{
              marginTop: 3,
              marginBottom: 3,
              marginLeft: 5,
              marginRight: 5,
            }}
          />
        }
        buttonStyle={{
          borderRadius: 50,
          backgroundColor: "white",
          borderWidth: 2,
          borderColor: "#98989E",
        }}
        onPress={previousStep}
      />
      <Button
        title="Continuer"
        icon={<Icon name="arrow-right" size={15} color="white" style={{ marginLeft: 8 }} />}
        buttonStyle={{
          width: deviceWidth / 3,
          borderRadius: 50,
          backgroundColor: "#2D98DA",
        }}
        iconRight
        onPress={nextStep}
      />
    </View>
  );
  // header with stepIndicator 1-2-3
  if (formProgress == 0) {
    buttonBottom = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",

          height: deviceHeight / 8,
        }}>
        <Button
          icon={
            <Icon
              name="arrow-left"
              size={15}
              color="#98989E"
              style={{
                marginTop: 3,
                marginBottom: 3,
                marginLeft: 5,
                marginRight: 5,
                opacity: 0,
              }}
            />
          }
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "white",
            opacity: 0,
          }}
        />
        <Button
          title="Continuer"
          icon={<Icon name="arrow-right" size={15} color="white" style={{ marginLeft: 8 }} />}
          buttonStyle={{
            width: deviceWidth / 3,
            borderRadius: 50,
            backgroundColor: "#2D98DA",
          }}
          iconRight
          onPress={nextStep}
        />
      </View>
    );
    steps = (
      <View style={{ height: deviceHeight / 5 }}>
        <Text
          style={{
            fontSize: 28,
            textAlign: "center",
            color: "#2D98DA",
            fontWeight: "bold",
            marginBottom: 30,
            marginTop: 50,
          }}>
          Créer une quête
        </Text>
        <StepIndicator customStyles={customStyles} currentPosition={0} stepCount={5} />
      </View>
    );
  } else if (formProgress == 1) {
    formContent = (
      <KeyboardAvoidingView
        style={{
          flexDirection: "column",
          alignItems: "center",
          marginTop: "auto",
          marginBottom: "auto",
          borderColor: "#98989E",
          borderWidth: 0,
          borderRadius: 20,
          paddingRight: 10,
        }}>
        <View style={{ flexDirection: "column", alignItems: "center", marginBottom: 50 }}>
          <Text
            style={{
              fontSize: 18,
              textAlign: "left",
              color: "#585858",
              fontWeight: "bold",
              marginLeft: 10,
              marginTop: 30,
            }}>
            Votre budget
          </Text>
          <View style={{ flexDirection: "row" }}>
            <View>
              <Input placeholder="Minimum" inputContainerStyle={{ width: deviceWidth / 4 }} onChangeText={(value) => setMin_Price(value)} maxLength={7} />
            </View>
            <View>
              <Input placeholder="Maximum" inputContainerStyle={{ width: deviceWidth / 4 }} onChangeText={(value) => setMax_Price(value)} maxLength={7} />
            </View>
          </View>
        </View>
        <View>
          <Text
            style={{
              fontSize: 18,
              textAlign: "left",
              color: "#585858",
              fontWeight: "bold",
              marginBottom: 5,
              marginLeft: 10,
            }}>
            Surface habitable (m{"\u00b2"})
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <View>
              <Input placeholder="Min" inputContainerStyle={{ width: deviceWidth / 8 }} onChangeText={(value) => setMin_Surface(value)} maxLength={4} />
            </View>
            <View>
              <Input placeholder="Max" inputContainerStyle={{ width: deviceWidth / 8 }} onChangeText={(value) => setMax_Surface(value)} maxLength={4} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );

    steps = (
      <View style={{ height: deviceHeight / 5 }}>
        <Text
          style={{
            fontSize: 28,
            textAlign: "center",
            color: "#2D98DA",
            fontWeight: "bold",
            marginBottom: 30,
            marginTop: 50,
          }}>
          Créer une quête
        </Text>
        <StepIndicator customStyles={customStyles} currentPosition={1} stepCount={5} />
      </View>
    );
  } else if (formProgress == 2 && appartementChecked == true) {
    formContent = (
      <ScrollView>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text
            style={{
              fontSize: 18,
              textAlign: "left",
              color: "#585858",
              fontWeight: "bold",
              marginLeft: 10,
              marginTop: 30,
            }}>
            Nombre de pièces :
          </Text>

          {checkBoxes}

          <Text
            style={{
              fontSize: 18,
              textAlign: "left",
              color: "#585858",
              fontWeight: "bold",
              marginBottom: 5,
              marginLeft: 10,
              marginTop: 25,
            }}>
            Compléments :
          </Text>
          {checkBoxesComplements}
        </View>
      </ScrollView>
    );
    buttonBottom = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",

          height: deviceHeight / 8,
        }}>
        <Button
          icon={
            <Icon
              name="arrow-left"
              size={15}
              color="#98989E"
              style={{
                marginTop: 3,
                marginBottom: 3,
                marginLeft: 5,
                marginRight: 5,
              }}
            />
          }
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "#98989E",
          }}
          onPress={previousStep}
        />
        <Button
          title="Continuer"
          icon={<Icon name="arrow-right" size={15} color="white" style={{ marginLeft: 8 }} />}
          buttonStyle={{
            width: deviceWidth / 3,
            borderRadius: 50,
            backgroundColor: "#2D98DA",
          }}
          iconRight
          onPress={nextStep}
        />
      </View>
    );
    steps = (
      <View style={{ height: deviceHeight / 5 }}>
        <Text
          style={{
            fontSize: 28,
            textAlign: "center",
            color: "#2D98DA",
            fontWeight: "bold",
            marginBottom: 30,
            marginTop: 50,
          }}>
          Créer une quête
        </Text>
        <StepIndicator customStyles={customStyles} currentPosition={2} stepCount={5} />
      </View>
    );
  } else if (formProgress == 2 && maisonChecked == true) {
    formContent = (
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text
          style={{
            fontSize: 18,
            textAlign: "left",
            color: "#585858",
            fontWeight: "bold",
            marginLeft: 10,
            marginTop: 30,
          }}>
          Nombre de pièces :
        </Text>
        {checkBoxes}
        <Text
          style={{
            fontSize: 18,
            textAlign: "left",
            color: "#585858",
            fontWeight: "bold",
            marginBottom: 0,
            marginTop: 20,
          }}>
          Surface extérieure / terrain (m{"\u00b2"})
        </Text>
        {outdoorSpace}
        <Text
          style={{
            fontSize: 18,
            textAlign: "left",
            color: "#585858",
            fontWeight: "bold",
            marginBottom: 5,
            marginLeft: 10,
            marginTop: 20,
          }}>
          Compléments :
        </Text>
        <CheckBox
          containerStyle={{
            borderColor: "#FFFFFF",
            alignSelf: "center",
            alignItems: "flex-start",
            borderRadius: 20,
          }}
          title="Stationnement / Box / Garage"
          checked={parkingChecked}
          checkedColor="#2D98DA"
          onPress={parkingChecked ? () => setParkingChecked(false) : () => setParkingChecked(true)}
        />
        <CheckBox
          containerStyle={{
            borderColor: "#FFFFFF",
            alignSelf: "center",
            alignItems: "flex-start",
            borderRadius: 20,
          }}
          title="Balcon"
          checked={balconyChecked}
          checkedColor="#2D98DA"
          onPress={balconyChecked ? () => setBalconyChecked(false) : () => setBalconyChecked(true)}
        />
        <CheckBox
          containerStyle={{
            borderColor: "#FFFFFF",
            alignSelf: "center",
            alignItems: "flex-start",
            borderRadius: 20,
          }}
          title="Terrasse"
          checked={terraceChecked}
          checkedColor="#2D98DA"
          onPress={terraceChecked ? () => setTerraceChecked(false) : () => setTerraceChecked(true)}
        />
        <Text
          style={{
            fontSize: 18,
            textAlign: "left",
            color: "#585858",
            fontWeight: "bold",
            marginBottom: 5,
            marginTop: 20,
          }}>
          Équipements:
        </Text>
        {fiber}
        {pool}
      </View>
    );
    buttonBottom = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",

          height: deviceHeight / 8,
        }}>
        <Button
          icon={
            <Icon
              name="arrow-left"
              size={15}
              color="#98989E"
              style={{
                marginTop: 3,
                marginBottom: 3,
                marginLeft: 5,
                marginRight: 5,
              }}
            />
          }
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "#98989E",
          }}
          onPress={previousStep}
        />
        <Button
          title="Continuer"
          icon={<Icon name="arrow-right" size={15} color="white" style={{ marginLeft: 8 }} />}
          buttonStyle={{
            width: deviceWidth / 3,
            borderRadius: 50,
            backgroundColor: "#2D98DA",
          }}
          iconRight
          onPress={nextStep}
        />
      </View>
    );
    steps = (
      <View style={{ height: deviceHeight / 5 }}>
        <Text
          style={{
            fontSize: 28,
            textAlign: "center",
            color: "#2D98DA",
            fontWeight: "bold",
            marginBottom: 30,
            marginTop: 50,
          }}>
          Dîtes-en plus
        </Text>
        <StepIndicator customStyles={customStyles} currentPosition={2} stepCount={5} />
      </View>
    );
  } else if (formProgress == 2 && maisonChecked != true && appartementChecked != true) {
    formContent = (
      <View>
        <Text
          style={{
            fontSize: 18,
            textAlign: "left",
            color: "#585858",
            fontWeight: "bold",
            marginLeft: 10,
            marginTop: 30,
          }}>
          Nombre de pièces :
        </Text>

        {checkBoxes}
      </View>
    );
    buttonBottom = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",

          height: deviceHeight / 8,
        }}>
        <Button
          icon={
            <Icon
              name="arrow-left"
              size={15}
              color="#98989E"
              style={{
                marginTop: 3,
                marginBottom: 3,
                marginLeft: 5,
                marginRight: 5,
              }}
            />
          }
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "#98989E",
          }}
          onPress={previousStep}
        />
        <Button
          title="Continuer"
          icon={<Icon name="arrow-right" size={15} color="white" style={{ marginLeft: 8 }} />}
          buttonStyle={{
            width: deviceWidth / 3,
            borderRadius: 50,
            backgroundColor: "#2D98DA",
          }}
          iconRight
          onPress={nextStep}
        />
      </View>
    );
    steps = (
      <View style={{ height: deviceHeight / 5 }}>
        <Text
          style={{
            fontSize: 28,
            textAlign: "center",
            color: "#2D98DA",
            fontWeight: "bold",
            marginBottom: 30,
            marginTop: 50,
          }}>
          Dîtes-en plus ...
        </Text>
        <StepIndicator customStyles={customStyles} currentPosition={2} stepCount={5} />
      </View>
    );
  } else if (formProgress == 3) {
    buttonBottom = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",

          height: deviceHeight / 8,
        }}>
        <Button
          icon={
            <Icon
              name="arrow-left"
              size={15}
              color="#98989E"
              style={{
                marginTop: 3,
                marginBottom: 3,
                marginLeft: 5,
                marginRight: 5,
              }}
            />
          }
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "#98989E",
          }}
          onPress={previousStep}
        />
        <Button
          title="Continuer"
          icon={<Icon name="arrow-right" size={15} color="white" style={{ marginLeft: 8 }} />}
          buttonStyle={{
            width: deviceWidth / 3,
            borderRadius: 50,
            backgroundColor: "#2D98DA",
          }}
          iconRight
          onPress={nextStep}
        />
      </View>
    );

    formContent = (
      <View
        style={{
          borderWidth: 0,
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          height: deviceHeight * 0.7,
          marginTop: "auto",
          marginBottom: "auto",
          borderColor: "#98989E",
          borderRadius: 20,
          paddingRight: 10,
        }}>
        <View>
          <Text
            style={{
              fontSize: 18,
              textAlign: "left",
              color: "#585858",
              fontWeight: "bold",
              marginLeft: 10,
              marginTop: 30,
            }}>
            Vous souhaitez acheter un bien
          </Text>

          {checkBoxesTypes}
        </View>
        <View>
          <Text
            style={{
              fontSize: 18,
              textAlign: "left",
              color: "#585858",
              fontWeight: "bold",
              marginBottom: 5,
              marginLeft: 10,
              marginTop: 30,
              marginBottom: 10,
            }}>
            Commercialisé depuis le :
          </Text>
          {checkBoxesDates}
        </View>
      </View>
    );

    steps = (
      <View style={{ height: deviceHeight / 5 }}>
        <Text
          style={{
            fontSize: 28,
            textAlign: "center",
            color: "#2D98DA",
            fontWeight: "bold",
            marginBottom: 30,
            marginTop: 50,
          }}>
          Encore quelques infos
        </Text>
        <StepIndicator customStyles={customStyles} currentPosition={3} stepCount={5} />
      </View>
    );
  } else if (formProgress == 4) {
    buttonBottom = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",

          height: deviceHeight / 8,
        }}>
        <Button
          icon={
            <Icon
              name="arrow-left"
              size={15}
              color="#98989E"
              style={{
                marginTop: 3,
                marginBottom: 3,
                marginLeft: 5,
                marginRight: 5,
              }}
            />
          }
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: "white",
            borderWidth: 2,
            borderColor: "#98989E",
          }}
          onPress={previousStep}
        />
        <Button
          title="Publier ma quête !"
          icon={<Icon name="paper-plane" size={15} color="white" style={{ marginLeft: 8 }} />}
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: "#2D98DA",
          }}
          iconRight
          onPress={nextStep}
        />
      </View>
    );

    formContent = (
      <View
        style={{
          height: deviceHeight * 0.7,

          justifyContent: "center",
        }}>
        <Text
          style={{
            fontSize: 18,
            textAlign: "center",
            color: "#585858",
            fontWeight: "bold",
            marginLeft: 10,
            marginTop: 30,
          }}>
          Maximisez vos chances auprès des Vendeurs en écrivant quelques mots sur votre recherche :
        </Text>
        <TextInput
          placeholder=" ☺️ Parlez de votre recherche ..."
          style={{
            backgroundColor: "#F8F7FF",
            height: deviceHeight / 4,
            padding: 20,
            borderRadius: 15,
            width: deviceWidth * 0.9,
            alignSelf: "center",
            marginTop: 20,
          }}
          onChangeText={(value) => setSocial_text(value)}
          maxLength={250}
          textAlignVertical="top"
          multiline={true}
          numberOfLines={3}
          textAlign="justify"
        />
        <CheckBox
          containerStyle={{
            borderColor: "#FFFFFF",
            alignSelf: "center",
            alignItems: "flex-start",
            width: deviceWidth * 0.9,
            borderRadius: 15,
            marginTop: 20,
          }}
          center
          title="Je souhaite être contacté par les professionnels de l'immobilier et accéder à leurs offres en avant-première."
          checked={open_to_proChecked}
          checkedColor="#2D98DA"
          onPress={open_to_proChecked ? () => setOpen_to_proChecked(false) : () => setOpen_to_proChecked(true)}
        />
      </View>
    );
    steps = (
      <View style={{ height: deviceHeight / 5 }}>
        <Text
          style={{
            fontSize: 28,
            textAlign: "center",
            color: "#2D98DA",
            fontWeight: "bold",
            marginBottom: 30,
            marginTop: 50,
          }}>
          Dernière étape !{" "}
        </Text>
        <StepIndicator customStyles={customStyles} currentPosition={4} stepCount={5} />
      </View>
    );

    //// Ecran de validation de la quête et bouton retour HOME
  } else if (formProgress == 5) {
    buttonBottom = (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",

          height: deviceHeight / 8,
        }}>
        <Button
          icon={
            <Icon
              name="arrow-left"
              size={15}
              color="white"
              style={{
                marginTop: 3,
                marginBottom: 3,
                marginLeft: 5,
                marginRight: 5,
              }}
            />
          }
          buttonStyle={{
            borderRadius: 50,
            backgroundColor: "white",
            borderWidth: 0,
            borderColor: "white",
          }}
        />
        <Button
          title="Home"
          icon={<Icon name="home" size={15} color="white" style={{ marginLeft: 8 }} />}
          buttonStyle={{
            width: deviceWidth / 3,
            borderRadius: 50,
            backgroundColor: "#2D98DA",
          }}
          iconRight
          onPress={() => {
            props.navigation.navigate("BottomNavigator", {
              screen: "HomeScreen",
            });
          }}
        />
      </View>
    );

    formContent = (
      <View
        style={{
          borderWidth: 0,
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
          height: deviceHeight * 0.5,
          marginTop: "auto",
          marginBottom: "auto",
          borderColor: "#98989E",
          borderRadius: 20,
          paddingRight: 10,
        }}>
        <View>
          <Text
            style={{
              fontSize: 28,
              textAlign: "center",
              color: "#2D98DA",
              fontWeight: "bold",
              marginBottom: 15,
              marginTop: 50,
            }}>
            Félicitations 🎉
          </Text>
          <Text
            style={{
              fontSize: 18,
              textAlign: "justify",
              color: "#585858",
              fontWeight: "bold",
              marginLeft: 10,
              marginTop: 30,
            }}>
            Votre quête a bien été publiée ! Rendez-vous sur l'espace Home pour accéder aux premières offres qui correspondent à vos critères.
          </Text>
        </View>
      </View>
    );

    steps = (
      <View style={{ height: deviceHeight / 5 }}>
        <View
          style={{
            backgroundColor: "#FBC531",
            width: 120,
            height: 50,
            alignSelf: "center",
            borderRadius: 20,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}>
          <Image source={require("../assets/logo.png")} resizeMode="contain" style={{ width: 100, height: 55 }}></Image>
        </View>
      </View>
    );
  }

  let processData = () => {
    // type de logement
    setType("Maison");
    if (appartementChecked == true) {
      setType("Appartement");
    } else if (immeubleChecked == true) {
      setType("Immeuble");
    } else if (businessChecked == true) {
      setType("Local commercial");
    } else if (autreChecked == true) {
      setType("Autre");
    }

    // Date de commercialisation
    if (datePreferenceChecked == true) {
      setMarketDateFromFront(null);
    }
    if (datePreferenceChecked == false) {
      setMarketDateFromFront(date);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFFFFF" }}>
      <View>{steps}</View>
      <ScrollView>{formContent}</ScrollView>
      {buttonBottom}
    </View>
  );
}

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}

export default connect(mapStateToProps)(AddQuestScreen);
