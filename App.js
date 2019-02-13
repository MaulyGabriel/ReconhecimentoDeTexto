import React, {Component} from 'react';
import { Modal, StyleSheet, View, ToastAndroid, Dimensions, ActivityIndicator, TextInput} from 'react-native';
import { RNCamera} from 'react-native-camera';
import RNTextDetector from "react-native-text-detector";
import { Text, Button, Icon, StyleProvider } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';

const { height, width } = Dimensions.get('window');

 class App extends Component {

  state = {
      title:"Solinftec",
      textRecognition: "",
      imagePath: "",
      modalVisible: false,
      showSpinner: false,
      
  };

  setModalVisible(visible){
    this.setState({modalVisible: visible});
  }

  cropImageRoi(image_path){
  
   ToastAndroid.show('Posicione o texto na área delimitada para o reconhecimento', ToastAndroid.LONG, ToastAndroid.CENTER);
 
   return ImagePicker.openCropper({
      path: image_path,
      width: width-40,
      height:60,
      cropping: true,
      showCropGuidelines: false
    }).then(image =>{

     this.setState({ imagePath: image.path, showSpinner: false});
     
    });

  }

  takePicture = async () => {
    
    this.setState({ showSpinner: true });

    if (this.camera) {

      try{ 

        const options = { quality: 0.5, base64: true };
      
        const data =  await this.camera.takePictureAsync(options);

        setTimeout(()=> {
          this.setState({showSpinner:false})
        }, 1000)

        await this.cropImageRoi(data.uri);

        const visionText = await  RNTextDetector.detectFromUri(this.state.imagePath); 
        
        const lista = visionText.map(it => it.text);

        if(lista[0]){

          this.setState({ textRecognition: lista[0].toUpperCase()});
          console.log("Dados reconhecidos:", lista);
          await this.setModalVisible(true);

        }else{
          this.setState({ textRecognition: "Nenhum texto foi reconhecido".toUpperCase()});
        }

      }catch(e){
        alert(e);
      }
    }
  };

  displaySpinner = () =>
  {
    if(this.state.showSpinner)
    {
      return (
        <View style={styles.regionCapture} >
          <ActivityIndicator size="large" color="#B3E5FC"  />
          <Text style={styles.textRecognition}>Processando a imagem</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        
        <Text style={styles.textRecognition}>{this.state.title}</Text>        
       
        <RNCamera
          ref={camera => {
            this.camera = camera;
          }}
          style={styles.preview}
          captureTarget={this.takePicture}
          type={RNCamera.Constants.Type.back}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          flashMode={RNCamera.Constants.FlashMode.off}
          permissionDialogTitle={"Permission to use camera"}
          permissionDialogMessage={
            "We need your permission to use your camera phone"
          }
        >
       
       {this.displaySpinner}
          
        </RNCamera>
       
        <View style={styles.buttonContainer}>
          <Button rounded onPress={this.takePicture}  rounded style={styles.capture}>
            <Icon name='camera'/>
          </Button>
        </View>
         
        <Modal animationType="slide" transparent={true} visible={this.state.modalVisible} >
          <View style={styles.modal}>
            <View style={styles.contentModal}>

              <Text>Texto reconhecido:</Text>

              <TextInput style={styles.input} 
              value={this.state.textRecognition} 
              editable={true} 
              onChangeText={(textRecognition) => this.setState({textRecognition})}/>
              
              <View style={styles.buttonContainerModal}>
                
                <Button  dark  style={styles.buttonModal} onPress={() => {this.setModalVisible(!this.state.modalVisible); }}>
                  <Text>Voltar</Text>
                </Button>

                <Button dark  style={styles.buttonModal} onPress={() => {this.setModalVisible(!this.state.modalVisible); }}>
                  <Text>Salvar</Text>
                </Button>

              </View>

              <Text>Clique sobre o texto para editar</Text>
              
            </View>
          </View>
        </Modal>
           
      </View>
    );
  }
}
          
export default App;

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "rgba(1, 1, 1, 0.8)", 
   
  },

  preview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"rgba(1, 1, 1, 0.8)",
    
  },
  
  buttonContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
  },

  capture: {
    flex: 0,
    color: '#FFFFFF',
    backgroundColor: "#1E88E5",
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20
  },

  buttonText: {
    fontSize: 14
  },

  textRecognition: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 15,
    padding: 10
    
  },

  regionCapture:{
    padding: 10,
    width: width-40, 
    height: 100,
    backgroundColor:"rgba(1, 1, 1, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)", 
  
  },

  modal:{
    flex:1,
    flexDirection: 'column',
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  
  },

  contentModal:{
    alignItems: "center",
    justifyContent: "center",
    color: "#FFFFFF"

  },

  textModal:{
    top: 40,
    color: "#424242",
    textAlign: "center"
  },


  buttonContainerModal: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
  
  },

  buttonModal: {
    flex: 0,
    color: '#FFFFFF',
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20,
   
  },
  input: {
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: "#424242",
    borderBottomWidth: 1,
  }
});