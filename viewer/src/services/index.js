import { useRef, useEffect } from 'react'

let count = 1

export const setLoading = (isLoading) => {
  if (isLoading) {
    count++
  } else {
    count--
  }
  if (count > 0) {
    document.querySelector('.pageloader').classList.add('is-active')
  } else {
    document.querySelector('.pageloader').classList.remove('is-active')
  }
}

export const usePrevious = (value) => {
  const ref = useRef(null)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const formatDate = (date, format) => {
  format = format.replace(/yyyy/g, date.getFullYear())
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
  format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2))
  format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2))
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
  format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
  return format
}
