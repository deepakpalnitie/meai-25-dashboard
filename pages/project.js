import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import projectsConfig from '../projects.json';
import impactDefinitions from '../impact.json';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import CountUp from 'react-countup';
import Layout from "../components/Layout";
import DMap from '../components/DMap';
import Chart from '../components/Chart';
import { styled } from '@mui/material/styles';

const Paper2 = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  verticalAlign: "middle",
  padding: "1.5em 0",
}));

// A simple fetcher function for useSWR
const fetcher = (url) => fetch(url).then((res) => res.json());

// The main component that renders the UI
export default function ProjectPage() {
  const router = useRouter();
  const { projectHostname } = router.query;

  // Get static project details from the config file
  const projectDetails = projectHostname ? projectsConfig[projectHostname] : null;

  // Use SWR to fetch dynamic data from our API route
  const { data, error } = useSWR(
    projectHostname ? `/api/project-data?projectHostname=${projectHostname}` : null,
    fetcher
  );

  // --- Render Loading State ---
  if (!projectDetails) {
    // This can happen on the first render when router.query is not yet populated
    return <Layout title="Loading..."><Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box></Layout>;
  }

  if (error) {
    return (
      <Layout title={`Error - ${projectDetails.name}`}>
        <Alert severity="error" sx={{ m: 2 }}>
          Failed to load project data. The backend may be temporarily unavailable. Please try again later.
        </Alert>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout title={`Loading - ${projectDetails.name}`}>
        <Typography variant="h4" component="h1" gutterBottom align='center' color={'#606060'} sx={{mt: 4}}>
          {projectDetails.name}
        </Typography>
        <Typography variant="subtitle1" display="block" gutterBottom align='center' color={'grey'}>
          {projectDetails.location}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }
  
  // --- Render Dashboard with Data ---
  return (
    <Layout title={projectDetails.name}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align='center' color={'#606060'}>
          {projectDetails.name}
        </Typography>
        <Typography variant="subtitle1" display="block" gutterBottom align='center' color={'grey'}>
          {projectDetails.location}
        </Typography>

        {/* Only render the dashboard content if data is available */}
        {data ? (
          <>
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
                <Typography color="#ddd" variant="subtitle2">Total UDP acreage</Typography>
                <Typography color="#fff" variant='h4' component="p"><CountUp end={data.impactData.acreage.total} duration={5} /></Typography>
                <Typography color="#ddd" variant="subtitle2">Acres</Typography>
              </Paper2>
              <Paper2 elevation={3} sx={{ background: "#f8b400" }}>
                <Typography color="#ddd" variant="subtitle2">Villages impacted</Typography>
                <Typography color="#fff" variant='h4' component="p"><CountUp end={data.impactData.vill_count.total} duration={5} /></Typography>
                <Typography color="#ddd" variant="subtitle2">&nbsp;</Typography>
              </Paper2>

              {projectDetails.metrics && projectDetails.metrics.map((metricKey) => {
                const metricMap = {
                  farmersServed: {
                    label: "Farmers Served",
                    value: data.impactData.frmr_count.total,
                    color: "#005792"
                  },
                  plotsCovered: {
                    label: "Plots Covered",
                    value: data.impactData.plot_count.total,
                    color: "#dc2f2f"
                  }
                };
                const metric = metricMap[metricKey];
                if (!metric) return null;

                return (
                  <Paper2 key={metricKey} elevation={3} sx={{ background: metric.color }}>
                    <Typography color="#ddd" variant="subtitle2">{metric.label}</Typography>
                    <Typography color="#fff" variant='h4' component="p">
                      <CountUp end={metric.value} duration={5} />
                    </Typography>
                    <Typography color="#ddd" variant="subtitle2">&nbsp;</Typography>
                  </Paper2>
                );
              })}
              
              {projectDetails.impactNumbers && projectDetails.impactNumbers.map((impactKey, index) => {
                const impactDef = impactDefinitions[impactKey];
                if (!impactDef) return null;

                const acreage = data.impactData.acreage.total;
                const value = eval(impactDef.formula.replace(/acreage/g, acreage));
                const colors = ["#005792", "#4e9bbf", "#dc2f2f", "#8e44ad", "#27ae60", "#2980b9"];
                const color = colors[index % colors.length];

                return (
                  <Paper2 key={impactKey} elevation={3} sx={{ background: color }}>
                    <Typography color="#ddd" variant="subtitle2">{impactDef.label} (projected)</Typography>
                    <Typography color="#fff" variant='h4' component="p"><CountUp end={value} duration={5} /></Typography>
                    <Typography color="#ddd" variant="subtitle2">{impactDef.unit}</Typography>
                  </Paper2>
                );
              })}
            </Box>
            <Typography variant="caption" display="block" gutterBottom align='center' color={'grey'}>
              *Projected numbers are based on past project data.
            </Typography>
            <DMap mapData={data} projectHostname={projectHostname} />
            <Chart chartData={data} />
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Layout>
  );
}

