import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import {
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  Compass,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Sliders,
  Check,
} from "lucide-react";

// URL Base de tu API
const API_BASE_URL = "http://localhost:5219/";

const CITY_OPTIONS = [
  { label: "León", value: "León, Guanajuato", displayTitle: "León, Gto." },
  {
    label: "CDMX",
    value: "Ciudad de México",
    displayTitle: "Ciudad de México",
  },
  {
    label: "Guanajuato",
    value: "Guanajuato, Guanajuato",
    displayTitle: "Guanajuato Capital",
  },
];

const Explorar = () => {
  // === 1. ESTADOS DE DATOS ===
  const [promociones, setPromociones] = useState([]);
  const [pois, setPois] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // === 2. ESTADOS DE FILTRO ===
  const [filters, setFilters] = useState({
    city: "León, Guanajuato",
    categories: [],
  });

  // Listas filtradas que se usarán en la UI
  const [filteredLugares, setFilteredLugares] = useState([]);
  // NOTA: filteredPois se calcula dinámicamente o en useEffect, aquí lo haremos dinámico en el render para simplificar,
  // pero para los índices es mejor tenerlo controlado.

  // === 3. ESTADOS DE UI ===
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [currentPoiIndex, setCurrentPoiIndex] = useState(0); // Índice para el slider de POIs
  const [currentIndex, setCurrentIndex] = useState(0); // ScrollSpy

  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const sections = [section1Ref, section2Ref, section3Ref, section4Ref];

  const extractData = (data) => {
    if (data && data.$values) return data.$values;
    if (Array.isArray(data)) return data;
    return [];
  };

  const getCurrentCityDisplay = () => {
    const cityObj = CITY_OPTIONS.find((c) => c.value === filters.city);
    return cityObj ? cityObj.displayTitle : filters.city;
  };

  // === 4. CARGAR DATOS ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [promosRes, poisRes, lugaresRes, catRes] =
          await Promise.allSettled([
            fetch(`${API_BASE_URL}api/Promociones`),
            fetch(`${API_BASE_URL}api/PuntosInteres`),
            fetch(`${API_BASE_URL}api/Lugares`),
            fetch(`${API_BASE_URL}api/Categorias`),
          ]);

        if (promosRes.status === "fulfilled")
          setPromociones(extractData(await promosRes.value.json()));
        if (poisRes.status === "fulfilled")
          setPois(extractData(await poisRes.value.json()));
        if (lugaresRes.status === "fulfilled")
          setLugares(extractData(await lugaresRes.value.json()));
        if (catRes.status === "fulfilled")
          setCategorias(extractData(await catRes.value.json()));
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // === 5. LÓGICA DE FILTRADO (LUGARES Y RESET DE INDICES) ===
  useEffect(() => {
    // A. Filtrar Lugares (Directorio)
    let results = lugares;
    if (filters.city) {
      results = results.filter(
        (l) =>
          l.direccion &&
          l.direccion.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    if (filters.categories.length > 0) {
      results = results.filter((l) =>
        filters.categories.includes(l.idCategoria)
      );
    }
    setFilteredLugares(results);

    // B. Resetear Sliders cuando cambia el filtro
    setCurrentSlide(0); // Directorio
    setCurrentPoiIndex(0); // POIs
    setCurrentPromoSlide(0); // Promociones
  }, [filters, lugares]);

  const toggleCategory = (catId) => {
    setFilters((prev) => {
      const exists = prev.categories.includes(catId);
      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((id) => id !== catId)
          : [...prev.categories, catId],
      };
    });
  };

  // === 6. LÓGICA DE SCROLL ===
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let newIndex = 0;
      sections.forEach((section, index) => {
        if (section.current && section.current.offsetTop <= scrollPosition) {
          newIndex = index;
        }
      });
      setCurrentIndex(newIndex);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpToSection = (index) => {
    if (sections[index].current) {
      sections[index].current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setCurrentIndex(index);
    }
  };

  const scrollToSection = (direction) => {
    let nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= sections.length) nextIndex = sections.length - 1;
    jumpToSection(nextIndex);
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x600?text=No+Image";
    return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  };

  const chunkArray = (array, size) => {
    const chunked = [];
    if (!array) return [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  // --- LÓGICA DE SLIDERS FILTRADOS ---

  // 1. POIS FILTRADOS (NUEVO)
  const filteredPois = pois.filter((poi) => {
    if (poi.idLugarNavigation && poi.idLugarNavigation.direccion) {
      return poi.idLugarNavigation.direccion
        .toLowerCase()
        .includes(filters.city.toLowerCase());
    }
    return false;
  });

  const nextPoi = () => {
    if (!filteredPois || filteredPois.length === 0) return;
    setCurrentPoiIndex((prev) =>
      prev === filteredPois.length - 1 ? 0 : prev + 1
    );
  };
  const prevPoi = () => {
    if (!filteredPois || filteredPois.length === 0) return;
    setCurrentPoiIndex((prev) =>
      prev === 0 ? filteredPois.length - 1 : prev - 1
    );
  };

  // Obtenemos el POI actual de la lista FILTRADA
  const currentPoiData =
    filteredPois.length > 0 ? filteredPois[currentPoiIndex] : null;

  // 2. PROMOCIONES FILTRADAS
  const today = new Date();
  const validPromociones = promociones.filter((p) => {
    const endDate = new Date(p.fechaFin);
    const isActive = p.estatus === true && endDate >= today;
    let matchesCity = true;
    if (p.idLugarNavigation && p.idLugarNavigation.direccion) {
      matchesCity = p.idLugarNavigation.direccion
        .toLowerCase()
        .includes(filters.city.toLowerCase());
    }
    return isActive && matchesCity;
  });
  const promocionesSlides = chunkArray(validPromociones, 3);

  const nextPromoSlide = () =>
    setCurrentPromoSlide((prev) =>
      prev === promocionesSlides.length - 1 ? 0 : prev + 1
    );
  const prevPromoSlide = () =>
    setCurrentPromoSlide((prev) =>
      prev === 0 ? promocionesSlides.length - 1 : prev - 1
    );

  // 3. DIRECTORIO (Ya filtrado en useEffect)
  const lugaresSlides = chunkArray(filteredLugares, 2);
  const nextSlide = () =>
    setCurrentSlide((prev) =>
      prev === lugaresSlides.length - 1 ? 0 : prev + 1
    );
  const prevSlide = () =>
    setCurrentSlide((prev) =>
      prev === 0 ? lugaresSlides.length - 1 : prev - 1
    );

  return (
    <>
      {/* SECCIÓN 1: HERO */}
      <section
        ref={section1Ref}
        className="hero-section full-screen-section text-white position-relative overflow-hidden"
        style={{ background: "#000" }}
      >
        <div
          className="hero-bg-image"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.7,
            zIndex: 0,
          }}
        ></div>
        <div
          className="hero-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.8) 100%)",
            zIndex: 1,
          }}
        ></div>

        <Container className="position-relative" style={{ zIndex: 10 }}>
          <Row className="align-items-center justify-content-center">
            <Col lg={8} className="text-center">
              <div className="hero-badge mb-4 mx-auto">
                <span className="badge rounded-pill px-4 py-2 custom-glass-badge">
                  {filters.categories.length > 0 ? (
                    <>
                      <CheckCircle size={16} /> FILTROS ACTIVOS
                    </>
                  ) : (
                    <>
                      <Compass size={16} /> KAIROS EXPLORER
                    </>
                  )}
                </span>
              </div>
              <h1 className="display-3 fw-bold mb-4 hero-title text-white">
                Descubre <br />{" "}
                <span className="text-gradient-green d-block">
                  {getCurrentCityDisplay()}
                </span>
              </h1>
              <p
                className="lead mb-5 mx-auto text-white-50"
                style={{ maxWidth: "600px" }}
              >
                {filters.categories.length > 0
                  ? `Mostrando ${filteredLugares.length} lugares basados en tus intereses.`
                  : `Una colección curada de experiencias en ${getCurrentCityDisplay()}.`}
              </p>
              <div className="d-flex gap-3 mb-4 flex-wrap justify-content-center">
                <Button
                  onClick={() => jumpToSection(1)}
                  size="lg"
                  className="btn-kairos-primary rounded-pill px-5"
                >
                  Explorar Ahora
                </Button>
                <Button
                  onClick={() => setShowModal(true)}
                  size="lg"
                  variant="outline-light"
                  className="rounded-pill px-4 d-flex align-items-center gap-2 glass-button"
                >
                  <Sliders size={20} /> Personalizar
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* SECCIÓN 2: PROMOCIONES */}
      <section
        ref={section2Ref}
        className="full-screen-section position-relative"
        style={{
          minHeight: "100vh",
          height: "auto",
          padding: "100px 0",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="bg-decor-circle"></div>
        <Container className="position-relative z-1">
          <div className="text-center mb-5">
            <span className="section-label">Ahorra y Disfruta</span>
            <h2 className="display-5 fw-bold text-dark mt-3">
              Promociones en {getCurrentCityDisplay()}
            </h2>
          </div>
          {promocionesSlides.length > 0 ? (
            <div className="slider-container">
              <button
                className="nav-arrow left"
                onClick={prevPromoSlide}
                disabled={promocionesSlides.length <= 1}
              >
                <ChevronLeft size={24} />
              </button>
              <div className="slider-track-wrapper">
                <div
                  className="slider-track"
                  style={{
                    transform: `translateX(-${currentPromoSlide * 100}%)`,
                  }}
                >
                  {promocionesSlides.map((group, idx) => (
                    <div key={idx} className="slider-slide">
                      <Row className="g-4 w-100 m-0">
                        {group.map((promo) => (
                          <Col key={promo.idPromocion} md={6} lg={4}>
                            <div className="compact-card h-100 flex-column align-items-stretch p-0 overflow-hidden shadow-sm hover-lift bg-white">
                              <div
                                className="position-relative"
                                style={{ height: "320px", overflow: "hidden" }}
                              >
                                <img
                                  src={getImageUrl(
                                    promo.imagen ||
                                      promo.idLugarNavigation?.imagen
                                  )}
                                  alt={promo.titulo}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://via.placeholder.com/800x600?text=Sin+Imagen";
                                  }}
                                />
                                <div className="position-absolute top-0 end-0 m-3 badge bg-white text-success shadow-sm fw-bold">
                                  Promo
                                </div>
                              </div>
                              <div className="p-4 d-flex flex-column flex-grow-1">
                                <div className="d-flex justify-content-between text-muted small fw-bold mb-2">
                                  <span className="text-truncate">
                                    {promo.idLugarNavigation?.nombre}
                                  </span>
                                  <span className="text-danger flex-shrink-0 ms-2">
                                    Vence: {formatDate(promo.fechaFin)}
                                  </span>
                                </div>
                                <h5 className="fw-bold mb-2">{promo.titulo}</h5>
                                <p className="text-secondary small mb-4 flex-grow-1">
                                  {promo.descripcion?.length > 80
                                    ? promo.descripcion.substring(0, 80) + "..."
                                    : promo.descripcion}
                                </p>
                                <Button className="w-100 rounded-pill btn-outline-custom">
                                  Reclamar
                                </Button>
                              </div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="nav-arrow right"
                onClick={nextPromoSlide}
                disabled={promocionesSlides.length <= 1}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          ) : (
            <Col className="text-center text-muted py-5">
              {loading
                ? "Cargando promociones..."
                : "No hay promociones vigentes en esta zona."}
            </Col>
          )}
        </Container>
      </section>

      {/* ==========================================
          SECCIÓN 3: PUNTOS DE INTERÉS (AHORA FILTRADO)
          ========================================== */}
      <section
        ref={section3Ref}
        className="full-screen-section position-relative overflow-hidden text-white"
        style={{ background: "#111" }}
      >
        {currentPoiData ? (
          <>
            <div
              key={currentPoiData.idPunto || "poi-bg"}
              className="poi-bg-image fade-in-img"
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('${getImageUrl(currentPoiData.idLugarNavigation?.imagen)}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.6,
                transition: "background-image 0.5s ease-in-out",
                zIndex: 0,
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, #000 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.6) 100%)",
                zIndex: 1,
              }}
            ></div>

            <Container
              className="position-relative h-100 d-flex align-items-center justify-content-center"
              style={{ zIndex: 10, paddingBottom: "120px" }}
            >
              <div className="text-center poi-content-wrapper">
                <div className="mb-3 animate-up delay-1">
                  <span className="poi-tag-badge">
                    {currentPoiData.etiqueta || "Tendencia"}
                  </span>
                </div>
                <h2 className="display-2 fw-bold mb-2 animate-up delay-2">
                  {currentPoiData.idLugarNavigation?.nombre ||
                    "Lugar Increíble"}
                </h2>
                <div className="d-flex align-items-center justify-content-center gap-2 mb-4 text-white-50 animate-up delay-3">
                  <MapPin size={20} className="text-warning" />
                  <span className="fs-5">
                    {currentPoiData.idLugarNavigation?.direccion ||
                      getCurrentCityDisplay()}
                  </span>
                </div>
                <p
                  className="lead mx-auto mb-5 text-light opacity-75 animate-up delay-4"
                  style={{ maxWidth: "700px" }}
                >
                  {currentPoiData.idLugarNavigation?.descripcion
                    ? currentPoiData.idLugarNavigation.descripcion.substring(
                        0,
                        150
                      ) + "..."
                    : "Descubre este maravilloso lugar en tu próxima visita."}
                </p>
              </div>

              {/* Botones de navegación POI */}
              {filteredPois.length > 1 && (
                <>
                  <button
                    className="poi-nav-arrow left"
                    onClick={prevPoi}
                    aria-label="Anterior lugar"
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    className="poi-nav-arrow right"
                    onClick={nextPoi}
                    aria-label="Siguiente lugar"
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}

              {/* Dots de navegación (Mapeamos filteredPois) */}
              {filteredPois.length > 1 && (
                <div className="poi-dots-container">
                  {filteredPois.map((_, idx) => (
                    <div
                      key={idx}
                      className={`poi-dot ${currentPoiIndex === idx ? "active" : ""}`}
                      onClick={() => setCurrentPoiIndex(idx)}
                    ></div>
                  ))}
                </div>
              )}
            </Container>
          </>
        ) : (
          <Container className="text-center position-relative z-3">
            <h3 className="text-white">
              {loading
                ? "Cargando experiencias..."
                : `No hay puntos de interés destacados en ${getCurrentCityDisplay()}.`}
            </h3>
          </Container>
        )}
      </section>

      {/* SECCIÓN 4: DIRECTORIO */}
      <section
        ref={section4Ref}
        className="full-screen-section position-relative"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div
          className="cta-background"
          style={{ opacity: 0.05, background: "#000" }}
        ></div>
        <Container className="position-relative z-2">
          <div className="text-center mb-5">
            <br />
            <br />
            <br />
            <br />
            <h2 className="display-5 fw-bold text-dark">Directorio Local</h2>
            <p className="text-secondary lead">
              {filteredLugares.length} lugares en {getCurrentCityDisplay()}
            </p>
          </div>
          {lugaresSlides.length > 0 ? (
            <div className="slider-container">
              <button
                className="nav-arrow left"
                onClick={prevSlide}
                disabled={lugaresSlides.length <= 1}
              >
                <ChevronLeft size={24} />
              </button>
              <div className="slider-track-wrapper">
                <div
                  className="slider-track"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {lugaresSlides.map((group, gIdx) => (
                    <div key={gIdx} className="slider-slide">
                      {group.map((lugar) => (
                        <div
                          key={lugar.idLugar}
                          className="place-row-card shadow-sm bg-white"
                        >
                          <div className="place-img">
                            <img
                              src={getImageUrl(lugar.imagen)}
                              alt={lugar.nombre}
                            />
                            <span className="place-cat">
                              {lugar.idCategoriaNavigation?.nombre}
                            </span>
                          </div>
                          <div className="place-info">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h3 className="fw-bold mb-0 text-dark">
                                {lugar.nombre}
                              </h3>
                              <div className="d-flex align-items-center bg-light px-2 py-1 rounded-pill">
                                <Star
                                  size={16}
                                  className="text-warning"
                                  fill="currentColor"
                                />
                                <span className="ms-1 fw-bold text-dark small">
                                  4.8
                                </span>
                              </div>
                            </div>
                            <p className="text-muted mb-3 d-flex align-items-center">
                              <MapPin size={16} className="me-2 text-danger" />{" "}
                              {lugar.direccion}
                            </p>
                            <p className="text-secondary text-truncate-3 flex-grow-1 mb-4">
                              {lugar.descripcion}
                            </p>
                            <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                              {lugar.estatus ? (
                                <span className="text-success fw-bold small d-flex align-items-center">
                                  <CheckCircle size={16} className="me-2" />{" "}
                                  Abierto
                                </span>
                              ) : (
                                <span className="text-danger fw-bold small d-flex align-items-center">
                                  <XCircle size={16} className="me-2" /> Cerrado
                                </span>
                              )}
                              <button className="btn-icon-circle">
                                <ChevronRight size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="nav-arrow right"
                onClick={nextSlide}
                disabled={lugaresSlides.length <= 1}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          ) : (
            <div className="text-center py-5">
              {loading
                ? "Cargando directorio..."
                : `No encontramos lugares en ${getCurrentCityDisplay()} con esos filtros.`}
              <Button
                variant="link"
                onClick={() =>
                  setFilters({ city: filters.city, categories: [] })
                }
              >
                Ver todos en esta ciudad
              </Button>
            </div>
          )}
        </Container>
      </section>

      {/* NAVEGACIÓN LATERAL */}
      <div className="nav-dock-minimal">
        <button
          className="nav-btn-mini"
          onClick={() => scrollToSection("up")}
          disabled={currentIndex === 0}
        >
          <ChevronUp size={16} />
        </button>
        <div className="nav-indicators-mini">
          {sections.map((_, idx) => (
            <div
              key={idx}
              className={`nav-dot-mini ${currentIndex === idx ? "active" : ""}`}
              onClick={() => jumpToSection(idx)}
            ></div>
          ))}
        </div>
        <button
          className="nav-btn-mini"
          onClick={() => scrollToSection("down")}
          disabled={currentIndex === sections.length - 1}
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {/* MODAL */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        contentClassName="border-0 shadow-lg rounded-4"
        size="lg"
      >
        <Modal.Header closeButton className="border-0 pb-0 ps-4 pt-4">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <Sliders size={24} className="text-success" /> Personaliza tu Kairos
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">¿Dónde te encuentras?</Form.Label>
              <div className="d-flex gap-3">
                {CITY_OPTIONS.map((cityOption) => (
                  <div
                    key={cityOption.value}
                    onClick={() =>
                      setFilters({ ...filters, city: cityOption.value })
                    }
                    className={`p-3 rounded-3 border cursor-pointer text-center flex-grow-1 transition-all ${filters.city === cityOption.value ? "border-success bg-success bg-opacity-10 text-success fw-bold" : "border-light bg-light text-muted"}`}
                    style={{ cursor: "pointer", transition: "0.2s" }}
                  >
                    <MapPin size={18} className="mb-1 d-block mx-auto" />{" "}
                    {cityOption.label}
                  </div>
                ))}
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label className="fw-bold">¿Qué te interesa hoy?</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {categorias.map((cat) => {
                  const isSelected = filters.categories.includes(
                    cat.idCategoria
                  );
                  return (
                    <div
                      key={cat.idCategoria}
                      onClick={() => toggleCategory(cat.idCategoria)}
                      className={`px-3 py-2 rounded-pill border cursor-pointer user-select-none d-flex align-items-center gap-2 ${isSelected ? "bg-dark text-white border-dark" : "bg-white text-secondary border-secondary-subtle"}`}
                      style={{ cursor: "pointer", transition: "0.2s" }}
                    >
                      {cat.nombre} {isSelected && <Check size={14} />}
                    </div>
                  );
                })}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button
            variant="light"
            onClick={() =>
              setFilters({ city: "León, Guanajuato", categories: [] })
            }
            className="me-auto text-muted"
          >
            Restablecer
          </Button>
          <Button
            className="btn-kairos-primary rounded-pill px-4"
            onClick={() => setShowModal(false)}
          >
            Aplicar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        :root { --color-primary: #1e4d2b; --color-secondary: #2d7a3e; --color-accent: #3d9651; }
        .full-screen-section { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 0; position: relative; }
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
        .glass-button { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); transition: 0.3s; }
        .glass-button:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px); }
        .nav-dock-minimal { position: fixed; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px; z-index: 1000; padding: 5px; }
        .nav-btn-mini { background: rgba(0,0,0,0.5); border: none; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; }
        .nav-btn-mini:hover:not(:disabled) { background: var(--color-primary); }
        .nav-btn-mini:disabled { opacity: 0; pointer-events: none; }
        .nav-indicators-mini { display: flex; flex-direction: column; gap: 8px; margin: 5px 0; }
        .nav-dot-mini { width: 8px; height: 8px; background-color: rgba(0,0,0,0.3); border-radius: 50%; cursor: pointer; transition: 0.3s; border: 1px solid rgba(255,255,255,0.5); }
        .nav-dot-mini.active { background-color: var(--color-primary); transform: scale(1.4); border-color: var(--color-primary); }
        .poi-content-wrapper { position: relative; z-index: 20; }
        .poi-tag-badge { background: rgba(255,255,255,0.2); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 8px 20px; border-radius: 50px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; }
        .poi-nav-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: transparent; border: 2px solid rgba(255,255,255,0.3); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; z-index: 30; }
        .poi-nav-arrow:hover { background: white; color: black; border-color: white; }
        .poi-nav-arrow.left { left: 40px; }
        .poi-nav-arrow.right { right: 40px; }
        .poi-dots-container { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px; z-index: 30; }
        .poi-dot { width: 12px; height: 12px; background: rgba(255,255,255,0.3); border-radius: 50%; cursor: pointer; transition: 0.3s; }
        .poi-dot.active { background: white; transform: scale(1.2); }
        .fade-in-img { animation: fadeIn 0.8s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 0.6; } }
        .animate-up { animation: fadeInUp 0.8s ease forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; } .delay-3 { animation-delay: 0.3s; } .delay-4 { animation-delay: 0.4s; }
        .custom-glass-badge { background: rgba(255, 255, 255, 0.15); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.3); font-size: 0.9rem; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; backdrop-filter: blur(10px); }
        .text-gradient-green { background: linear-gradient(90deg, #fff, #90ee90); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn-kairos-primary { background-color: var(--color-primary); color: white; font-weight: 600; border: none; transition: 0.3s; }
        .btn-kairos-primary:hover { background-color: var(--color-accent); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(30, 77, 43, 0.3); }
        .bg-decor-circle { position: absolute; width: 800px; height: 800px; background: radial-gradient(circle, rgba(144, 238, 144, 0.08) 0%, transparent 70%); top: 50%; transform: translate(-50%, -50%); pointer-events: none; }
        .slider-container { display: flex; align-items: center; gap: 20px; position: relative; padding: 20px 0;}
        .slider-track-wrapper { overflow: hidden; flex-grow: 1; border-radius: 24px; }
        .slider-track { display: flex; transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); width: 100%; }
        .slider-slide { min-width: 100%; display: flex; flex-direction: column; gap: 25px; padding: 5px; }
        .place-row-card { background: white; border: 1px solid #f0f0f0; border-radius: 24px; display: flex; overflow: hidden; min-height: 240px; transition: 0.3s; }
        .place-row-card:hover { box-shadow: 0 15px 40px rgba(0,0,0,0.1); transform: translateY(-3px); }
        .place-img { width: 40%; position: relative; }
        .place-img img { width: 100%; height: 100%; object-fit: cover; }
        .place-cat { position: absolute; top: 15px; left: 15px; background: rgba(255,255,255,0.95); padding: 5px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; color: var(--color-primary); }
        .place-info { width: 60%; padding: 2rem; display: flex; flex-direction: column; }
        .nav-arrow { width: 50px; height: 50px; border-radius: 50%; background: white; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 5px 20px rgba(0,0,0,0.08); transition: 0.3s; flex-shrink: 0; z-index: 5; }
        .nav-arrow:hover:not(:disabled) { background: var(--color-primary); color: white; transform: scale(1.1); }
        .nav-arrow:disabled { opacity: 0.5; cursor: not-allowed; }
        .text-truncate-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .btn-icon-circle { width: 38px; height: 38px; border-radius: 50%; border: 1px solid #eee; background: #f8f9fa; display: flex; align-items: center; justify-content: center; transition: 0.3s; color: var(--color-primary); }
        .btn-icon-circle:hover { background: var(--color-primary); color: white; }
        @media (max-width: 991px) { .nav-dock-minimal { display: none; } .poi-nav-arrow { width: 40px; height: 40px; } .poi-nav-arrow.left { left: 10px; } .poi-nav-arrow.right { right: 10px; } .place-row-card { flex-direction: column; } .place-img { width: 100%; height: 200px; } .place-info { width: 100%; } }
      `}</style>
    </>
  );
};

export default Explorar;
