import { useEffect, useState } from "react";
import { crearReserva } from "../services/reservas";
import {
  ArrowLeft,
  MapPin,
  Heart,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
  Users,
  RefreshCw,
} from "lucide-react";
import { obtenerSalidas } from "../services/salidas";
import "../App.css";

function formatPrice(price) {
  const amount = Number(price);

  if (!Number.isFinite(amount)) {
    return "Consultar";
  }

  return `$${amount.toLocaleString("es-AR")}`;
}

function formatDate(date) {
  if (!date) return "Fecha a confirmar";

  // Evita cambios de día por diferencias de zona horaria.
  const parts = String(date).split("-");

  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return date;
}

export default function ProductDetail({ product, onBack }) {
  const [showGallery, setShowGallery] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [favorite, setFavorite] = useState(false);

  const [salidas, setSalidas] = useState([]);
  const [loadingSalidas, setLoadingSalidas] = useState(false);
  const [salidaError, setSalidaError] = useState("");
  const [selectedSalidaId, setSelectedSalidaId] = useState(null);
  const [reloadSalidas, setReloadSalidas] = useState(0);
  const [cantidadCupos, setCantidadCupos] = useState(1);
  const [procesandoReserva, setProcesandoReserva] = useState(false);
  const [reservaError, setReservaError] = useState("");
  const [reservaExitosa, setReservaExitosa] = useState(null);

  // <-- SE MOVIÓ ACÁ ARRIBA (antes de los useEffect que la necesitan) -->
  const selectedSalida = salidas.find(
    (salida) => String(salida.id) === String(selectedSalidaId)
  );

  const productImages = Array.isArray(product?.images)
    ? product.images.filter(
        (image) => typeof image === "string" && image.trim()
      )
    : [];

  const images = productImages.length
    ? productImages
    : product?.image
      ? [product.image]
      : [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        ];

  useEffect(() => {
    if (!selectedSalida) return;

    const maxCupos = Math.min(
      10,
      Number(selectedSalida.cuposDisponibles) || 0
    );

    setCantidadCupos((actual) =>
      Math.max(1, Math.min(actual, maxCupos))
    );
  }, [selectedSalidaId, selectedSalida?.cuposDisponibles]);      

  useEffect(() => {
    setShowGallery(false);
    setActiveImage(0);
    setFavorite(false);
    setSelectedSalidaId(null);
  }, [product?.id]);

  // Cargar las salidas correspondientes al producto seleccionado.
  useEffect(() => {
    if (product?.id == null) {
      setSalidas([]);
      setLoadingSalidas(false);
      setSalidaError("");
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        setLoadingSalidas(true);
        setSalidaError("");
        setSalidas([]);
        setSelectedSalidaId(null);

        const data = await obtenerSalidas(product.id);

        if (!Array.isArray(data)) {
          throw new Error(
            "La API no devolvió una lista válida de salidas."
          );
        }

        if (!cancelled) {
          setSalidas(data);
        }
      } catch (error) {
        if (!cancelled) {
          setSalidaError(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar las salidas."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSalidas(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [product?.id, reloadSalidas]);

  useEffect(() => {
    if (!showGallery) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setShowGallery(false);
      }

      if (event.key === "ArrowLeft") {
        setActiveImage(
          (current) => (current - 1 + images.length) % images.length
        );
      }

      if (event.key === "ArrowRight") {
        setActiveImage(
          (current) => (current + 1) % images.length
        );
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showGallery, images.length]);

  if (!product) {
    return (
      <main className="detail-not-found">
        <h2>Producto no encontrado</h2>
        <p>Volvé al catálogo para elegir otra experiencia.</p>

        <button className="btn btn-primary" onClick={onBack}>
          Volver al catálogo
        </button>
      </main>
    );
  }

  function previousImage() {
    setActiveImage(
      (current) => (current - 1 + images.length) % images.length
    );
  }

  function nextImage() {
    setActiveImage(
      (current) => (current + 1) % images.length
    );
  }

  function openImage(index) {
    setActiveImage(index);
    setShowGallery(true);
  }

  async function handleConsultAvailability() {
    if (!selectedSalida) {
      setReservaError("Seleccioná una salida para continuar.");
      return;
    }

    const token = localStorage.getItem("reservaYaToken");

    if (!token) {
      setReservaError(
        "Iniciá sesión para poder reservar esta experiencia."
      );
      return;
    }

    if (cantidadCupos < 1) {
      setReservaError("Seleccioná al menos un pasajero.");
      return;
    }

    if (cantidadCupos > Number(selectedSalida.cuposDisponibles)) {
      setReservaError("No hay suficientes cupos disponibles.");
      return;
    }

    try {
      setProcesandoReserva(true);
      setReservaError("");
      setReservaExitosa(null);

      const reserva = await crearReserva({
        salidaId: selectedSalida.id,
        cantidadCupos: Number(cantidadCupos),
      });

      setReservaExitosa(reserva);

      setSalidas((actuales) =>
        actuales.map((salida) =>
          String(salida.id) === String(selectedSalida.id)
            ? {
                ...salida,
                cuposDisponibles:
                  Number(salida.cuposDisponibles) -
                  Number(cantidadCupos),
              }
            : salida
        )
      );

      setSelectedSalidaId(null);
      setCantidadCupos(1);
    } catch (error) {
      setReservaError(
        error instanceof Error
          ? error.message
          : "No pudimos registrar la reserva."
      );
    } finally {
      setProcesandoReserva(false);
    }

    
  }

  return (
    <main className="product-detail-page">
      <header className="detail-header">
        <div className="detail-header-inner">
          <div className="detail-heading">
            <span className="detail-category">
              {product.category || "Experiencia"}
            </span>

            <h1>{product.name || "Producto"}</h1>
          </div>

          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={18} />
            Volver
          </button>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-location">
          <MapPin size={18} />
          {product.location || "Ubicación a consultar"}
        </div>

        <section
          className="detail-gallery"
          aria-label="Galería del producto"
        >
          <button
            type="button"
            className="gallery-main"
            onClick={() => openImage(0)}
            aria-label="Ver imagen principal"
          >
            <img
              src={images[0]}
              alt={`${product.name || "Producto"}, imagen 1`}
            />
          </button>

          <div className="gallery-side">
            {images.slice(1, 5).map((image, index) => (
              <button
                type="button"
                className="gallery-thumb"
                key={`${image}-${index}`}
                onClick={() => openImage(index + 1)}
                aria-label={`Ver imagen ${index + 2}`}
              >
                <img
                  src={image}
                  alt={`${product.name || "Producto"}, imagen ${
                    index + 2
                  }`}
                />

                {index === 3 && images.length > 5 && (
                  <span className="gallery-more">
                    Ver más <span>＋</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="detail-information">
          <div className="detail-description">
            <span className="eyebrow">CONOCÉ MÁS</span>
            <h2>Acerca de esta experiencia</h2>

            <p>
              {product.description ||
                "Descubrí todos los detalles de esta propuesta."}
            </p>

            <p>
              Explorá esta propuesta y preparate para disfrutar de tu
              próxima experiencia con ReservaYa.
            </p>
          </div>

          <aside className="detail-price-card">
            <button
              type="button"
              className={`detail-favorite ${
                favorite ? "favorite-active" : ""
              }`}
              onClick={() => setFavorite((current) => !current)}
              aria-pressed={favorite}
            >
              <Heart
                size={19}
                fill={favorite ? "currentColor" : "none"}
              />
              {favorite ? "Guardado" : "Guardar favorito"}
            </button>

            <span className="detail-price-label">
              Precio de referencia
            </span>

            <strong className="detail-price">
              {formatPrice(product.price)}
            </strong>

            <p>
              El precio final dependerá de la disponibilidad del servicio.
            </p>
          </aside>
        </section>

        {/* Políticas del producto - Historia #26 */}
        <section className="detail-policies">
          <h2>Políticas de la experiencia</h2>

          <div className="detail-policies-grid">
            <article className="detail-policy-card">
              <h3>Reservas y cancelaciones</h3>
              <p>
                Las reservas están sujetas a disponibilidad. Antes de
                realizar una reserva, verificá las fechas y los cupos
                disponibles de la experiencia.
              </p>
            </article>

            <article className="detail-policy-card">
              <h3>Responsabilidad del usuario</h3>
              <p>
                El usuario debe revisar la información del producto y
                presentarse en las fechas y horarios correspondientes
                a la experiencia reservada.
              </p>
            </article>

            <article className="detail-policy-card">
              <h3>Cuidados y precauciones</h3>
              <p>
                Se recomienda seguir las indicaciones específicas del
                proveedor y respetar las normas de seguridad aplicables
                a cada actividad.
              </p>
            </article>
          </div>
        </section>

        {/* Disponibilidad y selección de salidas */}
        <section className="detail-information">
          <div className="detail-description">
            <span className="eyebrow">PLANIFICÁ TU VIAJE</span>
            <h2>Salidas disponibles</h2>
            <p>
              Elegí las fechas que mejor se adapten a tu viaje.
              Cada salida tiene sus propios cupos.
            </p>
          </div>
        </section>

        <section
          className="detail-salidas"
          aria-label="Salidas disponibles"
        >
          {loadingSalidas ? (
            <div className="empty-state">
              <p>Buscando fechas disponibles...</p>
            </div>
          ) : salidaError ? (
            <div className="empty-state" role="alert">
              <h3>No pudimos cargar las salidas</h3>
              <p>{salidaError}</p>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  setReloadSalidas((current) => current + 1)
                }
              >
                <RefreshCw size={16} />
                Reintentar
              </button>
            </div>
          ) : salidas.length === 0 ? (
            <div className="empty-state">
              <CalendarDays size={32} />
              <h3>Próximamente nuevas salidas</h3>
              <p>
                Todavía no hay fechas disponibles para esta experiencia.
                Volvé a consultar más adelante.
              </p>
            </div>
          ) : (
            <>
              <div className="detail-salidas-grid">
                {salidas.map((salida) => {
                  const isSelected =
                    String(selectedSalidaId) === String(salida.id);

                  const cupos = Number(salida.cuposDisponibles ?? 0);

                  return (
                    <article
                      key={salida.id}
                      className={`detail-salida-card ${
                        isSelected ? "detail-salida-selected" : ""
                      }`}
                    >
                      <div className="detail-salida-dates">
                        <CalendarDays size={22} />

                        <div>
                          <span>Fecha de ida</span>
                          <strong>
                            {formatDate(salida.fechaIda)}
                          </strong>
                        </div>
                      </div>

                      <div className="detail-salida-dates">
                        <ArrowRightIcon />

                        <div>
                          <span>Fecha de regreso</span>
                          <strong>
                            {formatDate(salida.fechaRegreso)}
                          </strong>
                        </div>
                      </div>

                      <div className="detail-salida-cupos">
                        <Users size={18} />

                        <span>
                          {cupos} {cupos === 1 ? "cupo disponible" : "cupos disponibles"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={
                          isSelected
                            ? "btn btn-primary detail-select-salida"
                            : "btn btn-outline detail-select-salida"
                        }
                        disabled={cupos <= 0}
                        aria-pressed={isSelected}
                        onClick={() => setSelectedSalidaId(salida.id)}
                      >
                        {cupos <= 0
                          ? "Sin cupos"
                          : isSelected
                            ? "Salida seleccionada ✓"
                            : "Elegir esta salida"}
                      </button>
                    </article>
                  );
                })}
              </div>

              <div className="detail-salida-confirmation">
                {reservaExitosa && (
                  <p className="reserva-exito" role="status">
                    ¡Reserva realizada con éxito! Ya podés consultar tus reservas.
                  </p>
                )}

                {reservaError && (
                  <p className="reserva-error" role="alert">
                    {reservaError}
                  </p>
                )}
                {selectedSalida ? (
                  <p>
                    Salida elegida:{" "}
                    <strong>
                      {formatDate(selectedSalida.fechaIda)} al{" "}
                      {formatDate(selectedSalida.fechaRegreso)}
                    </strong>
                  </p>
                ) : (
                  <p>Seleccioná una salida para continuar.</p>
                )}

                <button
                  type="button"
                  className="btn btn-primary detail-reserve-btn"
                  disabled={!selectedSalida}
                  onClick={handleConsultAvailability}
                >
                  Consultar esta salida
                </button>
              {selectedSalida && (
                <div className="detail-passengers">
                  <label htmlFor="cantidad-cupos">
                    <Users size={18} />
                    Cantidad de pasajeros
                  </label>

                  <select
                    id="cantidad-cupos"
                    value={cantidadCupos}
                    onChange={(event) =>
                      setCantidadCupos(Number(event.target.value))
                    }
                    disabled={procesandoReserva}
                  >
                    {Array.from(
                      {
                        length: Math.min(
                          10,
                          Number(selectedSalida.cuposDisponibles)
                        ),
                      },
                      (_, index) => index + 1
                    ).map((cantidad) => (
                      <option key={cantidad} value={cantidad}>
                        {cantidad} {cantidad === 1 ? "pasajero" : "pasajeros"}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              </div>
            </>
          )}
        </section>
      </div>

      {showGallery && (
        <div
          className="gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Galería de imágenes"
          onClick={() => setShowGallery(false)}
        >
          <button
            type="button"
            className="gallery-close"
            onClick={() => setShowGallery(false)}
            aria-label="Cerrar galería"
          >
            <X size={26} />
          </button>

          <span className="gallery-counter">
            {activeImage + 1} / {images.length}
          </span>

          <button
            type="button"
            className="gallery-navigation gallery-previous"
            onClick={(event) => {
              event.stopPropagation();
              previousImage();
            }}
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={30} />
          </button>

          <img
            className="gallery-modal-image"
            src={images[activeImage]}
            alt={`${product.name || "Producto"}, imagen ${
              activeImage + 1
            }`}
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            className="gallery-navigation gallery-next"
            onClick={(event) => {
              event.stopPropagation();
              nextImage();
            }}
            aria-label="Imagen siguiente"
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </main>
  );
}

function ArrowRightIcon() {
  return <ChevronRight size={22} />;
}