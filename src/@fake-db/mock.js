import axios from '@axios'
import MockAdapter from 'axios-mock-adapter'

// This sets the mock adapter on the axios instance
const mock = new MockAdapter(axios, { delayResponse: 100 })

// Add some debugging
console.log('🔧 Mock system initialized with axios instance:', axios)
console.log('🔧 Mock adapter created:', mock)

export default mock
