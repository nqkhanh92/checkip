export interface IpLocation {
  country: string;
  countryCode: string;
  city: string;
  region: string;
  timezone: string;
  lat: number;
  lon: number;
}

export interface IpNetwork {
  isp: string;
  org: string;
  asn: string;
}

export interface IpSecurity {
  isProxy: boolean;
  isVpn: boolean;
  isTor: boolean;
}

export interface IpInfo {
  ip: string;
  version: "IPv4" | "IPv6";
  location: IpLocation;
  network: IpNetwork;
  security: IpSecurity;
}

export interface IpApiResponse {
  status: "success" | "fail";
  country: string;
  countryCode: string;
  city: string;
  regionName: string;
  timezone: string;
  lat: number;
  lon: number;
  isp: string;
  org: string;
  as: string;
  proxy: boolean;
  hosting: boolean;
  query: string;
}
