import { useEffect, useState } from "react";
import ProductDetail from "./pages/ProductDetail";
import AdminPanel from "./pages/AdminPanel";
import AuthModal from "./components/AuthModal";
import MisReservas from "./pages/MisReservas";
import {
  obtenerFavoritos,
  agregarFavorito,
  quitarFavorito,
} from "./services/favoritos";
import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "./services/categorias";
import {
  obtenerProductos,
  buscarProductosDisponibles,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "./services/productos";
import {
  Search,
  Hotel,
  Plane,
  Shirt,
  CarFront,
  Tag,
  ArrowRight,
  Heart,
  MapPin,
  Menu,
  X,
  Compass,
  Sparkles,
  Zap
} from "lucide-react";


function Header({ onHome, user, onLogin, onRegister, onLogout, onMisReservas, onFavoritos, onAdmin }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function goHome() {
    setMenuOpen(false);
    onHome();
  }

  const displayName = user?.name || user?.email || "Usuario";

  const initials = displayName
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const isAdmin = user?.role === "ROLE_ADMIN" || (user?.roles ?? []).includes("ROLE_ADMIN");

  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          href="#inicio"
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            goHome();
          }}
        >
          {/* LOGO INNOVADOR CON DEGRADADO E ÍCONO COMPASS */}
          <div className="brand-logo-innovative">
            <Compass className="brand-icon-spin" size={24} />
          </div>
          <span className="brand-text">
            <strong className="brand-title-gradient">ReservaYa</strong>
            <small>Experiencias sin límites</small>
          </span>
        </a>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={`header-actions ${menuOpen ? "open" : ""}`}>
          {user ? (
            <>
              <div className="user-badge" title={user.email}>
                <span className="user-avatar">{initials || "U"}</span>
                <span>{displayName}</span>
              </div>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setMenuOpen(false);
                  onMisReservas();
                }}
              >
                Mis reservas
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setMenuOpen(false);
                  onFavoritos();
                }}
              >
                <Heart size={16} />
                Favoritos
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
              >
                Cerrar sesión
              </button>

              {isAdmin && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setMenuOpen(false);
                    onAdmin();
                  }}
                >
                  Panel Administración
                </button>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setMenuOpen(false);
                  onRegister();
                }}
              >
                Crear cuenta
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setMenuOpen(false);
                  onLogin();
                }}
              >
                Iniciar sesión
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function ProductCard({
  product,
  onSelectProduct,
  isFavorite,
  onToggleFavorite,
}) {
  const description = product.description || "";
  const needsExpansion = description.length > 120;

  return (
    <article className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} />

        <span className="image-category">
          {product.category}
        </span>

        <button
          type="button"
          className={`favorite-btn ${
            isFavorite ? "favorite-active" : ""
          }`}
          onClick={() => onToggleFavorite(product)}
          aria-label={
            isFavorite
              ? "Quitar de favoritos"
              : "Marcar como favorito"
          }
          aria-pressed={isFavorite}
        >
          <Heart
            size={19}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="product-info">
        <div className="product-location">
          <MapPin size={15} />
          {product.location}
        </div>

        <h3>{product.name}</h3>

        <div className="product-description-wrapper">
          <p className="product-description">
            {description ||
            "Descubrí todos los detalles de esta propuesta."}
          </p>

          {needsExpansion && (
            <button
              type="button"
              className="read-more-btn"
              onClick={() => onSelectProduct(product)}
            >
              Leer más →
            </button>
          )}
        </div>

        <div className="product-bottom">
          <div>
            <small>Precio de referencia</small>
            <strong>
              ${Number(product.price || 0).toLocaleString("es-AR")}
            </strong>
          </div>

          <button
            className="detail-btn"
            onClick={() => onSelectProduct(product)}
          >
            Ver detalle <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Footer({ onHome }) {
  return (
    <footer className="site-footer">
      <a
        href="#inicio"
        className="footer-brand"
        onClick={(event) => {
          event.preventDefault();
          onHome();
        }}
      >
        <div className="brand-logo-innovative" style={{ width: "32px", height: "32px" }}>
          <Compass size={18} />
        </div>
        <strong>ReservaYa</strong>
      </a>

      <p>
        © {new Date().getFullYear()} ReservaYa. Todos los derechos reservados.
      </p>
    </footer>
  );
}

function App() {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [authMode, setAuthMode] = useState(null);
  const [categories, setCategories] = useState([]);
  const [ruta, setRuta] = useState(window.location.pathname);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [mostrarMisReservas, setMostrarMisReservas] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  const [loadingFavoritos, setLoadingFavoritos] = useState(false);
  const [errorFavoritos, setErrorFavoritos] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [buscandoDisponibilidad, setBuscandoDisponibilidad] = useState(false);
  const [errorDisponibilidad, setErrorDisponibilidad] = useState("");
  const [busquedaPorFechasActiva, setBusquedaPorFechasActiva] = useState(false);
  const [availableProducts, setAvailableProducts] = useState(null);

  function abrirMisReservas() {
    setMostrarFavoritos(false);
    setSelectedProduct(null);
    setMostrarMisReservas(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function abrirAdministracion() {
    window.history.pushState({}, "", "/administracion");
    setRuta("/administracion");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function abrirFavoritos() {
    if (!user) {
      setAuthMode("login");
      return;
    }

    setMostrarMisReservas(false);
    setMostrarFavoritos(true);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function volverDeFavoritos() {
    setMostrarFavoritos(false);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function volverAlCatalogo() {
    setMostrarMisReservas(false);
    setMostrarFavoritos(false);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function buscarPorFechas(event) { 
    event.preventDefault();

    if (!fechaDesde || !fechaHasta) { 
      setErrorDisponibilidad("Seleccioná las fechas de ida y regreso."); 
      return; 
    }

    if (fechaHasta < fechaDesde) { 
      setErrorDisponibilidad("La fecha de regreso no puede ser anterior a la fecha de ida."); 
      return; 
    }

    setBuscandoDisponibilidad(true); 
    setErrorDisponibilidad(""); 
    setPage(1);

    try { 
      const data = await buscarProductosDisponibles(fechaDesde, fechaHasta);

      if (!Array.isArray(data)) {
        throw new Error("La API no devolvió una lista válida de productos.");
      }

      const productosAdaptados = data.map((producto) => {
        const images = Array.isArray(producto.images)
          ? producto.images.filter(Boolean)
          : [];

        const mainImage =
          producto.image ?? producto.imagen ?? images[0] ?? "";

        return {
          id: producto.id,
          name: producto.name ?? producto.nombre ?? "",
          category:
            typeof producto.category === "string"
              ? producto.category
              : producto.category?.nombre ??
                (typeof producto.categoria === "string"
                  ? producto.categoria
                  : producto.categoria?.nombre) ??
                "",
          location: producto.location ?? producto.ubicacion ?? "",
          price: Number(producto.price ?? producto.precio ?? 0),
          image: mainImage,
          images: images.length ? images : mainImage ? [mainImage] : [],
          description: producto.description ?? producto.descripcion ?? "",
        };
      });

      setAvailableProducts(productosAdaptados);
      setBusquedaPorFechasActiva(true);
    } catch (error) { 
      setErrorDisponibilidad(error.message || "No pudimos buscar productos disponibles."); 
    } finally { 
      setBuscandoDisponibilidad(false); 
    } 
  }

  async function restablecerCatalogo() {
    setBusquedaPorFechasActiva(false);
    setErrorDisponibilidad("");
    setFechaDesde("");
    setFechaHasta("");
    setPage(1);
    setSearch("");
    setCategory("Todos");
    setAvailableProducts(null);

    try {
      setLoadingProducts(true);
      const data = await obtenerProductos();

      if (!Array.isArray(data)) {
        throw new Error("La API no devolvió una lista válida de productos.");
      }

      const productosAdaptados = data.map((producto) => {
        const images = Array.isArray(producto.images)
          ? producto.images.filter(Boolean)
          : [];

        const mainImage =
          producto.image ?? producto.imagen ?? images[0] ?? "";

        return {
          id: producto.id,
          name: producto.name ?? producto.nombre ?? "",
          category:
            typeof producto.category === "string"
              ? producto.category
              : producto.category?.nombre ??
                (typeof producto.categoria === "string"
                  ? producto.categoria
                  : producto.categoria?.nombre) ??
                "",
          location: producto.location ?? producto.ubicacion ?? "",
          price: Number(producto.price ?? producto.precio ?? 0),
          image: mainImage,
          images: images.length ? images : mainImage ? [mainImage] : [],
          description: producto.description ?? producto.descripcion ?? "",
        };
      });

      setProducts(productosAdaptados);
    } catch (error) {
      setProductsError(error.message || "No pudimos cargar los productos.");
    } finally {
      setLoadingProducts(false);
    }
  }

  function getUserFromToken(token) {
    try {
      const payload = JSON.parse(
        atob(
          token.split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      );

      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        localStorage.removeItem("reservaYaToken");
        return null;
      }

      return {
        email: payload.sub,
        roles: payload.roles ?? [],
        role: (payload.roles ?? []).includes("ROLE_ADMIN")
          ? "ROLE_ADMIN"
          : (payload.roles ?? [])[0] ?? null,
      };
    } catch {
      localStorage.removeItem("reservaYaToken");
      return null;
    }
  }

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("reservaYaToken");
    if (!token) return null;
    return getUserFromToken(token);
  });

  function handleAuthSuccess(result) {
    if (result.registered) {
      setAuthMode("login");
      return;
    }

    localStorage.setItem("reservaYaToken", result.token);
    const loggedUser = getUserFromToken(result.token);
    
    if (!loggedUser) {
      setUser(null);
      setAuthMode("login");
      return;
    }

    setUser(loggedUser);
    setAuthMode(null);
  }

  function handleLogout() {
    localStorage.removeItem("reservaYaToken");
    setUser(null);
    setFavoritos([]);
    setMostrarFavoritos(false);
    setAuthMode(null);
  }

  function esFavorito(product) {
    return favoritos.some(
      (item) => String(item.id) === String(product.id)
    );
  }

  async function toggleFavorito(product) {
    if (!user) {
      setAuthMode("login");
      return;
    }

    const yaEsFavorito = esFavorito(product);

    setFavoritos((actuales) =>
      yaEsFavorito
        ? actuales.filter((item) => String(item.id) !== String(product.id))
        : [...actuales, product]
    );

    setErrorFavoritos("");

    try {
      if (yaEsFavorito) {
        await quitarFavorito(product.id);
      } else {
        await agregarFavorito(product.id);
      }
    } catch (error) {
      setFavoritos((actuales) =>
        yaEsFavorito
          ? [...actuales, product]
          : actuales.filter((item) => String(item.id) !== String(product.id))
      );
      setErrorFavoritos(error.message);
    }
  }

  useEffect(() => {
    function sincronizarRuta() {
      setRuta(window.location.pathname);
    }

    window.addEventListener("popstate", sincronizarRuta);

    return () => {
      window.removeEventListener("popstate", sincronizarRuta);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function cargarFavoritos() {
      if (!user) {
        setFavoritos([]);
        setErrorFavoritos("");
        setLoadingFavoritos(false);
        return;
      }

      setLoadingFavoritos(true);
      setErrorFavoritos("");

      try {
        const data = await obtenerFavoritos();

        if (!Array.isArray(data)) {
          throw new Error("La API de favoritos no devolvió una lista.");
        }

        if (!cancelled) {
          setFavoritos(data);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorFavoritos(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingFavoritos(false);
        }
      }
    }

    cargarFavoritos();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await obtenerCategorias();

        if (!Array.isArray(data)) {
          throw new Error("La API no devolvió una lista de categorías");
        }

        if (!cancelled) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error cargando categorías:", error);
      } finally {
        if (!cancelled) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductsError("");
        const data = await obtenerProductos();

        if (!Array.isArray(data)) {
          throw new Error("La API no devolvió una lista de productos.");
        }

        const productosAdaptados = data.map((producto) => {
          const images = Array.isArray(producto.images)
            ? producto.images.filter(Boolean)
            : [];

          const mainImage =
            producto.image ?? producto.imagen ?? images[0] ?? "";

          return {
            id: producto.id,
            name: producto.name ?? producto.nombre ?? "",
            category:
              typeof producto.category === "string"
                ? producto.category
                : producto.category?.nombre ??
                  (typeof producto.categoria === "string"
                    ? producto.categoria
                    : producto.categoria?.nombre) ??
                  "",
            location: producto.location ?? producto.ubicacion ?? "",
            price: Number(producto.price ?? producto.precio ?? 0),
            image: mainImage,
            images: images.length ? images : mainImage ? [mainImage] : [],
            description: producto.description ?? producto.descripcion ?? "",
          };
        });

        if (!cancelled) {
          setProducts(productosAdaptados);
        }
      } catch (error) {
        if (!cancelled) {
          setProductsError(
            "No pudimos cargar los productos desde el servidor. Verificá que Spring Boot esté funcionando."
          );
          console.error("Error cargando productos:", error);
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const pageSize = 10;
  const sourceProducts = availableProducts ?? products;
  const filteredProducts = sourceProducts.filter((product) => { 
    const productCat = (product.category || "").trim().toLowerCase(); 
    const selectedCat = category.trim().toLowerCase();
    const matchesCategory = category === "Todos" || productCat === selectedCat;
    const query = search.trim().toLowerCase();

    const matchesSearch = !query || 
      (product.name || "").toLowerCase().includes(query) || 
      (product.location || "").toLowerCase().includes(query) || 
      (product.category || "").toLowerCase().includes(query) || 
      (product.description || "").toLowerCase().includes(query);

    return matchesCategory && matchesSearch; 
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize);

  const visibleProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  function selectCategory(name) {
    setCategory(name);
    setPage(1);
  }

  function updateSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function openProduct(product) {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goHome() {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const shuffled = [...products];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setRecommendations(shuffled.slice(0, 4));
  }, [products]);

  const isAdmin = user?.role === "ROLE_ADMIN";

  if (ruta.startsWith("/administracion")) {
    if (!user) {
      return <p>Iniciá sesión para acceder.</p>;
    }

    if (!isAdmin) {
      return <p>No tenés permisos para acceder al panel.</p>;
    }

    return (
      <AdminPanel
        products={products}
        categories={categories}
        onAddProduct={async (newProduct) => {
          const created = await crearProducto(newProduct);
          const images = Array.isArray(created.images) && created.images.length
            ? created.images
            : Array.isArray(newProduct.images)
            ? newProduct.images.filter(Boolean)
            : [];

          const product = {
            id: created.id,
            name: created.name ?? created.nombre ?? newProduct.name,
            category:
              typeof created.category === "string"
                ? created.category
                : created.category?.nombre ??
                  (typeof created.categoria === "string"
                    ? created.categoria
                    : created.categoria?.nombre) ??
                  newProduct.category,
            location:
              created.location ?? created.ubicacion ?? newProduct.location,
            price: Number(
              created.price ?? created.precio ?? newProduct.price
            ),
            image:
              created.image ?? created.imagen ?? images[0] ?? newProduct.image,
            images,
            description:
              created.description ??
              created.descripcion ??
              newProduct.description,
          };

          setProducts((current) => [...current, product]);
        }}
        onAddCategory={async (nombre) => {
          const created = await crearCategoria(nombre);
          setCategories((current) => [...current, created]);
        }}
        onUpdateCategory={async (id, nombre) => {
          const updated = await actualizarCategoria(id, nombre);
          setCategories((current) =>
            current.map((item) =>
              String(item.id) === String(id) ? updated : item
            )
          );
        }}
        onDeleteCategory={async (id) => {
          await eliminarCategoria(id);
          setCategories((current) =>
            current.filter((item) => String(item.id) !== String(id))
          );
        }}
        onUpdateProduct={async (productId, updatedProduct) => {
          const updated = await actualizarProducto(productId, updatedProduct);
          const images =
            Array.isArray(updated.images) && updated.images.length
              ? updated.images
              : updatedProduct.images;

          const product = {
            id: updated.id,
            name: updated.name ?? updated.nombre ?? updatedProduct.name,
            category: updated.category ?? updated.categoria ?? updatedProduct.category,
            location: updated.location ?? updated.ubicacion ?? updatedProduct.location,
            price: Number(updated.price ?? updated.precio ?? updatedProduct.price),
            image:
              updated.image ?? updated.imagen ?? images[0] ?? updatedProduct.image,
            images,
            description:
              updated.description ??
              updated.descripcion ??
              updatedProduct.description,
          };

          setProducts((current) =>
            current.map((item) =>
              String(item.id) === String(productId) ? product : item
            )
          );
        }}
        onDeleteProduct={async (productId) => {
          await eliminarProducto(productId);
          setProducts((current) =>
            current.filter((product) => product.id !== productId)
          );
        }}
      />
    );
  }

  if (mostrarFavoritos) {
    return (
      <div id="inicio" className="app">
        <Header
          onHome={volverAlCatalogo}
          user={user}
          onLogin={() => setAuthMode("login")}
          onRegister={() => setAuthMode("register")}
          onLogout={handleLogout}
          onMisReservas={abrirMisReservas}
          onFavoritos={abrirFavoritos}
          onAdmin={abrirAdministracion}
        />

        <main className="section catalog-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">TU SELECCIÓN PERSONAL</span>
              <h2>
                <Heart
                  size={25}
                  style={{ verticalAlign: "middle", fill: "currentColor" }}
                />{" "}
                Mis favoritos
              </h2>
              <p>Todo lo que guardaste para disfrutar más adelante.</p>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              onClick={volverAlCatalogo}
            >
              ← Volver al inicio
            </button>
          </div>

          {loadingFavoritos ? (
            <div className="empty-state">
              <p>Cargando tus favoritos...</p>
            </div>
          ) : errorFavoritos ? (
            <div className="empty-state">
              <p>{errorFavoritos}</p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={volverAlCatalogo}
              >
                Volver al inicio
              </button>
            </div>
          ) : favoritos.length > 0 ? (
            <div className="products-grid" style={{ justifyContent: "flex-start" }}>
              {favoritos.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={(item) => {
                    setMostrarFavoritos(false);
                    openProduct(item);
                  }}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorito}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Heart size={32} />
              <h3>Aún no tenés favoritos</h3>
              <p>
                Cuando encuentres algo que te guste, tocá el corazón para
                guardarlo acá.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={volverAlCatalogo}
              >
                Explorar productos
              </button>
            </div>
          )}
        </main>

        <Footer onHome={volverAlCatalogo} />
      </div>
    );
  }

  if (mostrarMisReservas) {
    return (
      <div id="inicio" className="app">
        <Header
          onHome={volverAlCatalogo}
          user={user}
          onLogin={() => setAuthMode("login")}
          onRegister={() => setAuthMode("register")}
          onLogout={handleLogout}
          onMisReservas={abrirMisReservas}
          onFavoritos={abrirFavoritos}
          onAdmin={abrirAdministracion}
        />

        <MisReservas onBack={volverAlCatalogo} />

        <Footer onHome={volverAlCatalogo} />
      </div>
    );
  }

  if (selectedProduct) {
    return (
      <div id="inicio" className="app">
        <Header
          onHome={goHome}
          user={user}
          onLogin={() => setAuthMode("login")}
          onRegister={() => setAuthMode("register")}
          onLogout={handleLogout}
          onMisReservas={abrirMisReservas}
          onFavoritos={abrirFavoritos}
          onAdmin={abrirAdministracion}
        />

        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onSuccess={handleAuthSuccess}
          />
        )}
      
        <ProductDetail
          product={selectedProduct}
          onBack={goHome}
        />

        <Footer onHome={goHome} />
      </div>
    );
  }

  return (
    <div id="inicio" className="app">
      <Header
        onHome={goHome}
        user={user}
        onLogin={() => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
        onLogout={handleLogout}
        onMisReservas={abrirMisReservas}
        onFavoritos={abrirFavoritos}
        onAdmin={abrirAdministracion}
      />

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={handleAuthSuccess}
        />
      )}

      <main>
        {/* HERO SECTION REDISEÑADA Y MODERNA */}
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow eyebrow-glow">
              <Sparkles size={14} style={{ marginRight: 6 }} />
              VIVE LO EXTRAORDINARIO
            </span>

            <h1>
              El destino lo ponés vos.
              <span className="hero-gradient-text"> El momento es hoy.</span>
            </h1>

            <p>
              Experiencias de autor, alojamientos únicos, vehículos y estadías preparadas a tu medida en pocos clics.
            </p>

            <form
              className="search-box search-box-innovative"
              onSubmit={(event) => {
                event.preventDefault();
                document
                  .getElementById("catalogo")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Search size={21} className="search-icon-glow" />

              <input
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="¿Qué experiencia querés vivir hoy?"
                aria-label="Buscar productos"
              />

              <button className="btn btn-primary btn-glow" type="submit">
                Descubrir
              </button>
            </form>

            <div className="hero-trust">
              <span><Zap size={14} style={{ color: "#00b4d8" }} /> Confirmación inmediata</span>
              <span>✓ Experiencias verificadas</span>
              <span>✓ Sin comisiones ocultas</span>
            </div>
          </div>       

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1100&q=85"
              alt="Lago rodeado de montañas"
            />

            <div className="floating-card floating-card-innovative">
              <span className="floating-icon">✦</span>
              <div>
                <strong>El mundo te espera</strong>
                <small>¿Cuál será tu próximo destino?</small>
              </div>
            </div>
          </div>
        </section>

        <section className="section categories-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ENCONTRÁ LO QUE BUSCÁS</span>
              <h2>Explorá por categoría</h2>
              <p>
                Todo lo que necesitás para tu próxima experiencia.
              </p>
            </div>
          </div>

          <div className="categories-grid">
            <button
              className={`category-card ${
                category === "Todos" ? "category-active" : ""
              }`}
              onClick={() => selectCategory("Todos")}
            >
              <span className="category-icon">
                <Search size={25} />
              </span>
              <strong>Todos</strong>
              <span className="category-arrow">
                <ArrowRight size={17} />
              </span>
            </button>

            {categories.map((item) => {
              const name = typeof item === "string" ? item : item.nombre;
              const Icon =
                name === "Hoteles" ? Hotel :
                name === "Vuelos" ? Plane :
                name === "Moda" ? Shirt :
                name === "Autos" ? CarFront :
                Tag;

              if (!name) return null;

              return (
                <button
                  key={item.id}
                  className={`category-card ${
                    category === name ? "category-active" : ""
                  }`}
                  onClick={() => {
                    selectCategory(name);
                    document
                      .getElementById("catalogo")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span className="category-icon">
                    <Icon size={25} />
                  </span>
                  <strong>{name}</strong>
                  <span className="category-arrow">
                    <ArrowRight size={17} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section catalog-section" id="catalogo">
          
          <div className="section-heading catalog-heading">
            <div>
              <span className="eyebrow">INSPIRACIÓN PARA VOS</span>
              <h2>
                {category === "Todos"
                  ? "Descubrí nuevas experiencias"
                  : category}
              </h2>
              <p>
                Encontramos {filteredProducts.length} propuestas para vos.
              </p>
            </div>

            <span className="results-badge">
              {filteredProducts.length} productos
            </span>
          </div>

          <div className="hero-side" style={{ marginBottom: "2rem" }}>
            <div className="availability-panel">
              <div className="availability-heading">
                <span className="availability-icon">✦</span>
                <div>
                  <h3>Encontrá tu próxima experiencia</h3>
                  <p>Elegí las fechas y descubrí qué está disponible.</p>
                </div>
              </div>

              <form
                className="availability-form"
                onSubmit={buscarPorFechas}
              >
                <label className="availability-field">
                  <span>Fecha desde</span>
                  <input
                    type="date"
                    value={fechaDesde}
                    min={new Date().toLocaleDateString("en-CA")}
                    onChange={(event) => setFechaDesde(event.target.value)}
                    required
                  />
                </label>

                <label className="availability-field">
                  <span>Fecha hasta</span>
                  <input
                    type="date"
                    value={fechaHasta}
                    min={fechaDesde || new Date().toLocaleDateString("en-CA")}
                    onChange={(event) => setFechaHasta(event.target.value)}
                    required
                  />
                </label>

                <button
                  className="btn btn-primary availability-submit"
                  type="submit"
                  disabled={buscandoDisponibilidad}
                >
                  {buscandoDisponibilidad
                    ? "Buscando..."
                    : "Buscar disponibilidad"}
                  {!buscandoDisponibilidad && <ArrowRight size={17} />}
                </button>
              </form>

              {errorDisponibilidad && (
                <p role="alert" className="reserva-error">
                  {errorDisponibilidad}
                </p>
              )}
            </div>
          </div>

          {(busquedaPorFechasActiva || category !== "Todos" || search.trim() !== "") && (
            <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={restablecerCatalogo}
                disabled={buscandoDisponibilidad}
              >
                ✕ Limpiar filtros
              </button>
            </div>
          )}

          {loadingProducts ? (
            <div className="empty-state">
              <p>Cargando experiencias...</p>
            </div>
          ) : productsError ? (
            <div className="empty-state">
              <h3>No pudimos cargar los productos</h3>
              <p>{productsError}</p>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Reintentar
              </button>
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="products-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={openProduct}
                  isFavorite={esFavorito(product)}
                  onToggleFavorite={toggleFavorito}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Search size={32} />
              <h3>No encontramos resultados</h3>
              <p>
                Probá otra búsqueda o seleccioná una categoría diferente.
              </p>
              <button
                className="btn btn-primary"
                onClick={restablecerCatalogo}
              >
                Ver todos los productos
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                Inicio
              </button>

              <button
                className="page-arrow"
                disabled={page === 1}
                onClick={() => setPage((current) => current - 1)}
                aria-label="Página anterior"
              >
                ←
              </button>

              <span>
                Página <strong>{page}</strong> de {totalPages}
              </span>

              <button
                className="page-arrow"
                disabled={page === totalPages}
                onClick={() => setPage((current) => current + 1)}
                aria-label="Página siguiente"
              >
                →
              </button>
            </div>
          )}
        </section>

        <section className="recommendations section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SELECCIÓN ESPECIAL</span>
              <h2>Recomendados para vos</h2>
              <p>
                Dejá que te sorprendamos con nuevas ideas.
              </p>
            </div>
          </div>

          <div className="products-grid">
            {recommendations.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={openProduct}
                isFavorite={esFavorito(product)}
                onToggleFavorite={toggleFavorito}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer onHome={goHome} />
    </div>
  );
}

export default App;