import { Image, StyleSheet, Platform, View, TouchableOpacity, Text, StatusBar, Dimensions } from 'react-native';
import Map, { MapPolyline, PROVIDER_GOOGLE } from 'react-native-maps';

import useLocation from '../../hooks/useLocation';
import React, { useEffect, useRef, useState } from 'react';
import useRunning from '../../hooks/useRunning';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RunningInfoView from '../../components/RunningInfo';
import SideBar from '../../components/SideBar';
import { Line, Svg } from 'react-native-svg';
import { getMaxMinCoordinates } from '../../utils/helper';
import { useSelector } from 'react-redux';

export default function IndexRun() {
  const { currentPosition, errorMsg } = useLocation();
  const mapRef : any = React.createRef();
  const { runningInfo, runningHistory, startRunning, appendCoordinates, stopRunning, runningTime } = useRunning();
  const insets = useSafeAreaInsets();
  const [listOpen, setListOpen] = useState(false);


  useEffect(() => {
    mapRef.current.animateToRegion({
      latitude: currentPosition.latitude + 0.0001,
      longitude: currentPosition.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001
    })
  },[currentPosition.latitude, currentPosition.longitude]);

  function startStopRun(){
    if(runningInfo.isRunning){ 
      stopRunning();
      return;
    }
    startRunning(currentPosition);
  }
  console.log('curpos',currentPosition)

  return (
    <View style={{flex: 1}}>
    
      <View style={{...styles.container, paddingTop: insets.top}}>
        <SideBarList listOpen={listOpen} setListOpen={setListOpen} runningHistory={runningHistory}/>
        <RunningInfoView 
          runningTime={runningTime} 
          distance={runningInfo.distance} 
          calories={runningInfo.calories}
          start_time={runningInfo.start_time}
          pace={runningInfo.pace}
          setListOpen={setListOpen}
        />
        
        <Map 
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          <MapPolyline 
            strokeWidth={4}
            strokeColor="#ff0000"
            coordinates={[...runningInfo.coordinates]}
          />
        </Map>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.6} 
          onPress={() => startStopRun()}
        >
          <Text style={styles.buttonTitle}>
            {runningInfo.isRunning ? "Finish" : "Start"}
          </Text>
        </TouchableOpacity>
      </View> 
    </View>
  );
}

const SideBarList = React.memo(({listOpen, setListOpen}) => {
  const windowWidth = Dimensions.get('window').width;
  const runningHistory = useSelector(state => state.runningHistory);

  return(
    <SideBar open={listOpen} setOpen={setListOpen}>
      {runningHistory.map((history, i) => {
        const { maxLat, minLat, maxLong, minLong } = getMaxMinCoordinates(history.coordinates);
        const widthNormalizer = 0.8*windowWidth - 48;
        const heightNormalizer = 0.5*windowWidth;

        return(
          <View key={i} style={{width: '100%'}}>
            <Text style={{color: 'white'}}>oi</Text>
            <Svg height={heightNormalizer} width={widthNormalizer}>
              {history.coordinates.map((coord, i) => {
                if(i == history.coordinates.length - 1) return;

                const next = history.coordinates[i+1];
                
                let latStart = (coord.latitude - minLat) * heightNormalizer / (maxLat - minLat);
                let latEnd = (next.latitude - minLat) * heightNormalizer / (maxLat - minLat);
                let longStart = (coord.longitude - minLong) * widthNormalizer / (maxLong - minLong);
                let longEnd = (next.longitude - minLong) * widthNormalizer / (maxLong - minLong);

                return(
                  <Line key={i} x1={longStart} y1={latStart} x2={longEnd} y2={latEnd} stroke="red" strokeWidth="2" />
                );
              })}
            </Svg>
          </View>
        );
      })}
    </SideBar>
  );
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: '#000',
  },
  map: {
    height: '100%'
  },
  infoContainer: {
    flex: 1,
    height: '30%',
    backgroundColor: "#000",
    position: "absolute",
    left: 0,
    right: 0,
    borderBottomRightRadius: 17,
    borderBottomLeftRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  infoText: { 
    color: "#fff"
  },
  button: {
    flex: 1,
    height: 56,
    backgroundColor: "#000",
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});
