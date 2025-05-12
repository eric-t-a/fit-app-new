import { floatTo2Decimal, getPace, timeRunning } from "../utils/helper";
import React, { Dispatch, SetStateAction, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface RunningInfoProps{
    runningTime: string;
    distance: number;
    calories: number;
    start_time: null | Date;
    pace: string;
    setListOpen: Dispatch<SetStateAction<boolean>>;
}

const RunningInfoView = ({ runningTime, distance, calories, start_time, pace, setListOpen }: RunningInfoProps) => {
    const insets = useSafeAreaInsets();

    return(
        <View style={{...styles.infoContainer, top: insets.top}}>
            <View style={{...styles.infoInner}}>
                <TouchableOpacity 
                    style={{...styles.infoList}}
                    activeOpacity={0.6} 
                    onPress={() => setListOpen(true)}
                >
                    <FontAwesome6 name="list-ul" size={24} color="white" />
                </TouchableOpacity>
                <View style={{paddingTop: 1, marginBottom: 24}}>
                    <Text style={{...styles.infoText, ...styles.timeText}}>
                    {runningTime}
                    </Text>
                </View>
                <View style={styles.infoStats}>
                    <View style={styles.infoBlock}>
                        <Text style={{...styles.infoTextValue, ...styles.infoText}}>
                            {floatTo2Decimal(distance / 1000).toFixed(2)}
                        </Text>
                        <Text style={styles.infoText}>
                            km
                        </Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={{...styles.infoTextValue, ...styles.infoText}}>
                            {Math.floor(calories)}
                        </Text>
                        <Text style={styles.infoText}>
                            kcal
                        </Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={{...styles.infoTextValue, ...styles.infoText}}>
                            {start_time ? pace : '00:00'}
                        </Text>
                        <Text style={styles.infoText}>
                            min/km
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    infoInner: {
        position: 'relative',
        flex: 1,
        padding: 24,
        alignItems: "center",
        flexWrap: 'wrap',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    infoList: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 24
    },
    infoBlock: {
        flex: 1,
    },
    infoStats: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoText: { 
      color: "#fff",
      textAlign: "center"
    },
    infoTextValue: { 
        fontSize: 24,
      },
    timeText: {
        fontSize: 48,
        flexBasis: null
    }
  });

  export default RunningInfoView;