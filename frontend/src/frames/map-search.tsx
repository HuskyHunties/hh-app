import React from "react";
import { Autocomplete } from "@react-google-maps/api";
import "../css/maps.css";
import API from "../utils/API";

/**
 * Properties type for the search panel component.
 */
interface SearchPanelProps {
  map?: google.maps.Map<Element>;
  setPlaces(places: google.maps.places.PlaceResult[]): void;
  places: google.maps.places.PlaceResult[];
  select(id?: string): void;
  selected?: string | number;
}

/**
 * State type for the search panel component
 */
interface SearchPanelState {
  placeDetails?: google.maps.places.PlaceResult;
}

/**
 * A class to represent a search panel component that facilitates easy searching for locations on the map.
 */
export default class SearchPanel extends React.Component<
  SearchPanelProps,
  SearchPanelState
> {
  private autocomplete?: google.maps.places.Autocomplete;
  private service?: google.maps.places.PlacesService;
  private geocoder?: google.maps.Geocoder;
  private static placeRequestFields: string[] = [
    "name",
    "icon",
    "vicinity",
    "types",
    "photos",
    "website",
    "geometry",
  ];

  constructor(props: SearchPanelProps) {
    super(props);
    this.state = {};
  }

  /**
   * Handles the user either selecting a place from the list, or searching for a term.
   */
  private onPlaceChanged(place: google.maps.places.PlaceResult) {
    if (!this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
    }

    this.props.select(undefined);

    if (Object.entries(place).length === 1) {
      const request: google.maps.places.TextSearchRequest = {
        query: place.name,
        bounds: this.props.map?.getBounds()!,
      };

      if (!this.service) {
        this.service = new google.maps.places.PlacesService(this.props.map!);
      }

      this.service.textSearch(
        request,
        (results: google.maps.places.PlaceResult[], status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.props.setPlaces(results);
          } else {
            console.log(status);
            throw new Error("Places Search Request Failed");
          }
        }
      );
    } else {
      this.props.setPlaces([place]);
      this.props.select(place.place_id!);
    }
  }

  /**
   * If the selected value has changed to a searched option, gets details about that option.
   * @param previous the previous props
   */
  componentDidUpdate(previous: SearchPanelProps) {
    if (
      typeof this.props.selected === "string" &&
      this.props.selected !== previous.selected
    ) {
      if (!this.service) {
        this.service = new google.maps.places.PlacesService(this.props.map!);
      }

      this.service.getDetails(
        {
          fields: SearchPanel.placeRequestFields,
          placeId: this.props.selected,
        },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.setState({ placeDetails: result });
          } else {
            console.log(status);
            throw new Error("Place Detail Request Failed.");
          }
        }
      );
    }
  }



  render() {
    let searchResults: JSX.Element = <div></div>;
    if (
      this.props.selected &&
      typeof this.props.selected === "string" &&
      this.state.placeDetails
    ) {
      const place = this.state.placeDetails;

      searchResults = (
        <div className="search-results">
          <h4>{place.name}</h4>
          <img src={place.icon} className="icon" alt="icon" />
          {place.vicinity} <br></br>
          Types: {place.types?.join(", ")}
          <br />
          {place.website ? <a href={place.website}>Website</a> : ""}
          {place.photos?.map((photo, index) => {
            return (
              <img
                key={index}
                className="search-img"
                src={photo.getUrl({})}
                alt=""
              />
            );
          })}
        </div>
      );
    } else {
      const entries = this.props.places.map((place) => {
        return (
          <div
            className={
              this.props.selected === place.place_id
                ? "search-entry selected"
                : "search-entry"
            }
            key={place.place_id}
            onClick={() => this.props.select(place.place_id!)}
          >
            <h6>{place.name}</h6>
            <img src={place.icon} className="icon" alt="icon" />
            {place.formatted_address} <br></br>
            Types: {place.types?.join(", ")}
          </div>
        );
      });

      searchResults = <div className="search-results">{entries}</div>;
    }

    return (
      <div className="search-panel">
        <Autocomplete
          onLoad={(ref) => (this.autocomplete = ref)}
          onPlaceChanged={() =>
            this.onPlaceChanged(this.autocomplete!.getPlace())
          }
          bounds={this.props.map?.getBounds()!}
        >
          <input
            type="text"
            placeholder="Search"
            style={{
              boxSizing: `border-box`,
              border: `1px solid transparent`,
              width: `100%`,
              height: `32px`,
              padding: `0 12px`,
              borderRadius: `3px`,
              boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
              fontSize: `14px`,
              outline: `none`,
              textOverflow: `ellipses`,
              position: "absolute",
              left: "0%",
              marginLeft: "0px",
            }}
          />
        </Autocomplete>

        {searchResults}
      </div>
    );
  }
}
