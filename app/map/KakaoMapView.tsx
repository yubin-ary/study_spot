/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
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
  centerTrigger?: number;
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
  centerTrigger,
}: KakaoMapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<number, any>>(new Map());
  const pinElsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const sheetTopRef = useRef(sheetTop);
  const glowOverlayRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
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
      setMapReady(true);
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
    pinElsRef.current = new Map();

    const PIN_SHAPE: Record<string, string> = {
      yellow:   "eed65a445c9579713b6e937826b3acb414ee182e.svg",
      blue:     "78e7d437cbb64061fa6ee1485039af96f1780961.svg",
      cyan:     "c3af32240219a77df411bc3a80160532ee541bd2.svg",
      purple:   "cc1e772dd2e34ccfd2336b8bb203c5caa70ce082.svg",
      lavender: "cc1e772dd2e34ccfd2336b8bb203c5caa70ce082.svg",
    };
    const STAR_WHITE = "1a913dfb1b2099f0b0ebfac754affbeca8db2b15.svg";
    const STAR_YELLOW = "117ea0a25b7a3b7892a5ef5f3e4bd64deb33ce81.svg";

    places.forEach((place) => {
      const pos = new window.kakao.maps.LatLng(place.coordinates.lat, place.coordinates.lng);
      const shape = PIN_SHAPE[place.pinType] ?? PIN_SHAPE.yellow;
      const star = (place.pinType === "purple" || place.pinType === "lavender") ? STAR_YELLOW : STAR_WHITE;

      const pinEl = document.createElement("div");
      pinEl.style.cssText = "position:relative;width:28px;height:42px;cursor:pointer;transition:width 0.15s,height 0.15s;";
      pinEl.innerHTML = `
        <img src="/assets/${shape}" style="position:absolute;inset:0 0 2% 0;width:100%;height:100%" />
        <img src="/assets/${star}" style="position:absolute;top:11%;left:21%;width:58%;height:33%;object-fit:contain" />
      `;
      pinEl.addEventListener("click", () => onSelectPlace(place));

      const overlay = new window.kakao.maps.CustomOverlay({
        position: pos,
        content: pinEl,
        zIndex: 10,
        xAnchor: 0.5,
        yAnchor: 1,
      });
      overlay.setMap(map);
      markersRef.current.set(place.id, overlay);
      pinElsRef.current.set(place.id, pinEl);
    });
  }, [places, onSelectPlace]);

  // 선택된 마커 크게 + 최상위, 나머지 작게
  useEffect(() => {
    pinElsRef.current.forEach((el, id) => {
      const isSelected = selectedPlace !== null && id === selectedPlace.id;
      el.style.width  = isSelected ? "40px" : "22px";
      el.style.height = isSelected ? "60px" : "33px";
    });
    markersRef.current.forEach((overlay, id) => {
      const isSelected = selectedPlace !== null && id === selectedPlace.id;
      overlay.setZIndex(isSelected ? 20 : 10);
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
    if (!map || !userLocation || !window.kakao || centerTrigger === undefined) return;
    const pos = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);
    map.setCenter(pos);
    setTimeout(() => {
      if (!mapRef.current) return;
      mapRef.current.panBy(0, getVisibleCenterOffset(sheetTopRef.current));
    }, 0);
  }, [centerTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation || !window.kakao) return;

    const pos = new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng);

    map.setCenter(pos);
    setTimeout(() => {
      if (!mapRef.current) return;
      mapRef.current.panBy(0, getVisibleCenterOffset(sheetTopRef.current));
    }, 0);

    // 이전 글로우 제거 후 새로 그리기
    if (glowOverlayRef.current) glowOverlayRef.current.setMap(null);

    const glowHtml = `
      <div style="position:relative;width:46px;height:46px;border-radius:23px;background:rgba(255,191,0,0.2);transform:translate(-50%,-50%);">
        <img src="/assets/4fa12631f27ca7d087de38c1353cb4f45f04be7d.svg" style="position:absolute;left:16px;top:16px;width:14px;height:14px;display:block;" />
        <img src="/assets/843fddce33436a5e7f0e81dd97a38b99e6cbe657.svg" style="position:absolute;left:18px;top:18px;width:10px;height:10px;display:block;" />
      </div>
    `;
    const overlay = new window.kakao.maps.CustomOverlay({ position: pos, content: glowHtml, zIndex: 20 });
    overlay.setMap(map);
    glowOverlayRef.current = overlay;

    return () => { overlay.setMap(null); glowOverlayRef.current = null; };
  }, [userLocation, mapReady]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}