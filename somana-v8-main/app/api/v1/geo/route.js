import axios from "axios";
import { NextResponse } from "next/server";

// Function to get the location based on IP address
const getLocationFromIP = async () => {
  try {
    // Make a request to an IP geolocation API
    const response = await axios.get(
      `https://ipinfo.io/json?token=7ba5dd09527cf4`
    );

    // Extract only the relevant location information
    const { ip, city, region, country, loc, org, postal, timezone } =
      response.data;

    return { ip, city, region, country, loc, org, postal, timezone };
  } catch (error) {
    console.error("Error fetching location:", error);
    return null; // Return null if there's an error fetching the location
  }
};

// Handler for the GET request
export async function GET(request) {
  try {
    const data = await getLocationFromIP();

    if (data) {
      // Return only the extracted data as JSON
      return NextResponse.json({ data }, { status: 200 });
    } else {
      return NextResponse.json({ data: "Data unavailable" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error getting geolocation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
