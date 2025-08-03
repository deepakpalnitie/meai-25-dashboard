import * as React from 'react';
const { DOMParser } = require('@xmldom/xmldom');
const toGeoJSON = require('@mapbox/togeojson');

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
import Kml from '../components/Kml';


import Chart from '../components/Chart';
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

  // background: "linear-gradient(180deg, rgba(23, 109, 10, 1) 0 %, rgba(40, 253, 82, 1) 100 %, rgba(162, 255, 153, 1) 100 %)"
  // boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.25)",
  // borderRadius: "25px",
}));

// import faker from 'faker';



// const map = {
//     position: "absolute",
//     left: "33.3333%",
//     width: "66.6666%",
//     top: 0,
//     bottom: 0,
// }
// const useStyles = makeStyles((theme) => ({
//   // root: {
//   //     '& > *': {
//   //         margin: theme.spacing(1)
//   //     },
//   // },
//   map : {
//     position: "absolute",
//     left: "33.3333%",
//     width: "66.6666%",
//     top: 0,
//     bottom: 0,
// }
// }));



export default function Index({ data }) {
  // const [kmlData, setKmlData] = useState(null);
  console.log("data", data)

  // const classes = useStyles();
  // const user = useUser();
  const user = useUser({ redirectTo: '/login' })
  // console.log("User2.")
  // console.log(user)
  // useEffect(() => {
  //   const fetchKmlData = async () => {
  //     try {
  //       const response = await axios.get('https://drive.google.com/file/d/1FxilVqy1eTqg7R_cn6J9DJSra672HBw3/view?usp=drivesdk'); // Replace with your KML URL
  //       setKmlData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching KML data:', error);
  //     }
  //   };

  //   fetchKmlData();
  // }, []);

  return (
    <Layout title="Dashboard">
      {user ? (
        <>
          <Box sx={{ my: 4 }}>
            {/* <Typography variant="h3" component="h2" gutterBottom align='center' color={ 'green'}>
          Dashboard
        </Typography> */}
            <Typography variant="h4" component="h1" gutterBottom align='center' color={'#606060'}>
              MEAI CSR Project, 2025
            </Typography>
            <Typography variant="subtitle1" display="block" gutterBottom align='center' color={'grey'}>
              Lakhimpur Kheri, Uttar Pradesh
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                  m: 1,
                  width: "45%",
                  margin: "0.5em auto",
                  // height: 128,
                },
              }}
            >
              <Paper2 elevation={3} sx={{ background: "rgb(23, 109, 10)" }}>
                <Typography color="#999"
                >Total UDP acreage</Typography>
                <Typography color="#eee" variant='h4' component="p">
                  <CountUp end={data["impactData"]["acreage"]["total"]} suffix=" Acres" duration={5} />
                </Typography>
              </Paper2>

              <Paper2 elevation={3} sx={{ background: "#f8b400" }}>
                <Typography color="#999"
                >Villages impacted</Typography>
                <Typography color="#eee" variant='h4' component="p">
                  <CountUp end={data["impactData"]["vill_count"]["total"]} duration={5} />
                </Typography>
              </Paper2>

              <Paper2 elevation={3} sx={{ background: "#005792" }}>
                <Typography color="#999">Farmers served</Typography>
                <Typography color="#eee" variant='h4' component="p">
                  <CountUp end={data["impactData"]["frmr_count"]["total"]} duration={5} />
                </Typography>
              </Paper2>

              <Paper2 elevation={3} sx={{ background: "#dc2f2f" }}>
                <Typography color="#999">Plots covered</Typography>
                <Typography color="#eee" variant='h4' component="p">
                  <CountUp end={data["impactData"]["plot_count"]["total"]} duration={5} />
                </Typography>
              </Paper2>
            </Box>

            {/* <Link href="/about" color="secondary">
          Go to the about page
        </Link> */}
            <DMap mapData={data} />
            <Chart chartData={data} />


            {/* <Div>{"This div's text looks like that of a button."}</Div> */}


            {/* <div id="map" className={classes.map}></div> */}
            {/* <ProTip />
        <Copyright /> */}

          </Box>
        </>) : "Please, login to access dashboard"}
      {/* test */}
      {/* <div>
        <h1>Display KML Data on Map</h1>
        {kmlData && <Kml kmlData={kmlData} />}
      </div> */}
    </Layout>
  );
}

export async function getStaticProps() {
  let data = {}
  // data["mapData"]=[]
  const res = await fetch('https://script.google.com/macros/s/AKfycbyflnRO_gASdkIOIVr9lAlIXi2OoleIewbqeFzTbxF6e1Wmu8rsSZHT9h1bC8IsMwC9/exec') // this is currently working for MEAI-25, Palwal Project
  // const res = await fetch('https://script.google.com/macros/s/AKfycbyT8ywuMljvrjTtIDfGg4jTLsaxS_wjMwCmada2lxUVen-O5ya5QX8F9pEnoQ5AoXAe/exec') // this is currently working for AAI Lakhimpur Project
  // const res = await fetch('https://script.google.com/macros/s/AKfycbwf6ZeWZ7D5BAkDtlu45BxynrWkYjKqP_ysrHfIwCxT0WUQw22rmaBXgP911AiM8-Gl/exec') // this was for MEAI Palwal, Haryana Project
  

  // const res2 = await fetch('https://drive.google.com/uc?export=download&id=1U6I9WkhTrIXQ_Yo6gCCfvg2K4RmPvKgZ')
  const resKml = await fetch('https://drive.google.com/uc?export=download&id=1glLFP_YF4c30odgdMjYBc___D_9KA_Zv')
  // https://drive.google.com/file/d/1glLFP_YF4c30odgdMjYBc___D_9KA_Zv/view?usp=drive_link // MEAI-25
  // https://drive.google.com/file/d/1K1vM4yc6TcTSJQ1NGU5jwTpFiIfzO88-/view?usp=drive_link
  // const resKml = await fetch('https://drive.google.com/uc?export=download&id=1pDedPqAUQtHu70f0fZzRFVV_vDFQ2emd')
  // https://drive.google.com/file/d/1pDedPqAUQtHu70f0fZzRFVV_vDFQ2emd/view?usp=drive_link

  // .then(response => {
  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }
  //   console.log("Till res2",response.text())
  //   return response.text();
  // })
  // .then(xmlText => {
  //   const parser = new DOMParser();
  //   const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
  //   // Now you can work with the parsed XML document (e.g., extract data)
  //   console.log(xmlDoc);
  // })
  // .catch(error => {
  //   console.error('There was a problem with the fetch operation:', error);
  // });

  data = await res.json()
  const kmlData = await resKml.text()
  //   const kmlData = `<?xml version="1.0" encoding="UTF-8"?>
  // <kml xmlns="http://www.opengis.net/kml/2.2">
  // <Document>
  // <Style id='BMPoly'>
  // <LineStyle>
  // <color>ffff0000</color>
  // <width>1.2</width>
  // </LineStyle>
  // <PolyStyle>
  // <color>ff00ff00</color>
  // <fill>1</fill>
  // </PolyStyle>
  // </Style>
  // <Placemark>
  // <styleUrl>#BMPoly</styleUrl>
  // <name>Jitender Plot 1 </name>
  // <description>Bamnikhera</description>
  // <Polygon>
  // <outerBoundaryIs>
  // <LinearRing>
  // <coordinates>
  // 77.33040735125542,28.0623611482164,0
  // 77.33206629753113,28.06234250905015,0
  // 77.33203444629908,28.063247836246475,0
  // 77.33122508972883,28.063250203104968,0
  // 77.33125559985638,28.062819434000847,0
  // 77.3304046690464,28.062810558245666,0
  // </coordinates>
  // </LinearRing>
  // </outerBoundaryIs>
  // </Polygon>
  // </Placemark>
  // <Placemark>
  // <styleUrl>#BMPoly</styleUrl>
  // <name>Jitender Plot 2</name>
  // <description>Bamnikhera</description>
  // <Polygon>
  // <outerBoundaryIs>
  // <LinearRing>
  // <coordinates>
  // 77.33124755322933,28.065075331341486,0
  // 77.33202170580626,28.06507710645516,0
  // 77.33205556869507,28.064134812815908,0
  // 77.33122307807207,28.064171498813913,0
  // </coordinates>
  // </LinearRing>
  // </outerBoundaryIs>
  // </Polygon>
  // </Placemark>
  // </Document>
  // </kml>`

  // const parser = new DOMParser();
  //   const xmlDoc = parser.parseFromString(kmlData, 'text/xml');
  //   // Now you can work with the parsed XML document (e.g., extract data)
  console.log("kmldata res", kmlData.substring(0, 500)); // Log first 500 chars to check if it's valid KML

  const parser = new DOMParser();
  const kmlDoc = parser.parseFromString(kmlData, 'text/xml');
  
  let geojsonData;
  try {
    // Convert KML to GeoJSON
    geojsonData = toGeoJSON.kml(kmlDoc);
    console.log("Successfully converted KML to GeoJSON. Features found:", geojsonData.features.length);
    // You can uncomment the next line for more detailed debugging if needed
    // console.log("geojsonData from index.js", JSON.stringify(geojsonData, null, 2));
  } catch (error) {
    console.error("Error converting KML to GeoJSON:", error);
    // If conversion fails, pass an empty GeoJSON object to prevent crashes
    geojsonData = { type: 'FeatureCollection', features: [] };
  }

  data["kmlData"] = geojsonData;
  return {
    props: {
      data,
      kmlData: geojsonData
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 2 seconds
    revalidate: 2, // In seconds
  }
}
