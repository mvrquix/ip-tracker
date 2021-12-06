import { useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'

const IPIFY_API_URL = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_2IhPTM5loBtQucYP8AWhFCMSjxfjq'

const App = () => {
  const [searchParams, setSearchParams] = useState({})
  const [searchResults, setSearchResults] = useState(null)

  const handleInputChange = (event) => {
    const { value } = event.target

    setSearchParams({
      value: value,
      type: determineValueType(value)
    })
  }

  const determineValueType = (value) => {
    return /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/.test(value) ? 'domain' : 'ipAddress'
  }

  const handleSearchClick = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: `${IPIFY_API_URL}&${searchParams.type}=${searchParams.value}`
      })
      setSearchResults(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const renderMarkerIcon = () => {
    return (
      <Icon imagePath="/images/icon-location.svg" />
    )
  }

  const enabled = searchParams.value !== undefined && searchParams.value !== null

  const ipAddress = searchResults ? searchResults.ip : 'N/A'
  const location = searchResults ? `${searchResults.location.city}, ${searchResults.location.region}` : 'N/A'
  const timeZone = searchResults ? searchResults.location.timezone : 'N/A'
  const isp = searchResults ? searchResults.isp : 'N/A'
  const lat = searchResults ? searchResults.location.lat : 38.5816
  const lng = searchResults ? searchResults.location.lng : 121.4944

  return (
    <div className="container-fluid">
      <div className="ip-search row" style={{ background: 'url("/images/pattern-bg.png")' }}>
        <div className="col-md-8 mx-auto text-center pb-5">
          <h1 className="my-3 text-white">IP Address Tracker</h1>

          <div className="input-group mb-5">
            <input
              onChange={handleInputChange}
              type="text"
              className="form-control"
              placeholder="Search for any IP address or domain" />
            <button
              onClick={handleSearchClick}
              disabled={!enabled}
              className="btn btn-dark"
              type="button">
              <img src="/images/icon-arrow.svg" alt="search button icon" />
            </button>
          </div>

        </div>
      </div>
      <div className="ip-search-results row">
        <div className="col-md-10 results-details mx-auto">
          <div className="card">
            <div className="card-body">
              <div className="row py-3">
                <div className="detail-col col-md-3">
                  <span className="detail-label">IP ADDRESS</span>
                  <p className="detail-value">{ipAddress}</p>
                </div>
                <div className="detail-col col-md-3">
                  <span className="detail-label">LOCATION</span>
                  <p className="detail-value">{location}</p>
                </div>
                <div className="detail-col col-md-3">
                  <span className="detail-label">TIMEZONE</span>
                  <p className="detail-value">{timeZone}</p>
                </div>
                <div className="detail-col col-md-3 border-0">
                  <span className="detail-label">ISP</span>
                  <p className="detail-value">{isp}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="map p-0">
          <MapContainer center={[lat, lng]} zoom={16} scrollWheelZoom={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>

      </div>
    </div>
  )
}

export default App
