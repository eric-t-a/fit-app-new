import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { shouldUpdateCoordinates } from "../utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPosition } from '../store/position';
import store from "../store/store";
import { appendCoordinates } from "./useRunning";

const LOCATION_TASK_NAME = 'background-location-task';

const isDev = true;

const useLocation = () => {
    const [errorMsg, setErrorMsg] = useState('');
    const currentPosition = useSelector(state => state.currentPosition);

    const getUserLocation = async () => {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if(foregroundStatus !== 'granted') return;
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if(backgroundStatus !== 'granted') return;
        if(isDev){
            // Location.watchPositionAsync({accuracy: Location.Accuracy.BestForNavigation}, ({ coords }) => {
            //     const { accuracy, latitude, longitude } = coords;
            //     if(shouldUpdateCoordinates(accuracy, {latitude, longitude}, curPos)){
            //         dispatch(setCurrentPosition({latitude, longitude}));
            //         curPos = {latitude, longitude};
            //     }
            // });
        }
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.BestForNavigation,
        });
    };

    useEffect(() => {
        getUserLocation();
    },[]);

    return { currentPosition, errorMsg};
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      return;
    }
    if (data) {
        const { locations } = data;
        console.log(locations[0].coords)
        const { accuracy, latitude, longitude } = locations[0].coords;
        const curPos = store.getState().currentPosition;

        if(shouldUpdateCoordinates(accuracy, {latitude, longitude}, curPos)){
            const coords = { latitude, longitude };
            store.dispatch(setCurrentPosition(coords));
            if(store.getState().runningInfo.isRunning) appendCoordinates(coords);
        }
    }
});

export default useLocation;