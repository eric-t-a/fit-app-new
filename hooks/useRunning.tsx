import { setHistoryState } from "../store/runningHistory";
import { RunningInfo, setActiveRunningState } from "../store/runningInfo";
import store from "../store/store";
import { calculateCalories, floatTo1Decimal, getDistanceFromLatLonInMeters, getPace, timeRunning } from "../utils/helper";
import { getData, storeData } from "../utils/storage";
import { useEffect, useState } from "react";
import { LatLng } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";



var timerInterval: any = null;

const runningEmptyState = { isRunning: false, start_time: null, end_time: null, calories: 0, coordinates: [], distance: 0, pace: '00:00' } ;

function setRunningInfo(info: RunningInfo){
    store.dispatch(setActiveRunningState({...info}));
    storeData('runningInfo', {...info});
}

function appendCoordinates(coord: LatLng){
    const runningInfo = store.getState().runningInfo;
    let deltaDistance = 0;
    let deltaCalories = 0;
    const timeNow = new Date();
    if(runningInfo.coordinates.length){
        const lastCoord = runningInfo.coordinates[runningInfo.coordinates.length - 1];
        const deltaTime = (timeNow.getTime() - lastCoord.time.getTime()) / 1000; // seconds

        deltaDistance = getDistanceFromLatLonInMeters(lastCoord.latitude, lastCoord.longitude, coord.latitude, coord.longitude);
        deltaDistance = floatTo1Decimal(deltaDistance)

        deltaCalories = calculateCalories(deltaDistance, deltaTime, 70);
    }
    setRunningInfo({
        ...runningInfo, 
        calories: runningInfo.calories + deltaCalories,
        distance: runningInfo.distance + deltaDistance,
        isRunning: true, 
        coordinates: [...runningInfo.coordinates, {...coord, time: new Date()}]
    });
}

const useRunning = () => {
    const runningInfo = useSelector(state => state.runningInfo);
    const runningHistory = useSelector(state => state.runningHistory);
    const dispatch = useDispatch();
    const [runningTime, setRunningTime] = useState('00:00');

    useEffect(() => {
        if(runningInfo.start_time){ 
            dispatch(setActiveRunningState({
                ...runningInfo,
                pace: getPace(runningInfo.distance,runningInfo.start_time)
            }));
        }
    },[runningInfo.distance])

    async function setupHistory() {
        const history = await getData('runningHistory');
        dispatch(setHistoryState(history ?? []));
    }

    useEffect(() => {
        setupHistory();
    },[])

    function setHistoryRunningInfo(history: RunningInfo[]){
        dispatch(setHistoryState([...history]));
        storeData('runningHistory', [...history]);
    }
    function appendInfoToHistory(info: RunningInfo){
        setHistoryRunningInfo([...runningHistory, info]);
    }

    function startRunning(coord: LatLng) {
        setRunningInfo({
            ...runningInfo, 
            isRunning: true, 
            start_time: new Date(), 
            coordinates: [{...coord, time: new Date()}]
        });
    }

    function stopRunning(){
        setRunningTime(timeRunning(null));
        appendInfoToHistory({
            ...runningInfo,
            end_time: new Date(),
            coordinates: []
        });
        setRunningInfo({...runningEmptyState})
    }



    useEffect(() => {
        if(runningInfo.isRunning){
            timerInterval = setInterval(() => setRunningTime(timeRunning(runningInfo.start_time)), 1000);
            return;
        }

        clearInterval(timerInterval);
    }, [runningInfo.isRunning])

    return { runningInfo, runningHistory, startRunning, appendCoordinates, stopRunning, runningTime };

}

export { appendCoordinates };
export default useRunning;