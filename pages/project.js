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


// The single, unified Apps Script URL.
const APPS_SCRIPT_BASE_URL = "https://script.google.com/macros/s/AKfycbz_RT3XRhkgntax0Mdkjf6EgPpLd0Cvej9xEjWfKk14C44xqL61llLgHI5P2r1UoZ58nQ/exec";

export async function getServerSideProps(context) {
  const { projectHostname } = context.query;
  const projectDetails = projectsConfig[projectHostname];

  if (!projectDetails) {
    return { notFound: true };
  }

  try {
    // Construct the full API URL with the specific projectId
    const fullApiUrl = `${APPS_SCRIPT_BASE_URL}?projectId=${projectDetails.projectId}`;
    
    // Fetch data from the single Apps Script web app
    const res = await fetch(fullApiUrl);
    const data = await res.json();

    // Check for an error from the Apps Script itself
    if (data.error) {
      throw new Error(`Backend Error: ${data.error}`);
    }

    // Fetch KML data separately
    const resKml = await fetch(projectDetails.kmlUrl);
    const kmlData = await resKml.text();

    // Basic validation to ensure we received KML, not an HTML error page
    if (kmlData.trim().startsWith('<!DOCTYPE html>')) {
      throw new Error('Failed to fetch KML data. Check file permissions.');
    }

    const parser = new DOMParser();
    const kmlDoc = parser.parseFromString(kmlData, 'text/xml');
    let geojsonData;
    try {
      geojsonData = toGeoJSON.kml(kmlDoc);
    } catch (error) {
      console.error("Error converting KML to GeoJSON:", error);
      geojsonData = { type: 'FeatureCollection', features: [] };
    }
  
    data["kmlData"] = geojsonData;

    // Pass the project details and fetched data as props to the component
    return {
      props: {
        project: {
          name: projectDetails.name,
          location: projectDetails.location,
          data: data,
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching data for ${projectHostname}:`, error);
    return {
      props: {
        project: {
          name: projectDetails.name,
          location: projectDetails.location,
          data: null,
          error: `Failed to fetch project data. Reason: ${error.message}`,
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
