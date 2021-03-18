import firebase from 'firebase/app'
import "firebase/auth"
import "firebase/firestore"

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
export const db = firebase.firestore()

const googleProvider = new firebase.auth.GoogleAuthProvider()
export const signInWithGoogle = () =>{
    auth.signInWithPopup(googleProvider).then((res)=>{
        checkIfUserExists(res.user)
    }).catch((error)=>{
        console.log(error.message)
    })
}

export const signOut = () =>{
    auth.signOut().then((res)=>{
        window.location.reload()
    }).catch((error)=>{
        console.log(error)
    })
}

export const checkIfUserExists = (user) =>{
    let email = user.email
    db.collection('users').doc(email).get().then((snapshot)=>{
        if(!snapshot.exists){
            console.log("USER DOES NOT EXIST")
            createUserDB(user.email)
        }else{
            console.log("USER EXISTS")
        }
    })
}

const createUserDB = (email) =>{
    db.collection('users').doc(email).set({energy:3})
    console.log("USER CREATED")
}

export const addTopupFillers = (email) =>{
    let fillerTopup = 5
    db.collection('users').doc(email).get().then((snapshot)=>{
        let fillerCount = snapshot.data().energy
        db.collection('users').doc(email).set({energy:fillerCount+fillerTopup})
    })
}

export default app  

