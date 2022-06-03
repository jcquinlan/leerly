import { useState, useEffect } from 'react'

const useAsync = (fn, dataPreparer) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getData = () => {
    fn()
      .then(incData => {
        const preparedData = dataPreparer(incData)
        setData(preparedData)
      })
      .catch(err => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  const reload = () => {
    getData()
  }

  return {
    data,
    loading,
    error,
    reload
  }
}

export default useAsync
