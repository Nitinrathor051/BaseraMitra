import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  MapPin,
  Building2,
  ArrowRight,
  House,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";

import "../styles/Home.css";

const PROPERTY_TYPES = [
  "house",
  "apartment",
  "room",
  "villa",
  "shop",
  "office",
  "pg",
  "plot",
];

const Home = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  // ===========================================
  // STATE
  // ===========================================

  const [buyProperties, setBuyProperties] = useState([]);

  const [rentProperties, setRentProperties] = useState([]);

  const [favoriteIds, setFavoriteIds] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [search, setSearch] = useState("");

  const [suggestions, setSuggestions] =
    useState([]);

  const [propertyType, setPropertyType] =
    useState("");

  const [listingType, setListingType] =
    useState("");

  // ===========================================
  // FETCH HOME DATA
  // ===========================================

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const [buyRes, rentRes] = await Promise.all([
        api.get(
          "/properties?listingType=buy"
        ),
        api.get(
          "/properties?listingType=rent"
        ),
      ]);

      setBuyProperties(
        buyRes.data.properties || []
      );

      setRentProperties(
        rentRes.data.properties || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // FETCH FAVORITES
  // ===========================================

  const fetchFavorites = async () => {
    if (!isAuthenticated) return;

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
      console.log(error);
    }
  };

  // ===========================================
  // SEARCH SUGGESTIONS
  // ===========================================

  const handleSearchChange = async (
    value
  ) => {
    setSearch(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setSearchLoading(true);

      const { data } = await api.get(
        `/properties/suggestions?q=${value}`
      );

      setSuggestions(
        data.suggestions || []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setSearchLoading(false);
    }
  };

  // ===========================================
  // SEARCH
  // ===========================================

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (propertyType) {
      params.set(
        "propertyType",
        propertyType
      );
    }

    switch (listingType) {
      case "buy":
        navigate(`/buy?${params.toString()}`);
        break;

      case "rent":
        navigate(`/rent?${params.toString()}`);
        break;

      default:
        navigate(`/properties?${params.toString()}`);
    }
  };

  // ===========================================
  // EFFECTS
  // ===========================================

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated]);

  return (
    <main className="home-page">

      {/* ===========================================
          HERO
      =========================================== */}

      <section className="home-hero-section">

        <div className="container home-hero-content">

          <span className="home-hero-badge">
            Find Your Dream Property
          </span>

          <h1>
            Buy or Rent Properties
            <br />
            With BaseraMitra
          </h1>

          <p>
            Search verified properties
            across different cities.
          </p>

          <form
            className="home-hero-search"
            onSubmit={handleSearch}
          >

            {/* LOCATION */}

            <div className="home-search-box">

              <MapPin size={18} />

              <input
                type="text"
                placeholder="Search City"
                value={search}
                onChange={(e) =>
                  handleSearchChange(
                    e.target.value
                  )
                }
              />

              {suggestions.length > 0 && (

                <div className="home-suggestion-box">

                  {suggestions.map(
                    (item, index) => (

                      <button
                        type="button"
                        key={index}
                        className="home-suggestion-item"
                        onClick={() => {
                          setSearch(item);
                          setSuggestions([]);
                        }}
                      >
                        {item}
                      </button>

                    )
                  )}

                </div>

              )}
            </div>
                        {/* PROPERTY TYPE */}

            <div className="home-search-box">

              <Building2 size={18} />

              <select
                value={propertyType}
                onChange={(e) =>
                  setPropertyType(e.target.value)
                }
              >

                <option value="">
                  Property Type
                </option>

                {PROPERTY_TYPES.map((type) => (

                  <option
                    key={type}
                    value={type}
                  >
                    {type.charAt(0).toUpperCase() +
                      type.slice(1)}
                  </option>

                ))}

              </select>

            </div>

            {/* LISTING TYPE */}

            <div className="home-search-box">

              <House size={18} />

              <select
                value={listingType}
                onChange={(e) =>
                  setListingType(e.target.value)
                }
              >

                <option value="">
                  All Listings
                </option>

                <option value="buy">
                  Buy
                </option>

                <option value="rent">
                  Rent
                </option>

              </select>

            </div>

            {/* SEARCH BUTTON */}

            <button
              type="submit"
              className="home-search-btn"
            >

              <Search size={18} />

              Search

            </button>

          </form>

        </div>

      </section>

      {/* ===========================================
          LATEST BUY PROPERTIES
      =========================================== */}

      <section className="home-section">

        <div className="container">

          <div className="home-section-header">

            <h2>
              Latest Buy Properties
            </h2>

            <Link to="/buy">

              View All

              <ArrowRight size={16} />

            </Link>

          </div>

          <div className="home-property-grid">

            {loading ? (

              <p>
                Loading properties...
              </p>

            ) : buyProperties.length === 0 ? (

              <p>
                No buy properties available.
              </p>

            ) : (

              buyProperties
                .slice(0, 3)
                .map((property) => (

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
            {/* ===========================================
          LATEST RENT PROPERTIES
      =========================================== */}

      <section className="home-section">

        <div className="container">

          <div className="home-section-header">

            <h2>
              Latest Rent Properties
            </h2>

            <Link to="/rent">

              View All

              <ArrowRight size={16} />

            </Link>

          </div>

          <div className="home-property-grid">

            {loading ? (

              <p>
                Loading properties...
              </p>

            ) : rentProperties.length === 0 ? (

              <p>
                No rent properties available.
              </p>

            ) : (

              rentProperties
                .slice(0, 3)
                .map((property) => (

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

export default Home;