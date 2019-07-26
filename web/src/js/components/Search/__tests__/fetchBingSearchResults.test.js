/* eslint-env jest */

import {
  flushAllPromises,
  getDefaultSearchGlobal,
  mockFetchResponse,
  runAsyncTimerLoops,
} from 'js/utils/test-utils'
import { getSearchResultCountPerPage } from 'js/utils/search-utils'
import getBingMarketCode from 'js/components/Search/getBingMarketCode'
import { getUrlParameters } from 'js/utils/utils'

jest.mock('js/components/Search/getMockBingSearchResults')
jest.mock('js/utils/search-utils')
jest.mock('js/utils/local-user-data-mgr')
jest.mock('js/components/Search/getBingMarketCode')
jest.mock('js/utils/utils')

beforeEach(() => {
  process.env.NODE_ENV = 'test'
  process.env.REACT_APP_MOCK_SEARCH_RESULTS = false
  process.env.REACT_APP_SEARCH_QUERY_ENDPOINT =
    'https://search-api.example.com/query'
  global.fetch.mockImplementation(() => Promise.resolve(mockFetchResponse()))
  getSearchResultCountPerPage.mockReturnValue(10)
  getUrlParameters.mockReturnValue({})
  window.searchforacause = getDefaultSearchGlobal()
  jest.useFakeTimers()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('fetchBingSearchResults', () => {
  it('calls fetch once', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('calls the expected endpoint', async () => {
    expect.assertions(1)
    process.env.REACT_APP_SEARCH_QUERY_ENDPOINT =
      'https://some-endpoint.example.com/api/query'
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const url = new URL(calledURL)
    expect(`${url.origin}${url.pathname}`).toEqual(
      'https://some-endpoint.example.com/api/query'
    )
  })

  it('uses the expected query value', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('q')).toEqual('blue whales')
  })

  it('uses the expected responseFilter value', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('responseFilter')).toEqual(
      'Webpages,News,Ads,Computation,TimeZone,Videos'
    )
  })

  // The commas are required by the Bing API. Other encodings fail.
  it('comma-encodes the responseFilter list', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const rawResponseFilterStrVal = calledURL
      .split('responseFilter=')
      [calledURL.split('responseFilter=').length - 1].split('&')[0]
    expect(rawResponseFilterStrVal).toEqual(
      'Webpages,News,Ads,Computation,TimeZone,Videos'
    )
  })

  it('uses the "count" value from getSearchResultCountPerPage', async () => {
    expect.assertions(1)
    const { getSearchResultCountPerPage } = require('js/utils/search-utils')
    getSearchResultCountPerPage.mockReturnValue(132)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('count')).toEqual('132')
  })

  it('uses the expected mainlineCount value', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('mainlineCount')).toEqual('3')
  })

  it('sets the pageNumber value to the page passed to it, minus one', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales', page: 12 })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('pageNumber')).toEqual('11')
  })

  it('uses the expected sidebarCount value', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('sidebarCount')).toEqual('0')
  })

  it('specifies some supportedAdExtensions', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('supportedAdExtensions')).toEqual(
      'EnhancedSiteLinks,SiteLinks'
    )
  })

  it('uses the expected adTypesFilter value', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('adTypesFilter')).toEqual('TextAds')
  })

  // The commas are required by the Bing API. Other encodings fail.
  it('comma-encodes the adTypesFilter list', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const rawAdTypesFilterStrVal = calledURL
      .split('adTypesFilter=')
      [calledURL.split('adTypesFilter=').length - 1].split('&')[0]
    expect(rawAdTypesFilterStrVal).toEqual('TextAds')
  })

  it('sends the Bing client ID if one exists', async () => {
    expect.assertions(1)
    const { getBingClientID } = require('js/utils/local-user-data-mgr')
    getBingClientID.mockReturnValue('bing-id-987654321')
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('bingClientID')).toEqual('bing-id-987654321')
  })

  it('does not set the Bing client ID if no ID exists', async () => {
    expect.assertions(1)
    const { getBingClientID } = require('js/utils/local-user-data-mgr')
    getBingClientID.mockReturnValue(null)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('bingClientID')).toBeNull()
  })

  it('sets the "mkt" parameter value, when known', async () => {
    expect.assertions(1)
    getBingMarketCode.mockResolvedValueOnce('es-MX')
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('mkt')).toEqual('es-MX')
  })

  it('does not sets the "mkt" parameter value when it is not known', async () => {
    expect.assertions(1)
    getBingMarketCode.mockResolvedValueOnce(null)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('mkt')).toBeNull()
  })

  it('sets the "offset" parameter value if a page number is provided', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales', page: 3 })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('offset')).toEqual('20')
  })

  // FIXME: fix fetching/storage logic
  // it('sets the "offset" parameter with the expected value based on the page number and results per page', async () => {
  //   expect.assertions(4)
  //   const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
  //     .default

  //   // Expected offset value for the second page.
  //   await fetchBingSearchResults({ query: 'blue whales', page: 2 })
  //   const searchParamsA = new URL(fetch.mock.calls[0][0]).searchParams
  //   expect(searchParamsA.get('offset')).toEqual('10')

  //   // Expected offset value for the eighth page.
  //   await fetchBingSearchResults({ query: 'blue whales', page: 8 })
  //   const searchParamsB = new URL(fetch.mock.calls[1][0]).searchParams
  //   expect(searchParamsB.get('offset')).toEqual('70')

  //   // The offset for the pages changes if we change how many
  //   // results per page to show.
  //   getSearchResultCountPerPage.mockReturnValue(12)

  //   await fetchBingSearchResults({ query: 'blue whales', page: 3 })
  //   const searchParamsC = new URL(fetch.mock.calls[2][0]).searchParams
  //   expect(searchParamsC.get('offset')).toEqual('24')

  //   await fetchBingSearchResults({ query: 'blue whales', page: 8 })
  //   const searchParamsD = new URL(fetch.mock.calls[3][0]).searchParams
  //   expect(searchParamsD.get('offset')).toEqual('84')
  // })

  it('does not set the "offset" parameter value if a page number is not provided', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('offset')).toBeNull()
  })

  it('returns the expected contents of the response body', async () => {
    expect.assertions(1)
    global.fetch.mockImplementation(() =>
      Promise.resolve(
        mockFetchResponse({
          json: () =>
            Promise.resolve({
              bing: {
                foo: 'bar',
                hi: 'there',
                abc: [1, 2, 3],
              },
              bingQuery: {
                msEdgeClientID: 'abc-123',
              },
            }),
        })
      )
    )
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    const results = await fetchBingSearchResults({ query: 'blue whales' })
    expect(results).toEqual({
      bing: {
        foo: 'bar',
        hi: 'there',
        abc: [1, 2, 3],
      },
      bingQuery: {
        msEdgeClientID: 'abc-123',
      },
    })
  })

  it('throws if the query endpoint environment variable is not defined', async () => {
    expect.assertions(1)
    delete process.env.REACT_APP_SEARCH_QUERY_ENDPOINT
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    return expect(
      fetchBingSearchResults({ query: 'blue whales' })
    ).rejects.toThrow('Search query endpoint is not defined.')
  })

  it('fetches with a GET request', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch.mock.calls[0][1]).toMatchObject({
      method: 'GET',
    })
  })

  it('fetches with the expected headers', async () => {
    expect.assertions(1)
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch.mock.calls[0][1]).toMatchObject({
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  })

  it('throws if the provided query is null and there isn\'t a "q" parameter value', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({})
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    return expect(fetchBingSearchResults({ query: null })).rejects.toThrow(
      'Search query must be a non-empty string.'
    )
  })

  it('throws if not passed any arguments and there isn\'t a "q" parameter value', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({})
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    return expect(fetchBingSearchResults()).rejects.toThrow(
      'Search query must be a non-empty string.'
    )
  })

  it('uses the "q" URL parameter value if not passed a query value', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'paris',
    })
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults() // no query value provided
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('q')).toEqual('paris')
  })

  it('uses the "q" URL parameter value if not passed any arguments', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'paris',
    })
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults() // no arguments
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('q')).toEqual('paris')
  })

  it('ignores the "q" parameter value when passed a query value', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'paris',
    })
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'london' })
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('q')).toEqual('london')
  })

  it('uses the "page" parameter value if no page number is provided', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'belgium',
      page: '4',
    })
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'belgium' }) // no page number value provided
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('pageNumber')).toEqual('3')
  })

  it('does not use the "page" parameter value if it is less than zero', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'belgium',
      page: '-2',
    })
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'belgium' }) // no page number value provided
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('pageNumber')).toEqual('0')
  })

  it('does not use the "page" parameter value if it is not a number', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'belgium',
      page: 'hello',
    })
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'belgium' }) // no page number value provided
    const calledURL = fetch.mock.calls[0][0]
    const { searchParams } = new URL(calledURL)
    expect(searchParams.get('pageNumber')).toEqual('0')
  })

  it('throws if the response has a 500 status', async () => {
    expect.assertions(1)
    global.fetch.mockImplementation(() =>
      Promise.resolve(
        mockFetchResponse({
          ok: false,
          status: 500,
        })
      )
    )
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    return expect(
      fetchBingSearchResults({ query: 'blue whales' })
    ).rejects.toThrow('Request failed with status 500')
  })

  it('throws if the response cannot be converted to JSON', async () => {
    expect.assertions(1)
    global.fetch.mockImplementation(() =>
      Promise.resolve(
        mockFetchResponse({
          json: () => {
            throw new Error('Bad JSON problem!')
          },
        })
      )
    )
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default

    return expect(
      fetchBingSearchResults({ query: 'blue whales' })
    ).rejects.toThrow('Bad JSON problem!')
  })
})

describe('fetchBingSearchResults: development-only mock data', () => {
  it('calls for mock search results if NODE_ENV=development and REACT_APP_MOCK_SEARCH_RESULTS=true', done => {
    expect.assertions(2)
    process.env.NODE_ENV = 'development'
    process.env.REACT_APP_MOCK_SEARCH_RESULTS = 'true'
    const getMockBingSearchResults = require('js/components/Search/getMockBingSearchResults')
      .default
    getMockBingSearchResults.mockReturnValue({
      some: 'stuff',
    })
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    fetchBingSearchResults({ query: 'blue whales' }).then(result => {
      expect(getMockBingSearchResults).toHaveBeenCalledTimes(1)
      expect(result).toEqual({
        some: 'stuff',
      })
      done()
    })
    jest.runAllTimers()
  })

  it('does not use mock search results if NODE_ENV=production, even if REACT_APP_MOCK_SEARCH_RESULTS=true', done => {
    expect.assertions(1)
    process.env.NODE_ENV = 'production'
    process.env.REACT_APP_MOCK_SEARCH_RESULTS = 'true'
    const getMockBingSearchResults = require('js/components/Search/getMockBingSearchResults')
      .default
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    fetchBingSearchResults({ query: 'blue whales' })
      .then(result => {
        expect(getMockBingSearchResults).not.toHaveBeenCalled()
        done()
      })
      .catch(e => {
        throw e
      })
    jest.runAllTimers()
  })

  it('does not use mock search results if REACT_APP_MOCK_SEARCH_RESULTS=false', done => {
    expect.assertions(1)
    process.env.NODE_ENV = 'development'
    process.env.REACT_APP_MOCK_SEARCH_RESULTS = 'false'
    const getMockBingSearchResults = require('js/components/Search/getMockBingSearchResults')
      .default
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    fetchBingSearchResults({ query: 'blue whales' })
      .then(result => {
        expect(getMockBingSearchResults).not.toHaveBeenCalled()
        done()
      })
      .catch(e => {
        throw e
      })
    jest.runAllTimers()
  })
})

describe('fetchBingSearchResults: using previously-fetched data', () => {
  it("[no previous request data]: fetches new data when the search global doesn't exist", async () => {
    expect.assertions(1)
    delete window.searchforacause
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it("[no previous request data]: fetches new data when the search global query tracker doesn't exist", async () => {
    expect.assertions(1)
    delete window.searchforacause.queryRequest
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('[no previous request data]: fetches new data when no previous request was made', async () => {
    expect.assertions(1)
    window.searchforacause.queryRequest = {
      status: 'NONE',
      displayedResults: false,
      responseData: null,
    }
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('[completed request with data]: does not fetch new data', async () => {
    expect.assertions(1)
    window.searchforacause.queryRequest = {
      status: 'COMPLETE',
      displayedResults: false,
      responseData: { some: 'data' },
    }
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('[completed request with data]: uses the expected data', async () => {
    expect.assertions(1)
    window.searchforacause.queryRequest = {
      status: 'COMPLETE',
      displayedResults: false,
      responseData: { some: 'data', abc: 123 },
    }
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    const data = await fetchBingSearchResults({ query: 'blue whales' })
    expect(data).toEqual({ some: 'data', abc: 123 })
  })

  it('[completed request with data]: saves that we have rendered the data after using it for the first time', async () => {
    expect.assertions(1)
    window.searchforacause.queryRequest = {
      status: 'COMPLETE',
      displayedResults: false,
      responseData: { some: 'data', abc: 123 },
    }
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(window.searchforacause.queryRequest.displayedResults).toBe(true)
  })

  it('[completed request with data]: fetches new data if we have already displayed these results once', async () => {
    expect.assertions(1)
    window.searchforacause.queryRequest = {
      status: 'COMPLETE',
      displayedResults: true, // already displayed these results
      responseData: { some: 'data' },
    }
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('[completed request with data]: fetches fresh data on the second query request', async () => {
    expect.assertions(2)
    window.searchforacause.queryRequest = {
      status: 'COMPLETE',
      displayedResults: false,
      responseData: { some: 'data', abc: 123 },
    }
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch).not.toHaveBeenCalled()
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('[completed request with data]: fetches when "ignoreStoredData" is true', async () => {
    expect.assertions(2)
    window.searchforacause.queryRequest = {
      status: 'COMPLETE',
      displayedResults: false,
      responseData: { some: 'data', abc: 123 },
    }
    global.fetch.mockImplementation(() =>
      Promise.resolve(
        mockFetchResponse({
          json: () => Promise.resolve({ my: 'other-data' }),
        })
      )
    )
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    const data = await fetchBingSearchResults({
      query: 'blue whales',
      ignoreStoredData: true,
    })
    expect(fetch).toHaveBeenCalledTimes(1) // fetches data (not using the stored data)
    expect(data).toEqual({ my: 'other-data' }) // uses data from fetch, not the stored data
  })

  it('[completed request, no data]: fetches new data', async () => {
    expect.assertions(1)
    window.searchforacause.queryRequest = {
      status: 'COMPLETE',
      displayedResults: false,
      responseData: null,
    }
    const fetchBingSearchResults = require('js/components/Search/fetchBingSearchResults')
      .default
    await fetchBingSearchResults({ query: 'blue whales' })
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})

describe('prefetchSearchResults: in-progress requests', () => {
  // TODO
})

describe('prefetchSearchResults: storing "prefetched" request data to the search global', () => {
  it('stores fetched data to the search global', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'how to boil water',
    })
    global.fetch.mockImplementation(() =>
      Promise.resolve(
        mockFetchResponse({
          json: () =>
            Promise.resolve({
              bing: {
                foo: 'bar',
                hi: 'there',
                abc: [1, 2, 3],
              },
              bingQuery: {
                msEdgeClientID: 'abc-123',
              },
            }),
        })
      )
    )
    const {
      prefetchSearchResults,
    } = require('js/components/Search/fetchBingSearchResults')
    await prefetchSearchResults()
    expect(window.searchforacause.queryRequest.responseData).toEqual({
      bing: {
        foo: 'bar',
        hi: 'there',
        abc: [1, 2, 3],
      },
      bingQuery: {
        msEdgeClientID: 'abc-123',
      },
    })
  })

  it('stores each stage of the request (NONE, IN_PROGRESS, COMPLETE) to the search global', async () => {
    expect.assertions(3)
    getUrlParameters.mockReturnValue({
      q: 'how to boil water',
    })
    expect(window.searchforacause.queryRequest.status).toEqual('NONE')
    global.fetch.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(
            () =>
              resolve(
                mockFetchResponse({
                  json: () => Promise.resolve({ some: 'data' }),
                })
              ),
            400
          )
        })
    )
    const {
      prefetchSearchResults,
    } = require('js/components/Search/fetchBingSearchResults')
    prefetchSearchResults()
    await flushAllPromises()
    expect(window.searchforacause.queryRequest.status).toEqual('IN_PROGRESS')
    await runAsyncTimerLoops(2)
    expect(window.searchforacause.queryRequest.status).toEqual('COMPLETE')
  })

  it('ignores any existing prefetched data (this is a precaution; other prefetch data should not exist)', async () => {
    expect.assertions(1)
    getUrlParameters.mockReturnValue({
      q: 'how to boil water',
    })
    window.searchforacause.queryRequest = {
      status: 'COMPLETE',
      displayedResults: false,
      responseData: { some: 'data', abc: 123 },
    }
    global.fetch.mockImplementation(() =>
      Promise.resolve(
        mockFetchResponse({
          json: () => Promise.resolve({ the: 'info' }),
        })
      )
    )
    const {
      prefetchSearchResults,
    } = require('js/components/Search/fetchBingSearchResults')
    await prefetchSearchResults()
    expect(window.searchforacause.queryRequest.responseData).toEqual({
      the: 'info',
    })
  })

  it('dispatches a "SearchResultsFetched" event when the fetch is complete', async done => {
    expect.assertions(0)
    getUrlParameters.mockReturnValue({
      q: 'how to boil water',
    })

    // Expect the listener to be called.
    window.addEventListener(
      'SearchResultsFetched',
      function testing() {
        window.removeEventListener('SearchResultsFetched', testing, false)
        done()
      },
      false
    )
    const {
      prefetchSearchResults,
    } = require('js/components/Search/fetchBingSearchResults')
    await prefetchSearchResults()
  })

  it('does not dispatch a "SearchResultsFetched" event until the fetch is complete', async done => {
    expect.assertions(2)
    getUrlParameters.mockReturnValue({
      q: 'how to boil water',
    })

    // Expect the listener to be called.
    window.addEventListener(
      'SearchResultsFetched',
      function testing() {
        window.removeEventListener('SearchResultsFetched', testing, false)
        expect(true).toBe(true) // to make sure both assertions are called
        done()
      },
      false
    )

    global.fetch.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(
            () =>
              resolve(
                mockFetchResponse({
                  json: () => Promise.resolve({ some: 'data' }),
                })
              ),
            400
          )
        })
    )
    const {
      prefetchSearchResults,
    } = require('js/components/Search/fetchBingSearchResults')
    prefetchSearchResults()
    jest.advanceTimersByTime(100)
    await flushAllPromises()
    expect(true).toBe(true) // to make sure both assertions are called
    jest.advanceTimersByTime(500)
    await flushAllPromises()
  })

  it('dispatches a "SearchResultsFetched" event after a timeout period to make sure we aren\'t waiting on a bad request', async done => {
    expect.assertions(0)
    getUrlParameters.mockReturnValue({
      q: 'how to boil water',
    })

    // Expect the listener to be called.
    window.addEventListener(
      'SearchResultsFetched',
      function testing() {
        window.removeEventListener('SearchResultsFetched', testing, false)
        done()
      },
      false
    )

    global.fetch.mockImplementation(
      () =>
        new Promise(resolve => {
          setTimeout(
            () =>
              resolve(
                mockFetchResponse({
                  json: () => Promise.resolve({ some: 'data' }),
                })
              ),
            2300
          )
        })
    )
    const {
      prefetchSearchResults,
    } = require('js/components/Search/fetchBingSearchResults')
    prefetchSearchResults()
    jest.advanceTimersByTime(1200) // less time than the request but more than the timeout
    await flushAllPromises()
  })

  // TODO
})
