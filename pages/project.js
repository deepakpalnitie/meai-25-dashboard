import * as React from 'react';
import Head from 'next/head';
const { DOMParser } = require('@xmldom/xmldom');
const toGeoJSON = require('@mapbox/togeojson');
import projectsConfig from '../projects.json';


import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import Link from '../src/Link';
import CountUp from 'react-countup';

import Layout from "../components/Layout";
import DMap from '../components/DMap';


import Chart from '../components/Chart';
import { styled } from '@mui/material/styles';

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


// Use getServerSideProps for server-side data fetching.
// This runs on every request and is essential for dynamic data.
export async function getServerSideProps(context) {
  // Get the hostname from the URL query parameter provided by the middleware
  const { projectHostname } = context.query;

  // Retrieve the project configuration from our central file
  const project = projectsConfig[projectHostname];

  if (!project) {
    // If a project is not found, return a 404 page
    return { notFound: true };
  }

  try {
    // Fetch data from the project's specific Google Apps Script endpoint
    const res = await fetch(project.apiUrl);
    const data = await res.json();
    const resKml = await fetch(project.kmlUrl)
    const kmlData = await resKml.text()
    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlData, 'text/xml');
    let geojsonData;
    try {
      // Convert KML to GeoJSON
      geojsonData = toGeoJSON.kml(kmlDoc);
      console.log("Successfully converted KML to GeoJSON. Features found:", geojsonData.features.length);
    } catch (error) {
      console.error("Error converting KML to GeoJSON:", error);
      // If conversion fails, pass an empty GeoJSON object to prevent crashes
      geojsonData = { type: 'FeatureCollection', features: [] };
    }
  
    data["kmlData"] = geojsonData;

    // Pass the project details and fetched data as props to the component
    return {
      props: {
        project: {
          name: project.name,
          location: project.location,
          data: data,
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching data for ${projectHostname}:`, error);
    // You can handle this error gracefully on the frontend as well
    return {
      props: {
        project: {
          name: project.name,
          location: project.location,
          data: null, // Return null data to indicate an error
          error: 'Failed to fetch project data.',
        },
      },
    };
  }
}


// The main component that renders the UI
export default function ProjectPage({ project }) {
  if (!project) {
    return <div>Project not found.</div>;
  }

  if (project.error) {
    return <div>Error: {project.error}</div>;
  }
  const data = project.data
  const user = true
  const totalAcreage = data["impactData"]["acreage"]["total"];
  const waterSaved = totalAcreage * 3.004;
  const emissionReduced = totalAcreage * 0.9656;
  const fertilizerSaved = totalAcreage * 0.09;
  const ureaSubsidySaved = totalAcreage * 0.046;
  const paddyYieldIncrease = totalAcreage * 0.76;
  const farmerIncomeIncrease = totalAcreage * 0.38354;

  return (
    <Layout title={project.name}>
    {user ? (
      <>
        <Box sx={{ my: 4 }}>

          <Typography variant="h4" component="h1" gutterBottom align='center' color={'#606060'}>
            {project.name}
          </Typography>
          <Typography variant="subtitle1" display="block" gutterBottom align='center' color={'grey'}>
            {project.location}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              '& > :not(style)': {
                m: 1,
                width: { xs: '45%', md: '30%' },
                margin: "0.5em auto",
              },
            }}
          >
            <Paper2 elevation={3} sx={{ background: "rgb(23, 109, 10)" }}>
              <Typography color="#ddd" variant="subtitle2"
              >Total UDP acreage</Typography>
              <Typography color="#fff" variant='h4' component="p">
                <CountUp end={totalAcreage} duration={5} />
              </Typography>
              <Typography color="#ddd" variant="subtitle2">Acres</Typography>
            </Paper2>

            <Paper2 elevation={3} sx={{ background: "#f8b400" }}>
              <Typography color="#ddd" variant="subtitle2"
              >Villages impacted</Typography>
              <Typography color="#fff" variant='h4' component="p">
                <CountUp end={data["impactData"]["vill_count"]["total"]} duration={5} />
              </Typography>
              <Typography color="#ddd" variant="subtitle2">&nbsp;</Typography>
            </Paper2>

            <Paper2 elevation={3} sx={{ background: "#005792" }}>
              <Typography color="#ddd" variant="subtitle2">Fertilizer Saved (projected)</Typography>
              <Typography color="#fff" variant='h4' component="p">
                <CountUp end={fertilizerSaved} duration={5}  />
              </Typography>
              <Typography color="#ddd" variant="subtitle2">metric ton</Typography>
            </Paper2>

            <Paper2 elevation={3} sx={{ background: "#4e9bbf" }}>
              <Typography color="#ddd" variant="subtitle2">Water Saved (projected)</Typography>
              <Typography color="#fff" variant='h4' component="p">
                <CountUp end={waterSaved} duration={5}  />
              </Typography>
              <Typography color="#ddd" variant="subtitle2">TCM (Thousand m³)</Typography>
            </Paper2>

            <Paper2 elevation={3} sx={{ background: "#dc2f2f" }}>
              <Typography color="#ddd" variant="subtitle2">Emission Reduced (projected)</Typography>
              <Typography color="#fff" variant='h4' component="p">
                <CountUp end={emissionReduced} duration={5}  />
              </Typography>
              <Typography color="#ddd" variant="subtitle2">metric ton</Typography>
            </Paper2>

            <Paper2 elevation={3} sx={{ background: "#8e44ad" }}>
              <Typography color="#ddd" variant="subtitle2">Urea Subsidy Saved (projected)</Typography>
              <Typography color="#fff" variant='h4' component="p">
                <CountUp end={ureaSubsidySaved} duration={5}  />
              </Typography>
               <Typography color="#ddd" variant="subtitle2">lakh ₹</Typography>
            </Paper2>

            <Paper2 elevation={3} sx={{ background: "#27ae60" }}>
              <Typography color="#ddd" variant="subtitle2">Paddy Yield Increase (projected)</Typography>
              <Typography color="#fff" variant='h4' component="p">
                <CountUp end={paddyYieldIncrease} duration={5}  />
              </Typography>
              <Typography color="#ddd" variant="subtitle2">metric ton</Typography>
            </Paper2>

            <Paper2 elevation={3} sx={{ background: "#2980b9" }}>
              <Typography color="#ddd" variant="subtitle2">Farmer Income Increase (projected)</Typography>
              <Typography color="#fff" variant='h4' component="p">
                <CountUp end={farmerIncomeIncrease} duration={5}  />
              </Typography>
              <Typography color="#ddd" variant="subtitle2">lakh ₹</Typography>
            </Paper2>
          </Box>
          <Typography variant="caption" display="block" gutterBottom align='center' color={'grey'}>
            *Projected numbers are based on past project data.
          </Typography>

          <DMap mapData={data} />
          <Chart chartData={data} />

        </Box>
      </>) : "Please, login to access dashboard"}
  </Layout>
  );
}
