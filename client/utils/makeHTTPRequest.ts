import AsyncStorage from "@react-native-async-storage/async-storage";

// Make http request with body
export const makeHTTPRequestWithBody = async (
  url: string,
  method: string,
  body: any
) => {
  try {
    let token = await AsyncStorage.getItem("auth-token");

    const res = await fetch(`${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(
      `Error while making request to ${url.split("v1")[1]}  :: `,
      error
    );
  }
};

// Make http request
export const makeHTTPRequest = async (url: string, method: string) => {
  try {
    let token = await AsyncStorage.getItem("auth-token");

    const res = await fetch(`${url}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(
      `Error while making request to ${url.split("v1")[1]}  :: `,
      error
    );
  }
};
