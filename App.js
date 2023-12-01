import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';


const env = 'sandbox' // sandbox, prod

const WEB_URL = `app.${env}.verisoul.ai`
const API_URL = `api.${env}.verisoul.ai`

let headers = {
    "x-api-key": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "Content-Type": "application/json"
}

export default function App() {
    const [sessionId, setSessionId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showWebView, setShowWebView] = useState(true);

    const onNavigationStateChange = (navState) => {
        if (!navState.url.includes(WEB_URL)) {
            setShowWebView(false);
        }
    };

    const handleSessionFinished = async () => {
        /*
        For example purposes only.
        Run this on the backend.
         */

        /*
        If the user is signing up for the first time call /enroll endpoint
        */

        const data = {
            "session_id": sessionId,
            "account_id": "1234567890",
        }

        try {
            const response = await fetch(`https://${API_URL}/liveness/enroll`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            })
            const json = await response.json()
            console.log(json)
            if (json.success) {
                console.log("User Successfully enrolled")
            }
        } catch (e) {
            // User did not complete session or API call failed
            console.log("Enroll failed")
            console.log(e)
        }

        /*
        If the user is signing in/you are verifying the identity call /verify-identity
        Pass in the current session and the account_id that you would like to match against
       */

        try {
            const response = await fetch(`https://${API_URL}/liveness/verify-identity`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            })
            const json = await response.json()
            console.log(json)
            if (json.success && json.match) {
                console.log("User Successfully verified")
            } else if (json.success && !json.match) {
                console.log("User did not match")
            } else {
                console.log("User did not complete session")
            }
        } catch (e) {
            // User did not complete session or API call failed
            console.log("Verify failed")
            console.log(e)
        }


    }

    useEffect(() => {
        if (showWebView) return;
        handleSessionFinished()
    }, [showWebView]);

    const getSession = async () => {
        /*
        For example purposes only.
        Run this on the backend and pass session to the client
         */
        try {
            const response = await fetch(`https://${API_URL}/liveness/session`, {
                method: 'GET',
                headers: headers,
            })
            const json = await response.json()
            setSessionId(json.session_id);
            setIsLoading(false);
        } catch (e) {
            // User did not complete session or API call failed
            console.log(e)
        }
    }

    useEffect(() => {
        getSession()
    }, []);


    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    if (!showWebView) {
        return (
            <View style={styles.centeredView}>
                <Text style={styles.centeredText}> WebView is closed now!</Text>
            </View>
        )
    }


    return (
        <View style={{flex: 1}}>
            <WebView
                source={{uri: `https://${WEB_URL}?session_id=${sessionId}`}}
                onNavigationStateChange={onNavigationStateChange}
                style={styles.webView}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    webView: {
        flex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredText: {
        fontSize: 20,
    },
});