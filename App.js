import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import { API_KEY } from '@env';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const icons = {
  Clouds: 'cloudy',
  Clear: 'day-sunny',
  Snow: 'snowflake',
  Rain: 'rain',
  Drizzle: 'rain',
  Thunderstorm: 'lightning',
};
const transWeather = {
  Clouds: '흐림',
  Clear: '맑음',
  Snow: '눈',
  Rain: '비',
  Drizzle: '이슬비',
  Thunderstorm: '뇌우',
};

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [currentWeather, setCurrentWeather] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    try {
      const { granted } = await Location.requestForegroundPermissionsAsync();
      if (!granted) {
        setOk(false);
      }

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });

      const location = await Location.reverseGeocodeAsync({ latitude, longitude });
      setCity(location[0].city);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      const json = await response.json();
      setCurrentWeather(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Entypo name="location-pin" size={24} color="white" />
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <View
        style={{
          alignItems: 'center',
          marginTop: -80,
        }}
      >
        {currentWeather.length === 0 ? null : (
          <Fontisto name={icons[currentWeather?.weather[0]?.main]} size={68} color="#fff" />
        )}
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        {currentWeather.length === 0 ? (
          //loading...
          <View style={{ ...styles.day, alignItems: 'center' }}>
            <ActivityIndicator color={'white'} style={{ marginTop: 10 }} size="large" />
          </View>
        ) : (
          <View style={styles.day}>
            <Text style={styles.temp}>{parseFloat(currentWeather.main.temp).toFixed(1)}°</Text>
            <Text style={styles.description}>{transWeather[currentWeather.weather[0].main]}</Text>
            <Text style={styles.tinyText}>{currentWeather.weather[0].description}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#263C59' },
  city: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
  },
  cityName: {
    fontSize: 36,
    fontWeight: 500,
    color: '#fff',
  },
  day: {
    flex: 1,
    width: SCREEN_WIDTH,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  temp: { fontSize: 100, marginTop: 50, marginBottom: 20, color: '#fff' },
  description: { fontSize: 30, color: '#fff', fontWeight: 500, marginBottom: 10 },
  tinyText: {
    fontSize: 25,
    marginTop: -5,
    fontWeight: 500,
    color: '#fff',
  },
});
