import { db } from './index'
import { v4 as uuid } from 'uuid'

export const createNewReferralCode = async ({ userId, email, customerId }) => {
  const referralCode = uuid()

  await db.collection('referral_codes').doc(userId).set({
    userId,
    email,
    customerId,
    referralCode,
    added_at: new Date()
  })
    .catch(error => {
      throw error
    })

  return referralCode
}

export const getUserReferralCode = async (userId) => {
  return db.collection('referral_codes').doc(userId).get()
    .catch(error => {
      throw error
    })
}

export const getReferralCode = async (referralCode) => {
  return db.collection('referral_codes')
    .where('referralCode', '==', referralCode)
    .limit(1)
    .get()
    .catch(error => {
      throw error
    })
}

export const createReferralRecord = async (referralCodeRecord, referredCustomerEmail) => {
  const { userId, email, customerId, referralCode } = referralCodeRecord

  await db.collection('referral_records').add({
    userId,
    email,
    customerId,
    referralCode,
    referredCustomerEmail,
    redeemed: false,
    added_at: new Date()
  })
    .catch(error => {
      throw error
    })
}

export const getReferralRecords = () => {
  return db.collection('referral_records')
    .where('redeemed', '==', false)
    .get()
    .catch(error => {
      throw error
    })
}

export const getAllUserReferralRecords = (userId) => {
  return db.collection('referral_records')
    .where('userId', '==', userId)
    .get()
    .catch(error => {
      throw error
    })
}

export const markRecordAsRedeemed = (id) => {
  return db.collection('referral_records').doc(id).set({ redeemed: true }, { merge: true })
    .catch(error => {
      throw error
    })
}

// export const deleteArticleReadStatus = (readStatusId) => {
//     return db.collection("read_statuses")
//         .doc(readStatusId)
//         .delete()
//         .catch(error => {
//             throw error;
//         });
// }
