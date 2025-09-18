import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

// Backend API (Render deployment)
const API_BASE_URL = "https://oratio-backend.onrender.com";

export default function App() {
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [project, setProject] = useState("R&S 35");
  const [reason, setReason] = useState("Bolestan");

  const allowedDomains = ["@oratio.ba", "@office-rs.de"];

  const projects = [
    "R&S 35",
    "Post AG",
    "Magenta",
    "Carvago",
    "Surya",
    "Screeneo",
    "Lifin",
    "Instamotion",
    "Keyence",
    "Benefit",
  ];

  const reasons = [
    "Bolestan",
    "Obaveze vezane za dokumentaciju",
    "Godišnji odmor",
    "Privatne obaveze",
    "Drugo",
  ];

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const stored = await AsyncStorage.getItem("absenceData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setEmail(parsed.email || "");
        setProject(parsed.project || "R&S 35");
        setReason(parsed.reason || "Bolestan");
      }
    } catch (err) {
      console.log("Error loading storage:", err);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem(
        "absenceData",
        JSON.stringify({ email, project, reason })
      );
    } catch (err) {
      console.log("Error saving storage:", err);
    }
  };

  const handleLogin = () => {
    if (allowedDomains.some((domain) => email.endsWith(domain))) {
      setLoggedIn(true);
      saveData();
    } else {
      Alert.alert("Pristup odbijen", "Samo @oratio.ba i @office-rs.de emailovi su dozvoljeni.");
    }
  };

  const handleConfirm = async () => {
    const payload = {
      email,
      date: date.toLocaleDateString("de-DE"),
      time: time.toLocaleTimeString("de-DE"),
      project,
      reason,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/send-absence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Alert.alert("Potvrđeno", "Vaša prijava odsustva je poslana.");
        saveData();
      } else {
        Alert.alert("Greška", "Slanje e-maila nije uspjelo.");
      }
    } catch (err) {
      Alert.alert("Greška", "Nije moguće povezati se s serverom.");
    }
  };

  if (!loggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Oratio Prijava Odsustva</Text>
        <TextInput
          style={styles.input}
          placeholder="Unesite svoj e-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Prijava odsustva</Text>

      <Text style={styles.label}>Datum:</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{date.toLocaleDateString("de-DE")}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Vrijeme:</Text>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>{time.toLocaleTimeString("de-DE")}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          onChange={(e, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Projekt:</Text>
      <View style={styles.dropdown}>
        <Picker selectedValue={project} onValueChange={setProject}>
          {projects.map((p) => (
            <Picker.Item key={p} label={p} value={p} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Razlog:</Text>
      <View style={styles.dropdown}>
        <Picker selectedValue={reason} onValueChange={setReason}>
          {reasons.map((r) => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Potvrdi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#003366",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "100%",
    borderRadius: 5,
    marginBottom: 15,
  },
  label: {
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#333",
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    width: "100%",
  },
  button: {
    backgroundColor: "#003366",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginTop: 15,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
