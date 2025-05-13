import { Image, StyleSheet, Platform, View, TouchableOpacity, Text, StatusBar, Dimensions } from 'react-native';
import Map, { Circle, MapPolyline, PROVIDER_GOOGLE } from 'react-native-maps';

import useLocation from '../../hooks/useLocation';
import React, { useEffect, useRef, useState } from 'react';
import useRunning from '../../hooks/useRunning';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RunningInfoView from '../../components/RunningInfo';
import SideBar from '../../components/SideBar';
import { Line, Svg } from 'react-native-svg';
import { floatTo2Decimal, formatTime, getFullDayDescription, getMaxMinCoordinates } from '../../utils/helper';
import { useSelector } from 'react-redux';
import { HistoryRunningInfo, RunningInfo } from '../../store/runningInfo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FlatList } from 'react-native-gesture-handler';

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
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    })
  },[currentPosition.latitude, currentPosition.longitude]);

  async function startStopRun(){
    if(runningInfo.isRunning){ 
      await stopRunning();
      return;
    }
    await startRunning(currentPosition);
  }

  return (
    <View style={{flex: 1}}>
    
      <View style={{...styles.container, paddingTop: insets.top}}>
        <SideBarList listOpen={listOpen} setListOpen={setListOpen} runningHistory={runningHistory}/>
        <View style={{...styles.infoContainer, top: insets.top}}>
          <RunningInfoView 
            runningTime={runningTime} 
            distance={runningInfo.distance} 
            calories={runningInfo.calories}
            start_time={runningInfo.start_time}
            pace={runningInfo.pace}
            setListOpen={setListOpen}
          />
        </View>

        
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
          <Circle center={currentPosition} radius={10} fillColor='#70b8ff' strokeColor='#c2e6ff' strokeWidth={3} zIndex={10}/>
        </Map>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.6} 
          onPress={async () => await startStopRun()}
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
  const runningHistory: HistoryRunningInfo[] = useSelector(state => state.runningHistory);

  return(
    <SideBar open={listOpen} setOpen={setListOpen}>
      <FlatList
        data={[...runningHistory].sort((p1, p2) => (new Date(p1.start_time) < new Date(p2.start_time)) ? 1 : -1)}
        renderItem={({ item, index }) => {
          const { distance, end_time, start_time, calories, pace }: RunningInfo = item;

          const startTime = new Date(start_time);

          const totalSec = ((new Date(end_time)).getTime() - startTime.getTime()) / 1000;
          
          const customTopBorder = index == 0 ? { borderTopWidth: 0, paddingTop: 0} : { borderTopWidth: 1};

          return(
            <View style={{...styles.sideBarItem, ...customTopBorder }}>
              <Text style={styles.italicText}>{getFullDayDescription(startTime)}</Text>
              <RunningInfoView 
                key={index}
                runningTime={formatTime(totalSec)}
                distance={distance}
                calories={calories}
                start_time={start_time}
                pace={pace}
                aditionalStyles={{paddingTop: 0}}
              />
            </View>

          );
        }}
      />
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
    height: '30%',
    maxHeight: 190,
    backgroundColor: "#000",
    position: "absolute",
    left: 0,
    right: 0,
    borderBottomRightRadius: 17,
    borderBottomLeftRadius: 17,
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
  },
  sideBarItem: {
    width: '100%',
    paddingTop: 18,
    paddingBottom: 18,
    borderTopColor: '#ffffff47',
  },
  flex: {
    flex: 1, 
    flexDirection: 'row',
    marginTop: 6,
  },
  halfWidth: {
    width: '50%'
  },
  italicText: {
    color: 'white',
    fontStyle: 'italic'
  },
  majorText: {
    color: 'white',
    fontSize: 30,
    textAlign: 'center'
  },
  minorText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center'
  }
});
