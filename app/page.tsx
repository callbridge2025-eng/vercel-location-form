"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [location, setLocation] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        console.log("Accuracy in meters:", accuracy);

        if (accuracy > 100) {
          alert(
            "Weak GPS signal detected. For better accuracy, please move outdoors and refresh the page."
          );
        }

        setLocation({
          latitude,
          longitude,
          accuracy,
        });

        setLoadingLocation(false);
      },
      (error) => {
        alert("Location permission is required.");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true, // 🔥 forces GPS usage
        timeout: 20000,           // wait up to 20 seconds
        maximumAge: 0,            // do NOT use cached location
      }
    );
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!location) {
      alert("Please allow location access and wait for detection.");
      return;
    }

    const formData = {
      name: e.target.name.value,
      phone: e.target.phone.value,
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy,
    };

    await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    alert("Application submitted successfully!");
    e.target.reset();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            fontWeight: 600,
            textAlign: "center",
            color: "#333",
          }}
        >
          Employment Application Form
        </h1>

        <p
          style={{
            fontSize: "14px",
            textAlign: "center",
            color: "#666",
            marginBottom: "20px",
          }}
        >
          Please enter details and submit the form, our HR team will contact you shortly.
        </p>

        {loadingLocation && (
          <p style={{ fontSize: "13px", color: "#888", textAlign: "center" }}>
            Detecting your location...
          </p>
        )}

        {location && (
          <p style={{ fontSize: "12px", color: "green", textAlign: "center" }}>
            Location detected (Accuracy: {Math.round(location.accuracy)} meters)
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            required
            style={inputStyle}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  marginBottom: "16px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "14px",
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #667eea, #764ba2)",
  color: "white",
  fontWeight: 600,
  fontSize: "15px",
  cursor: "pointer",
};
