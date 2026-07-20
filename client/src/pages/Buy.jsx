import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  MapPin,
  Building2,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";

import api from "../services/api";
import PropertyCard from "../components/PropertyCard";
import { useAuth } from "../context/AuthContext";

import "../styles/Buy.css";

const Buy = () => {
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

  const [properties, setProperties] = useState([]);

  const [loading, setLoading] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState([]);

  const [filters, setFilters] = useState({
    city,
    propertyType,
    sort,
  });

  // ==========================
  // FETCH BUY PROPERTIES
  // ==========================

  const fetchProperties = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/properties",
        {
          params: {
            listingType: "buy",

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

      let list = [...(data.properties || [])];

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
        "Buy fetch error:",
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
      params.set("city", filters.city.trim());
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

    navigate(`/buy?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      propertyType: "",
      sort: "newest",
    });

    navigate("/buy");
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
    <main className="buy-page">

      {/* =====================
          HEADER
      ===================== */}

      <section className="buy-header">
        <div className="buy-container">

          <h1>
            Buy Properties
          </h1>

          <p>
            Explore verified properties
            available for purchase.
          </p>

        </div>
      </section>

      {/* =====================
          FILTERS
      ===================== */}

      <section className="buy-filter-section">

        <div className="buy-container">

          <div className="buy-filter-box">

            <div className="buy-filter-input">

              <MapPin size={18} />

              <input
                type="text"
                name="city"
                placeholder="Location"
                value={filters.city}
                onChange={handleChange}
              />

            </div>

            <div className="buy-filter-select">

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

            <div className="buy-filter-select">

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
              className="buy-filter-btn"
              onClick={applyFilters}
              type="button"
            >
              Apply
            </button>

            <button
              className="buy-filter-btn"
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

      <section className="buy-property-section">

        <div className="buy-container">

          <div className="buy-listing-title">

            <h2>
              Properties For Sale
            </h2>

            <span>
              {properties.length} Properties Found
            </span>

          </div>

          <div className="buy-property-grid">

            {loading ? (

              <p className="buy-loading">
                Loading properties...
              </p>

            ) : properties.length === 0 ? (

              <div className="buy-empty-state">

                <h3>
                  No Properties Found
                </h3>

                <p>
                  Try changing the location or
                  filters.
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

export default Buy;