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
