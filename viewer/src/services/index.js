let count = 1

const setLoading = (isLoading) => {
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

export default setLoading
