import firebase from 'firebase/app'
import "firebase/auth"

var firebaseConfig = {
    apiKey: "AIzaSyCgBgYQYByo-4RHmLohvtBb33UFknX8SF0",
    authDomain: "third-wharf-305714.firebaseapp.com",
    projectId: "third-wharf-305714",
    storageBucket: "third-wharf-305714.appspot.com",
    messagingSenderId: "331162434345",
    appId: "1:331162434345:web:44502b8a1634eeb815d538",
    measurementId: "G-028M52HL27"
  };

const app = firebase.initializeApp(firebaseConfig)
export const auth = app.auth()

const googleProvider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = () =>{
    auth.signInWithPopup(googleProvider).then((res)=>{
        console.log(res.user)
    }).catch((error)=>{
        console.log(error.message)
    })
}

export const signOut = () =>{
    auth.signOut().then((res)=>{
        console.log("SIGNED OUT!")
    }).catch((error)=>{
        console.log("ERROR SIGNING OUT")
    })
}

export default app  
