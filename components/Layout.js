import React from 'react'
import Head from 'next/head'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import AppBar from "../components/Appbar"

export default function Layout (props)  {
    let { title } = props
    return (
        <>
            <Head>
                <title>{title + " - MEAI CSR Project"}</title>
            </Head>
            <AppBar title={title} />
            <Container maxWidth="sm" disableGutters>
                <Box mx={1} my={1}>{props.children}</Box>
            </Container>
        </>
    )
}
