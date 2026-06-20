/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { Place } from "../data/mockPlaces";

declare global {
  interface Window {
    kakao: any;
  }
}

interface KakaoMapViewProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  userLocation?: { lat: number; lng: number };
}

export default function KakaoMapView({
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
}: KakaoMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
    if (!appKey) {
      console.error("카카오맵 키(NEXT_PUBLIC_KAKAO_MAP_APP_KEY)가 없습니다. .env.local 확인");
      return;
    }

    function initMap() {
      if (!containerRef.current || mapRef.current) return;
      const center = userLocation
        ? new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
        : new window.kakao.maps.LatLng(37.5926, 127.0165);
      mapRef.current = new window.kakao.maps.Map(containerRef.current, {
        center,
        level: 5,
      });
    }

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(initMap);
      return;
    }

    const scriptId = "kakao-map-sdk";
    if (document.getElementById(scriptId)) {
      const wait = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          clearInterval(wait);
          window.kakao.maps.load(initMap);
        }
      }, 100);
      return () => clearInterval(wait);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.onload = () => window.kakao.maps.load(initMap);
    document.head.appendChild(script);
  }, [userLocation]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.kakao) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    places.forEach((place) => {
      const pos = new window.kakao.maps.LatLng(place.coordinates.lat, place.coordinates.lng);
      const marker = new window.kakao.maps.Marker({ position: pos, map });
      window.kakao.maps.event.addListener(marker, "click", () => {
        onSelectPlace(place);
      });
      markersRef.current.push(marker);
    });
  }, [places, onSelectPlace]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlace || !window.kakao) return;
    const pos = new window.kakao.maps.LatLng(
      selectedPlace.coordinates.lat,
      selectedPlace.coordinates.lng
    );
    map.panTo(pos);
  }, [selectedPlace]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}