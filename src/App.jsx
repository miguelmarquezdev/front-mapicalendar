import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function AvailabilityCalendar() {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("7");
  const [month, setMonth] = useState("3"); // Marzo por defecto
  const [year, setYear] = useState("2025");
  const [selectedSchedule, setSelectedSchedule] = useState("all");
  const [availableSchedules, setAvailableSchedules] = useState([]);

  const routes = [
    { id: "7", name: "Circuit 1 - Machu Picchu Mountain Route" },
    { id: "8", name: "Circuit 1 - Upper Terrace Route" },
    { id: "9", name: "Circuit 1 - Intipunku Gateway Route" },
    { id: "10", name: "Circuit 1 - Inka Bridge Route" },
    { id: "11", name: "Circuit 2 - Classic Designed Route" },
    { id: "12", name: "Circuit 2 - Lower Terrace Route" },
    { id: "13", name: "Circuit 3 - Huayna Picchu Route" },
    { id: "14", name: "Circuit 3 - Royalty Designed Route" },
    { id: "15", name: "Circuit 3 - Great Cavern Route" },
    { id: "16", name: "Circuit 3 - Huchuy Picchu Route" },
  ];

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    fetchAvailability();
  }, [selectedRoute, month, year]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: selectedRoute, year, month }),
      });
      const data = await response.json();
      setAvailability(data.data);
      
      // Extraer horarios disponibles
      const schedules = Object.keys(data.data || {});
      setAvailableSchedules(["all", ...schedules]);
    } catch (error) {
      console.error("Error obteniendo disponibilidad:", error);
    }
    setLoading(false);
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Disponibilidad Machu Picchu</h1>
      <div className="mb-4 flex gap-4 items-center">
        <label className="font-semibold">Routes:</label>
        <select
          className="p-2 border rounded"
          value={selectedRoute}
          onChange={(e) => setSelectedRoute(e.target.value)}
        >
          {routes.map((route) => (
            <option key={route.id} value={route.id}>{route.name}</option>
          ))}
        </select>
        <label className="font-semibold">Month:</label>
        <select
          className="p-2 border rounded"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {months.map((m, index) => (
            <option key={index + 1} value={index + 1}>{m}</option>
          ))}
        </select>
        <label className="font-semibold">Year:</label>
        <input
          type="number"
          className="p-2 border rounded w-20"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <label className="font-semibold">Schedules:</label>
        <select
          className="p-2 border rounded"
          value={selectedSchedule}
          onChange={(e) => setSelectedSchedule(e.target.value)}
        >
          {availableSchedules.map((schedule) => (
            <option key={schedule} value={schedule}>{schedule === "all" ? "All schedules" : schedule}</option>
          ))}
        </select>
      </div>

      {loading && <p>Cargando...</p>}
      <h2 className="text-xl font-semibold mb-2">{months[month - 1]} {year}</h2>
      <div className="grid grid-cols-7 gap-2 bg-white p-4 rounded-lg shadow">
        {["D", "L", "M", "Mi", "J", "V", "S"].map((day, index) => (
          <div key={index} className="font-bold text-center">{day}</div>
        ))}
        {Array(firstDayOfMonth).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="h-12"></div>
        ))}
        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          let availableTickets = 0;

          if (availability) {
            if (selectedSchedule === "all") {
              availableTickets = Object.values(availability)
                .reduce((acc, schedule) => acc + (schedule[formattedDate] || 0), 0);
            } else {
              availableTickets = availability[selectedSchedule]?.[formattedDate] || 0;
            }
          }

          return (
            <div
              key={day}
              className={`h-20 flex flex-col items-center justify-center border rounded p-2 ${
                availableTickets > 0 ? "bg-green-200" : "bg-gray-200"
              }`}
            >
              <span className="font-bold">{day}</span>
              <span className="text-sm">{availableTickets} tickets</span>
              <a
                href={availableTickets > 0 ? "https://happygringotours.com/tour/machu-picchu-day-trip-from-cusco-machu-picchu-tours-one-day/" : "https://happygringotours.com/contact/"}
                target="_blank"
                className={`mt-1 px-2 py-1 text-white rounded text-xs ${availableTickets > 0 ? "bg-blue-500" : "bg-red-500"}`}
              >
                {availableTickets > 0 ? "Reservar" : "Contact Us"}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}