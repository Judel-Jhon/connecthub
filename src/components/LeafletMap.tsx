/**
 * LeafletMap — Embedded interactive map using WebView + Leaflet.js
 * No API key required. Works in Expo Go.
 * Uses OpenStreetMap tiles (free, no auth).
 */
import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface Props {
  latitude: number;
  longitude: number;
  /** Height of the map container (default: 220) */
  height?: number;
  /** Zoom level 1–19 (default: 16) */
  zoom?: number;
  /** Optional popup label shown on the pin */
  label?: string;
}

export function LeafletMap({ latitude, longitude, height = 220, zoom = 16, label }: Props) {
  const popupHtml = label
    ? `.bindPopup(${JSON.stringify(label)}, { maxWidth: 220 }).openPopup()`
    : '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map', {
      center: [${latitude}, ${longitude}],
      zoom: ${zoom},
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom red SVG marker
    const redIcon = L.divIcon({
      html: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="42" viewBox="0 0 30 42"><path d="M15 0C6.7 0 0 6.7 0 15c0 10 15 27 15 27s15-17 15-27C30 6.7 23.3 0 15 0z" fill="#EF4444" stroke="#B91C1C" stroke-width="1.5"/><circle cx="15" cy="15" r="6" fill="white"/></svg>',
      className: '',
      iconSize: [30, 42],
      iconAnchor: [15, 42],
      popupAnchor: [0, -44],
    });

    const marker = L.marker([${latitude}, ${longitude}], { icon: redIcon })
      .addTo(map)
      ${popupHtml};

    // Pulsing circle overlay around pin
    L.circle([${latitude}, ${longitude}], {
      color: '#EF4444',
      fillColor: '#FCA5A5',
      fillOpacity: 0.18,
      radius: 60,
      weight: 2,
    }).addTo(map);
  </script>
</body>
</html>`;

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator color="#4F46E5" />
          </View>
        )}
        mixedContentMode={Platform.OS === 'android' ? 'always' : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  webview: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  loader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
