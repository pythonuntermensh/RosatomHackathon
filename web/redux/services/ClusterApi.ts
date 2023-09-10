import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const clusterApi = createApi({
  reducerPath: 'clusterApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/',
  }),
  endpoints: (builder) => ({
    clusterFile: builder.mutation({
      query: (file) => ({
        url: '/predict',
        method: 'POST',
        body: file,
      }),
    }),
    clusterTextHist: builder.mutation({
      query: (answers) => ({
        url: '/hist',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        method: 'POST',
        body: JSON.stringify({answers: answers}),
      }),
    }),
    clusterTextScatter: builder.mutation({
      query: (answers) => ({
        url: '/points',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        method: 'POST',
        body: JSON.stringify({answers: answers}),
      }),
    }),
    clusterTextBubble: builder.mutation({
      query: (answers) => ({
        url: '/bubbles',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        method: 'POST',
        body: JSON.stringify({answers: answers}),
      }),
    }),
    makeFile: builder.mutation({
      query: (answers) => ({
        url: '/json',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        method: 'POST',
        body: JSON.stringify({answers: answers}),
      }),
    }),
  }),
})

export const {
  useClusterFileMutation,
  useClusterTextHistMutation,
  useClusterTextScatterMutation,
  useClusterTextBubbleMutation,
  useMakeFileMutation
} = clusterApi