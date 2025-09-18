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

// ✅ Use your deployed backend on Render
const API_BASE_URL = "https://oratio-backend-4.onrender.com";

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
      Alert.alert(
        "Pristup odbijen",
        "Samo @oratio.ba i @office-rs.de emailovi su dozvoljeni."
      );
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
      const res = await fetch(`${API_BAS_
