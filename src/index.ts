import { LitElement, html, property } from "@polymer/lit-element";

class ArtistReleases extends LitElement {
  artistId: string;
  data: {
    name: string;
    releases: [{ date: string; country: string; title: string }];
  };
  country: string;

  static get properties() {
    return {
      artistId: { type: String },
      data: { type: Array },
      country: { type: String }
    };
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.artistId && this.country) {
      this.fetchData();
    }
  }

  fetchData() {
    fetch(
      `//musicbrainz.org/ws/2/artist/${this.artistId}?inc=releases&fmt=json`
    )
      .then(res => res.json())
      .then(response => {
        this.data = response;
      })
      .catch(error => console.error("Error:", error));
  }

  render() {
    if (!this.data) {
      return html`
        <h4>Loading...</h4>
      `;
    }
    const { name, releases } = this.data;
    const sortedReleases = releases
      .sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0))
      .filter(rel => rel.country === this.country);
    return html`
      <style>
        :host {
          display: block;
          font-family: Roboto, Helvetica, Arial, sans-serif;
          font-size: 16px;
          padding: 2rem;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        li {
          line-height: 1.6rem;
        }
      </style>
      <h2>${name}</h2>
      <ul>
        ${
          sortedReleases.map(
            r =>
              html`
                <li>${r.title} ${r.date}</li>
              `
          )
        }
      </ul>
    `;
  }
}

customElements.define("artist-releases", ArtistReleases);
