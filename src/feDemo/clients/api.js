const url = 'http://localhost:3001'

const getFromApi = async (path, headers = {}) => {
  const response = await fetch(`${url}${path}`, {
    method: 'GET',
    headers:{
      ...headers
    }
  })

  return response.json()
}

const postToApi = async (path, data, headers = {}) => {
  const config = {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      ...headers
    }
  }
  if (data) {
    config.body = JSON.stringify(data)
  }
  const response = await fetch(`${url}${path}`, config)
    
  return response.json()
}


export {
  url,
  getFromApi,
  postToApi
}