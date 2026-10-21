
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CalendarCheck,
  Users,
  RefreshCw,
  Plane,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";
import { obtenerMisReservas } from "../services/reservas";
import "../App.css";

export default function MisReservas({ onBack }) {
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargarReservas() {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerMisReservas();
      setReservas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos cargar tus reservas."
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarReservas();
  }, []);

  function formatearFecha(fecha) {
    if (!fecha) return "No disponible";

    // Evita cambios de día por zona horaria en fechas YYYY-MM-DD.
    const soloFecha = /^\d{4}-\d{2}-\d{2}$/.test(fecha);

    const resultado = soloFecha
      ? (() => {
          const [anio, mes, dia] = fecha.split("-").map(Number);
          return new Date(anio, mes - 1, dia);
        })()
      : new Date(fecha);

    if (Number.isNaN(resultado.getTime())) return fecha;

    return resultado.toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function calcularDuracion(ida, regreso) {
    if (!ida || !regreso) return null;

    const inicio = new Date(`${ida}T12:00:00`);
    const fin = new Date(`${regreso}T12:00:00`);

    if (
      Number.isNaN(inicio.getTime()) ||
      Number.isNaN(fin.getTime())
    ) {
      return null;
    }

    const dias = Math.round(
      (fin.getTime() - inicio.getTime()) / 86400000
    );

    if (dias < 0) return null;
    if (dias === 0) return "Mismo día";

    return `${dias} ${dias === 1 ? "día" : "días"}`;
  }

  function obtenerEstado(estado) {
    const valor = String(estado || "SIN ESTADO");
    const normalizado = valor
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    return {
      texto: valor.replaceAll("_", " "),
      clase: normalizado,
    };
  }

  return (
    <main className="mis-reservas-page">
      <section className="mis-reservas-container">
        <span className="eyebrow">TU CUENTA</span>
        <h1>Mis viajes y reservas</h1>
        <p className="mis-reservas-intro">
          Consultá tus próximas aventuras y todos los detalles
          de tus reservas.
        </p>

        {!cargando && !error && reservas.length > 0 && (
          <div className="reservas-resumen">
            <div>
              <span>Reservas realizadas</span>
              <strong>{reservas.length}</strong>
            </div>
            <div>
              <span>Viajeros reservados</span>
              <strong>
                {reservas.reduce(
                  (total, reserva) =>
                    total + Number(reserva.cantidadCupos || 0),
                  0
                )}
              </strong>
            </div>
          </div>
        )}

        {cargando ? (
          <div className="empty-state">
            <p>Cargando tus reservas...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>{error}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={cargarReservas}
            >
              <RefreshCw size={16} />
              Reintentar
            </button>
          </div>
        ) : reservas.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={36} />
            <h2>Todavía no tenés reservas</h2>
            <p>
              Cuando reserves un paquete, va a aparecer acá.
            </p>
          </div>
        ) : (
          <div className="mis-reservas-lista">
            {reservas.map((reserva) => {
              const estado = obtenerEstado(reserva.estado);
              const duracion = calcularDuracion(
                reserva.fechaIda,
                reserva.fechaRegreso
              );

              return (
                <article
                  className="reserva-card"
                  key={reserva.id}
                >
                  <div className="reserva-card-banner">
                    <div className="reserva-card-banner-icon">
                      <Plane size={30} />
                    </div>

                    <div className="reserva-card-banner-text">
                      <span>TU PRÓXIMA EXPERIENCIA</span>
                      <h2>
                        {reserva.productoNombre ||
                          `Salida #${reserva.salidaId}`}
                      </h2>
                    </div>

                    <span
                      className={`reserva-estado estado-${estado.clase}`}
                    >
                      {estado.texto}
                    </span>
                  </div>

                  <div className="reserva-card-content">
                    <div className="reserva-card-details">
                      <div className="reserva-detail">
                        <CalendarDays size={19} />
                        <div>
                          <span>Fecha de ida</span>
                          <strong>
                            {formatearFecha(reserva.fechaIda)}
                          </strong>
                        </div>
                      </div>

                      <div className="reserva-detail">
                        <CalendarCheck size={19} />
                        <div>
                          <span>Fecha de regreso</span>
                          <strong>
                            {formatearFecha(reserva.fechaRegreso)}
                          </strong>
                        </div>
                      </div>

                      <div className="reserva-detail">
                        <Users size={19} />
                        <div>
                          <span>Pasajeros</span>
                          <strong>
                            {reserva.cantidadCupos}{" "}
                            {reserva.cantidadCupos === 1
                              ? "persona"
                              : "personas"}
                          </strong>
                        </div>
                      </div>

                      {duracion && (
                        <div className="reserva-detail">
                          <Clock size={19} />
                          <div>
                            <span>Duración</span>
                            <strong>{duracion}</strong>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="reserva-card-footer">
                      <div className="reserva-identificacion">
                        <Ticket size={18} />
                        <div>
                          <span>Código de reserva</span>
                          <strong>#{reserva.id}</strong>
                        </div>
                      </div>

                      <div className="reserva-fecha-compra">
                        <span>Reservada el</span>
                        <strong>
                          {reserva.fechaReserva
                            ? new Date(
                                reserva.fechaReserva
                              ).toLocaleString("es-AR", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "No disponible"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className="back-button"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
          Volver al catálogo
        </button>
      </section>
    </main>
  );
}
