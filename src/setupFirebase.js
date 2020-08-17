import firebase from 'firebase';
// Required for side-effects
import 'firebase/firestore';


firebase.initializeApp({
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID
});
