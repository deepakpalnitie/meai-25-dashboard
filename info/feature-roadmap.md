# Feature Roadmap: Caching and Offline Support

This document tracks the implementation of the client-side caching and offline support feature. The goal is to make the dashboard more resilient and provide a better user experience by allowing it to load instantly with potentially stale data, and even work when the user is offline.

| Step                                            | Status        | Details                                                                                                                            |
| :---------------------------------------------- | :------------ | :--------------------------------------------------------------------------------------------------------------------------------- |
| **1. Install Dependencies**                     | Completed     | Install `swr` for data fetching and caching.                                                                                       |
| **2. Create Proxy API Route**                   | Completed     | Create a new Next.js API route (`pages/api/project-data.js`) to securely fetch data from the Google Apps Script backend.             |
| **3. Refactor Dashboard Page**                  | Completed     | Remove `getServerSideProps` from `pages/project.js` and switch to client-side data fetching using the `useSWR` hook.                 |
| **4. Implement Offline Support**                | Completed     | Configure SWR to use `localStorage` as a cache provider, allowing the app to load data even when the user is offline.              |
| **5. Create KML Proxy Route**                   | Completed     | Create a new API route (`pages/api/kml-data.js`) to proxy KML requests and bypass browser CORS restrictions.                       |
| **6. Update Documentation**                     | Completed     | Update the main README to reflect the new client-side data fetching architecture.                                                  |
