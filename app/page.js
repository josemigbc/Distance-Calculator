"use client";
import { useState } from "react";
import StartResetButton from "./StartResetButton";

export default function Home() {

  const [steps, setSteps] = useState([])
  const [isStarted, setIsStarted] = useState(false)
  const [interval,set_Interval] = useState(null)
  const [message,setMessage] = useState(null)

  const addStep = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        setSteps(prevSteps => [...prevSteps, coords])
        setMessage(null)
      }, () => { setMessage("Failed get position. Check if this page has permission.") })
    } else {
      setMessage("No supported")
    }
  }

  const start = () => {
    if (!interval){
      setIsStarted(true)
      set_Interval(setInterval(addStep,5000))
    }
  }

  const reset = () => {
    setSteps([])
    setIsStarted(false)
    clearInterval(interval)
    set_Interval(null)
    console.log('reset')
  }

  const calcularDistanciaEntreDosCoordenadas = (lat1, lon1, lat2, lon2) => {
    // Convertir todas las coordenadas a radianes
    lat1 = gradosARadianes(lat1);
    lon1 = gradosARadianes(lon1);
    lat2 = gradosARadianes(lat2);
    lon2 = gradosARadianes(lon2);
    // Aplicar fórmula
    const RADIO_TIERRA_EN_KILOMETROS = 6371;
    let diferenciaEntreLongitudes = (lon2 - lon1);
    let diferenciaEntreLatitudes = (lat2 - lat1);
    let a = Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return RADIO_TIERRA_EN_KILOMETROS * c;
  };

  const gradosARadianes = (grados) => {
    return grados * Math.PI / 180;
  };

  const calculate = () => {
    let r = 0;
    for (let i = 1; i < steps.length; i++) {
      const coords1 = steps[i - 1]
      const coords2 = steps[i]
      r += calcularDistanciaEntreDosCoordenadas(coords1.latitude, coords1.longitude, coords2.latitude, coords2.longitude)
    }
    return r
  }

  const distanceRan = calculate()

  return (
    <main className="flex justify-center items-center">
      <div className="flex flex-col items-center px-20">
        {message && <p className="text-xl font-bold mb-6 text-red-500">{message}</p>}
        <p className="text-2xl font-bold mb-6">{distanceRan} m</p>
        <p>{steps.map(coords => `${coords.latitude}, ${coords.longitude}`)}<br/></p>
        <StartResetButton handleClick={isStarted ? reset : start} text={isStarted ? "Reset" : "Start"} />
      </div>
    </main>
  )
}
