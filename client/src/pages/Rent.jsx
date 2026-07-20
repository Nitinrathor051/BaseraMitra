import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import {
  MapPin,
  Building2,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";

import api from "../services/api";
import PropertyCard from "../components/PropertyCard";
import { useAuth } from "../context/AuthContext";

import "../styles/Rent.css";

const Rent = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [searchParams] = useSearchParams();

  // ==========================
  // QUERY PARAMS
  // ==========================

  const city = searchParams.get("city") || "";

  const propertyType =
    searchParams.get("propertyType") || "";

  const sort =
    searchParams.get("sort") || "newest";

  // ==========================
  // STATES
  // ==========================

  const [properties, setProperties] =
    useState([]);

  const [favoriteIds, setFavoriteIds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [filters, setFilters] = useState({
    city,
    propertyType,
    sort,
  });

  // ==========================
  // FETCH RENT PROPERTIES
  // ==========================

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/properties",
        {
          params: {
            listingType: "rent",

            ...(filters.city && {
              city: filters.city,
            }),

            ...(filters.propertyType && {
              propertyType:
                filters.propertyType,
            }),
          },
        }
      );

      let list = [
        ...(data.properties || []),
      ];

      if (filters.sort === "newest") {
        list.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
      }

      if (filters.sort === "priceLow") {
        list.sort(
          (a, b) => a.price - b.price
        );
      }

      if (filters.sort === "priceHigh") {
        list.sort(
          (a, b) => b.price - a.price
        );
      }

      setProperties(list);
    } catch (error) {
      console.log(
        "Rent fetch error:",
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // FETCH FAVORITES
  // ==========================

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      setFavoriteIds([]);
      return;
    }

    try {
      const { data } = await api.get(
        "/favorites"
      );

      const ids =
        data.favorites?.map(
          (item) => item.property._id
        ) || [];

      setFavoriteIds(ids);
    } catch (error) {
      console.log(
        "Favorite fetch error:",
        error.message
      );
    }
  };

  // ==========================
  // FILTER HANDLERS
  // ==========================

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (filters.city.trim()) {
      params.set(
        "city",
        filters.city.trim()
      );
    }

    if (filters.propertyType) {
      params.set(
        "propertyType",
        filters.propertyType
      );
    }

    if (
      filters.sort &&
      filters.sort !== "newest"
    ) {
      params.set("sort", filters.sort);
    }

    navigate(`/rent?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      propertyType: "",
      sort: "newest",
    });

    navigate("/rent");
  };

  // ==========================
  // EFFECTS
  // ==========================

  useEffect(() => {
    fetchProperties();
  }, [city, propertyType, sort]);

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated]);

  return (
    <main className="rent-page">

      {/* =====================
          HEADER
      ===================== */}

      <section className="rent-header">
        <div className="container">

          <div className="rent-header-content">

            <h1>
              Rent Properties
            </h1>

            <p>
              Find verified rental
              properties near you.
            </p>

          </div>

        </div>
      </section>

      {/* =====================
          FILTERS
      ===================== */}

      <section className="rent-filter-section">
        <div className="container">

          <div className="rent-filter-box">

            <div className="rent-filter-input">
              <MapPin size={18} />

              <input
                type="text"
                name="city"
                placeholder="Location"
                value={filters.city}
                onChange={handleChange}
              />
            </div>

            <div className="rent-filter-select">
              <Building2 size={18} />

              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleChange}
              >
                <option value="">
                  All Property Types
                </option>

                <option value="house">
                  House
                </option>

                <option value="apartment">
                  Apartment
                </option>

                <option value="villa">
                  Villa
                </option>

                <option value="room">
                  Room
                </option>

                <option value="pg">
                  PG
                </option>

                <option value="shop">
                  Shop
                </option>

                <option value="office">
                  Office
                </option>

                <option value="plot">
                  Plot
                </option>
              </select>
            </div>

            <div className="rent-filter-select">
              <ArrowUpDown size={18} />

              <select
                name="sort"
                value={filters.sort}
                onChange={handleChange}
              >
                <option value="newest">
                  Newest
                </option>

                <option value="priceLow">
                  Price: Low to High
                </option>

                <option value="priceHigh">
                  Price: High to Low
                </option>
              </select>
            </div>

            <button
              className="rent-filter-btn"
              type="button"
              onClick={applyFilters}
            >
              Apply
            </button>

            <button
              className="rent-filter-btn"
              type="button"
              onClick={clearFilters}
            >
              <RotateCcw size={18} />
              Clear
            </button>

          </div>
        </div>
      </section>
            {/* =====================
          PROPERTY LIST
      ===================== */}

      <section className="rent-property-section">
        <div className="container">

          <div className="rent-listing-title">

            <h2>
              Properties For Rent
            </h2>

            <span>
              {properties.length} Properties Found
            </span>

          </div>

          <div className="rent-property-grid">

            {loading ? (

              <p className="rent-loading">
                Loading properties...
              </p>

            ) : properties.length === 0 ? (

              <div className="rent-empty-state">

                <h3>
                  No Properties Found
                </h3>

                <p>
                  Try changing the location
                  or filters.
                </p>

              </div>

            ) : (

              properties.map((property) => (

                <PropertyCard
                  key={property._id}
                  property={property}
                  favoriteIds={favoriteIds}
                  setFavoriteIds={setFavoriteIds}
                />

              ))

            )}

          </div>

        </div>
      </section>
          </main>
  );
};

export default Rent;