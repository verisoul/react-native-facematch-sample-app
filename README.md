# react-native-facematch-sample-app

## Getting started

Put you api key in the headers. Make sure to use correct api key for the environment you are using.
```javascript
let headers = {
    "x-api-key": "YOUR_API_KEY_HERE",
    "Content-Type": "application/json"
}
```

Install dependencies
```console
npm install
```

Run the app via Expo either on a simulator or a physical device
```console
npx expo start
```

## ID Check
To run sample app with ID Check, simply add `?id=true` parameter to the get session URL:
```javascript
const faceAndIdSession = await fetch(`https://${API_URL}/liveness/session?id=true`, {
    method: 'GET',
    headers: headers,
})
```
