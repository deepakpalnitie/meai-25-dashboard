import * as React from 'react';
import { useState, useEffect } from 'react';
// import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import { makeStyles } from '@mui/material/styles';
// import ProTip from '../src/ProTip';
import Link from '../src/Link';
import CountUp from 'react-countup';
// import Copyright from '../src/Copyright';

import { useUser } from '../lib/hooks'
import Layout from "../components/Layout";
import DMap from '../components/DMap';


import Chart from '../components/Chart2';
import { styled } from '@mui/material/styles';
import { CenterFocusStrong } from '@mui/icons-material';
const Div = styled('div')(({ theme }) => ({
  ...theme.typography.button,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1),
}));
const Paper2 = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  verticalAlign: "middle",
  padding: "1.5em 0",

}));



export default function Index({ data }) {

  const user = useUser({ redirectTo: '/login' })

  return (
    <Layout title="Dashboard">
      {user ? (
        <>
          <Box sx={{ my: 4 }}>
            {/* <Typography variant="h3" component="h2" gutterBottom align='center' color={ 'green'}>
          Dashboard
        </Typography> */}
            <Typography variant="h4" component="h1" gutterBottom align='center' color={'#606060'}>
              DH Financial Dashboard
            </Typography>

            <Chart data={{chartTitle:"Month-wise Submitted Bills",bg:"rgba(255, 99, 132, 0.5)",...data["BILLS_YEARMONTH"]}} />
            <Chart data={{chartTitle:"Month-wise Advances",bg:"rgba(55, 199, 132, 0.5)",...data["ADVANCES_YEARMONTH"]}} />

          </Box>
        </>) : "Please, login to access dashboard"}
      {/* test */}
    </Layout>
  );
}

export async function getStaticProps() {
  // const res = await fetch('https://script.google.com/macros/s/AKfycbyFP9YfqFVqOCv8alYEaAysSrIjv3jTVRIG_7T2uOjZAA64BdO0WHCFZSlTacF4zoiU/exec')
  const res = await fetch('https://script.google.com/macros/s/AKfycbxAKqrQuQ-fZJ9tt2KzGp7Jsv2JYIaI7cGCDW8Izw4mPNCu2OUpzM35tp49v3_021c_/exec')
  // console.log(res)
  const data = await res.json()
  // console.log(data)

  return {
    props: {
      data,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 2 seconds
    revalidate: 2, // In seconds
  }
}
