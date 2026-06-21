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
  sheetTop: number;
}

const VISIBLE_MAP_TOP = 194; // 필터바 하단
const MAP_HEIGHT = 844;

function getVisibleCenterOffset(sheetTop: number): number {
  const visibleBottom = sheetTop > VISIBLE_MAP_TOP ? sheetTop : MAP_HEIGHT;
  const visibleTop    = sheetTop > VISIBLE_MAP_TOP ? VISIBLE_MAP_TOP : 0;
  const visibleCenter = (visibleTop + visibleBottom) / 2;
  return (MAP_HEIGHT / 2) - visibleCenter;
}

export default function KakaoMapView({
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
  sheetTop,
}: KakaoMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const sheetTopRef = useRef(sheetTop);
  useEffect(() => { sheetTopRef.current = sheetTop; }, [sheetTop]);

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

      if (userLocation) {
        setTimeout(() => {
          if (mapRef.current) mapRef.current.panBy(0, getVisibleCenterOffset(sheetTopRef.current));
        }, 0);
        const pos = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
        const glowHtml = `
          <div style="position:relative;width:24px;height:24px;transform:translate(-50%,-50%)">
            <div style="position:absolute;inset:0;border-radius:50%;background:rgba(66,133,244,0.25);animation:glow-pulse 2s ease-in-out infinite"></div>
            <div style="position:absolute;inset:4px;border-radius:50%;background:#4285f4;border:2.5px solid #fff;box-shadow:0 0 6px rgba(66,133,244,0.6)"></div>
          </div>
          <style>@keyframes glow-pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.7}50%{transform:translate(-50%,-50%) scale(1.8);opacity:0}}</style>
        `;
        const overlay = new window.kakao.maps.CustomOverlay({ position: pos, content: glowHtml, zIndex: 20 });
        overlay.setMap(mapRef.current);
      }
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
    markersRef.current = new Map();

    places.forEach((place) => {
      const pos = new window.kakao.maps.LatLng(place.coordinates.lat, place.coordinates.lng);
      const marker = new window.kakao.maps.Marker({ position: pos, map });
      window.kakao.maps.event.addListener(marker, "click", () => {
        onSelectPlace(place);
      });
      markersRef.current.set(place.id, marker);
    });
  }, [places, onSelectPlace]);

  // 장소 선택 시 해당 마커만 표시
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((marker, id) => {
      marker.setMap(selectedPlace === null ? map : id === selectedPlace.id ? map : null);
    });
  }, [selectedPlace]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlace || !window.kakao) return;
    const pos = new window.kakao.maps.LatLng(
      selectedPlace.coordinates.lat,
      selectedPlace.coordinates.lng
    );
    map.panTo(pos);
    setTimeout(() => {
      if (!mapRef.current) return;
      const offset = getVisibleCenterOffset(sheetTopRef.current);
      mapRef.current.panBy(0, offset);
    }, 350);
  }, [selectedPlace]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation || !window.kakao) return;

    const pos = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);

    // 지도 중심을 내 위치로 이동 후, 가시영역(필터바~시트) 정중앙에 오도록 오프셋
    map.setCenter(pos);
    setTimeout(() => {
      if (!mapRef.current) return;
      mapRef.current.panBy(0, getVisibleCenterOffset(sheetTopRef.current));
    }, 0);

    // 글로우 도트 커스텀 오버레이
    const glowHtml = `
      <div style="position:relative;width:24px;height:24px;transform:translate(-50%,-50%)">
        <div style="position:absolute;inset:0;border-radius:50%;background:rgba(66,133,244,0.25);animation:glow-pulse 2s ease-in-out infinite"></div>
        <div style="position:absolute;inset:4px;border-radius:50%;background:#4285f4;border:2.5px solid #fff;box-shadow:0 0 6px rgba(66,133,244,0.6)"></div>
      </div>
      <style>@keyframes glow-pulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.7}50%{transform:translate(-50%,-50%) scale(1.8);opacity:0}}</style>
    `;

    const overlay = new window.kakao.maps.CustomOverlay({
      position: pos,
      content: glowHtml,
      zIndex: 20,
    });
    overlay.setMap(map);

    return () => overlay.setMap(null);
  }, [userLocation]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}