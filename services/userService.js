import { db, storage } from './index'
import { DateTime } from 'luxon'

export const createUserProfileDocument = async ({ email, user_uid }) => {
  return db.collection('user_profiles').doc(user_uid).set({
    email,
    active: true,
    subscribed: false
  })
    .catch(error => {
      throw error
    })
}

export const updateCustomerSubscribedStatus = async (uid, customerId) => {
  try {
    const response = await fetch(`/api/users/${uid}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ customerId })
    })

    if (!response.ok) {
      const error = await response.json()
      throw error
    }

    const userData = await response.json()
    return userData
  } catch (e) {
    throw e
  }
}

export const getUserProfile = async (uid) => {
  return db.collection('user_profiles').doc(uid).get()
}

export const getUserClaims = async (uid) => {
  return db.collection('user_claims').doc(uid).get()
}

export const getUserPlans = async (customerId) => {
  if (!customerId) {
    console.error('Missing customerId')
    return
  }

  return fetch(`/api/stripe/get-user-subscriptions?customerId=${customerId}`)
    .then(res => res.json())
}

export const uploadProfileImage = (blob, metadata) => {
  const storageRef = storage.ref().child(`profile_images/${metadata.uid}/${blob.name}`)
  return storageRef.put(blob, metadata)
}

export const updateUserProfile = (uid, attrs) => {
  return db.collection('user_profiles').doc(uid).set(attrs, { merge: true })
}

export const getUserProfileImageURL = (profileImage) => {
  const storageRef = storage.ref()
  return storageRef.child(`profile_images/${profileImage}`).getDownloadURL()
}

export const updateWordCounts = (idToken, words) => {
  const timezone = DateTime.now().zoneName
  return fetch('/api/me/words', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-leerly-token': idToken
    },
    body: JSON.stringify({ tz: timezone, words })
  })
    .then(res => res.json())
}

export const getWordCounts = (idToken) => {
  return fetch('/api/me/words', {
    method: 'GET',
    headers: {
      'x-leerly-token': idToken
    }
  })
    .then(res => res.json())
}

export const getDictionary = (idToken) => {
  return fetch('/api/me/dictionary', {
    method: 'GET',
    headers: {
      'x-leerly-token': idToken
    }
  })
    .then(res => res.json())
}
