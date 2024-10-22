import { OAuth2Client } from "google-auth-library";
import axios, { AxiosError } from "axios";
import { Store } from "./store";

export interface AnalyticsDataQuery {
  dateRanges: { startDate: string; endDate: string }[];
  metrics: { name: string }[];
  dimensions: { name: string }[];
}

export interface SearchConsoleDataQuery {
  startDate: string;
  endDate: string;
  dimensions: string[];
  metrics: string[];
}

export interface Keys {
  client_id: string;
  client_secret: string;
  redirect_uris: string;
}

export interface AnalyticsData {
  propertyId: string;
  query: AnalyticsDataQuery;
}

export interface SearchConsoleData {
  siteUrl: string;
  query: SearchConsoleDataQuery;
}

class ClientGoogleApi extends Store {
  private oauth2Client: OAuth2Client;
  private scope: string[] = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/analytics.readonly",
  ];

  /**
   * Handles OAuth2 flow for Google APIs.
   * @param clientId — The authentication client ID.
   * @param clientSecret — The authentication client secret.
   * @param redirectUri -The URI to redirect to after completing the auth request.
   * @example
   * const client = new ClientGoogleApi({
   *   client_id: "YOUR_CLIENT_ID",
   *   client_secret: "YOUR_CLIENT_SECRET",
   *   redirect_uris: "YOUR_REDIRECT_URI",
   * });
   */
  constructor(keys: Keys) {
    super();
    this.oauth2Client = new OAuth2Client(
      keys.client_id,
      keys.client_secret,
      keys.redirect_uris
    );
    this.init();
  }

  /**
   * Initializes the OAuth2 client with a stored refresh token if one exists.
   * If a token is found, it will be used to refresh the access token.
   * @returns The OAuth2 client with the refreshed credentials set.
   */
  private async init(): Promise<OAuth2Client> {
    const token = this.retrieveToken()?.token;
    if (token) {
      this.oauth2Client.setCredentials({ refresh_token: token });
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      this.oauth2Client.setCredentials(credentials);
    }
    return this.oauth2Client;
  }

  /**
   * Generates a verification URL for the given scope.
   * @param scope The scope or scopes to request authorization for.
   * @returns The verification URL.
   */
  public getVerificationUrl(scope: string[] = this.scope): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope,
    });
  }

  /**
   * Gets an access token using the given authorization code.
   * @param url The URL the user was redirected to after authorizing.
   * @returns The access token.
   */
  public async getAccessToken(url: string): Promise<string> {
    const code = new URL(url).searchParams.get("code");
    if (!code) {
      throw new Error("Authorization code not found");
    }
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    return tokens.access_token!;
  }

  /**
   * Runs a report for the given property and query.
   * @param {Object} params
   * @param {string} params.propertyId The property ID.
   * @param {AnalyticsDataQuery} params.query The query for the report.
   * @returns {Promise<any>} The response from the API.
   */
  public async getAnalyticsData({ propertyId, query }: AnalyticsData): Promise<any> {
    try {
      const { data } = await axios.post(
        `https://content-analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        query,
        {
          headers: {
            Authorization: `Bearer ${this.oauth2Client.credentials.access_token}`,
          },
        }
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.error.message);
      }
      throw error;
    }
  }

  /**
   * Finds the site with the given URL in the list of sites that the user has access to.
   * @param {string} siteUrl The URL of the site to find.
   * @returns {Promise<any>} The API response for the site, or an error if the site is not found.
   * @private
   */
  private async getSearchConsoleSites(siteUrl: string): Promise<any> {
    try {
      const { data } = await axios.get(
        "https://www.googleapis.com/webmasters/v3/sites",
        {
          headers: {
            Authorization: `Bearer ${this.oauth2Client.credentials.access_token}`,
          },
        }
      );

      for (const site of data?.siteEntry) {
        if (site.siteUrl === siteUrl) {
          return site;
        }
        if (
          site.siteUrl.includes(
            siteUrl.replace(/https?:\/\//, "").replace(/http?:\/\//, "")
          )
        ) {
          return site;
        }
      }
      throw new Error("Site not found");
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.error.message);
      }
      throw error;
    }
  }

  /**
   * Runs a report for the given property and query.
   * @param {{ siteUrl: string; query: SearchConsoleDataQuery; }} params
   * @returns {Promise<any>} The response from the API.
   */
  public async getSearchConsoleData({ siteUrl, query }: SearchConsoleData): Promise<any> {
    try {
      const validSiteUrl = await this.getSearchConsoleSites(siteUrl);
      const encodedUrl = encodeURIComponent(validSiteUrl.siteUrl);

      const { data } = await axios.post(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodedUrl}/searchAnalytics/query`,
        query,
        {
          headers: {
            Authorization: `Bearer ${this.oauth2Client.credentials.access_token}`,
          },
        }
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data.error.message);
      }
      throw error;
    }
  }
}

export default ClientGoogleApi;
