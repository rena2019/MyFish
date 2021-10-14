import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react'
import { Button, StyleSheet, Text, View, Alert  } from 'react-native';
import NfcManager, {NfcEvents, Ndef} from 'react-native-nfc-manager';
import { Platform } from 'react-native';

async function initNfc() {
  await NfcManager.start();
}

function readNdef() {
  const cleanUp = () => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.setEventListener(NfcEvents.SessionClosed, null);
  };

  return new Promise((resolve) => {
    let tagFound = null;

    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
      tagFound = tag;
      resolve(tagFound);
      //NfcManager.setAlertMessageIOS('NDEF tag found');
      //console.log("tagFound: " + Ndef.uri.decodePayload(tagFound.ndefMessage[0].payload));
      //NfcManager.unregisterTagEvent().catch(() => 0);
      //return "XX"; 
    });

    NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
      cleanUp();
      if (!tagFound) {
        resolve();
      }
    });

    NfcManager.registerTagEvent();
  });
}

export default class App extends Component {
  
  constructor(props){
    super(props);
    initNfc();
    //readNdef();
    //console.log("constructor");
  }

  state = {
    textValue: 'NDEF:',
    buttonText: 'My ' + Platform.OS + ' button'
  }

  init () {
    console.log("ini");
  }

  onPress = () => {
    this.setState({
      textValue: this.state.textValue + '+'
    });
    //console.log("then:" + readNdef());
    readNdef().then(t => { 
      //console.log(Ndef.uri.decodePayload(t.ndefMessage[0].payload))
      this.setState({
        textValue: 'NDEF: ' + Ndef.uri.decodePayload(t.ndefMessage[0].payload)
      });
    })
  }
  //buttonText:"";
  //buttonText: = ""//Platform.OS' = Platform.OS;

  render() {
    return (
    <View style={styles.container}>
      <Button title={this.state.buttonText} onPress={this.onPress}/>
      <Text>{this.state.textValue}</Text>
      <StatusBar style="auto" />
      
    </View>
  )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
