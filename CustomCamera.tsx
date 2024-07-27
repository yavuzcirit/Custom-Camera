import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CameraComponent = ({ isOpen, onOpen, onClose }:any) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isTorch, setIsTorch] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef:any = useRef(null);

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.005, 1)); 
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.005, 0)); 
  };

  const handleSnap = async () => {
    if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri); 
      console.log(photo.uri);
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Uygulama Kameranıza Erişim İstiyor</Text>
        <Button onPress={requestPermission} title="İzin ver" />
      </View>
    );
  }

  return isOpen ? (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photoUri }} style={styles.photo} />
          <TouchableOpacity style={styles.backButton} onPress={() => setPhotoUri(null)}>
            <MaterialCommunityIcons name="arrow-left" size={30} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing='back'
          enableTorch={isTorch} 
          zoom={zoom}
          ref={cameraRef}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>
                <MaterialCommunityIcons name="close-thick" size={30} color="red" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.torchButton} onPress={() => setIsTorch(prev => !prev)}>
              <Text style={styles.closeText}>
                <MaterialCommunityIcons name={!isTorch ? "flashlight" : "flashlight-off"} size={35} color="yellow" />
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomInButton} onPress={handleZoomIn}>
              <MaterialCommunityIcons name="magnify-plus" size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomOutButton} onPress={handleZoomOut}>
              <MaterialCommunityIcons name="magnify-minus" size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.snapButton} onPress={handleSnap}>
              <MaterialCommunityIcons name="camera" size={60} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    width: 370,
    height: 600,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 23,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  torchButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  zoomInButton: {
    position: 'absolute',
    bottom: 0,
    left: 50,
  },
  zoomOutButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  snapButton: {
    position: 'absolute',
    bottom: 6,
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
});

export default CameraComponent;
